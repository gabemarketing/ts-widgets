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

    window.MSLicenseCheck = async function (widgetName) {
        var LICENSE_API = "https://widgets.marketing.storage/license";

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

        var params = new URLSearchParams();
        if (site) params.set("site", site);
        if (siteid) params.set("siteid", siteid);
        if (widgetName) params.set("widget", widgetName);

        try {
            var res = await fetch(LICENSE_API + "?" + params.toString());
            if (!res.ok) return false;
            var data = await res.json();
            if (!data.ok) return false;
            // Return the full result object — wrappers use widgetUrl, widget.js treats it as truthy
            return data;
        } catch (_) {
            return false;
        }
    };
})();
