/**
 * Marketing.Storage Widget Suite — Shared License Check Module
 *
 * FILE LOCATION IN GITHUB: _shared/license-check.js
 * LIVE URL: https://widgets.marketing.storage/_shared/license-check.js
 *
 * HOW IT WORKS:
 * Every widget wrapper loads this file first, then calls:
 *   window.MSLicenseCheck("adv-nav-desktop")
 *
 * It reads:
 *   - The current site domain (from browser, for live sites)
 *   - The Duda site ID (from the editor URL, for editor preview)
 * Then asks the Cloudflare Worker: "is this site licensed for this widget?"
 *
 * RETURN VALUE:
 *   { ok: true, widgetUrl: "/widgets/.../v1/widget.js" }  — licensed
 *   false                                                  — not licensed / error
 *
 * The widgetUrl tells the wrapper exactly which version file to load.
 * It is resolved server-side based on the client's version channel:
 *   stable → current production version (auto-updates when you release)
 *   beta   → preview version
 *   locked → frozen to the URL captured at lock time (never updates)
 *
 * widget.js files can treat the return value as truthy/falsy for their
 * own license gate — { ok: true, ... } is truthy, false is falsy.
 */

(function () {
    if (window.MSLicenseCheck) return;

    var LICENSE_API = "https://widgets.marketing.storage/license";
    var CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — matches Worker edge cache
    var CACHE_PREFIX = "ms_lic_";

    function getCached(key) {
        try {
            var raw = sessionStorage.getItem(CACHE_PREFIX + key);
            if (!raw) return null;
            var entry = JSON.parse(raw);
            if (Date.now() > entry.expires) {
                sessionStorage.removeItem(CACHE_PREFIX + key);
                return null;
            }
            return entry.data;
        } catch (_) { return null; }
    }

    function setCached(key, data) {
        try {
            sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
                data: data,
                expires: Date.now() + CACHE_TTL_MS
            }));
        } catch (_) { /* ignore if sessionStorage is unavailable */ }
    }

    window.MSLicenseCheck = async function (widgetName) {
        var hostname = window.location.hostname.toLowerCase();
        var isEditor = (hostname === "my.duda.co");

        var site = "";
        var siteid = "";

        if (isEditor) {
            var pathMatch = window.location.pathname.match(/\/site\/([a-z0-9]+)/i);
            siteid = pathMatch ? pathMatch[1].toLowerCase() : "";
        } else {
            site = hostname.replace(/^www\./, "");
        }

        if (!site && !siteid) return false;

        // Check sessionStorage first (skip in editor so previews always reflect live state)
        var cacheKey = (site || siteid) + "_" + (widgetName || "");
        if (!isEditor) {
            var cached = getCached(cacheKey);
            if (cached) return cached;
        }

        var params = new URLSearchParams();
        if (site) params.set("site", site);
        if (siteid) params.set("siteid", siteid);
        if (widgetName) params.set("widget", widgetName);

        try {
            var res = await fetch(LICENSE_API + "?" + params.toString());
            if (!res.ok) return false;
            var data = await res.json();
            if (!data.ok) return false;
            // Only cache positive results — revocations (ok:false) take effect on next page load
            if (!isEditor) setCached(cacheKey, data);
            return data;
        } catch (_) {
            return false;
        }
    };
})();
