/**
 * Marketing.Storage Widget Suite — Shared License Check Module
 *
 * FILE LOCATION IN GITHUB: _shared/license-check.js
 * LIVE URL: https://widgets.marketing.storage/_shared/license-check.js
 *
 * HOW IT WORKS:
 * Every widget loads this file first, then calls:
 *   window.MSLicenseCheck("adv-nav-desktop")
 *
 * It automatically reads:
 *   - The current site domain (from browser)
 *   - The Duda site ID (from Duda's editor API, for editor preview)
 * Then asks the Cloudflare Worker: "is this combo licensed for this widget?"
 * Returns: true (show widget) or false (show "Inactive license")
 */

(function () {
    // Only define once — if another widget already loaded this, skip
    if (window.MSLicenseCheck) return;

    /**
     * Check if a widget is licensed for the current site.
     * @param {string} widgetName - e.g. "adv-nav-desktop"
     * @returns {Promise<boolean>}
     */
    window.MSLicenseCheck = async function (widgetName) {
        const LICENSE_API = "https://widgets.marketing.storage/license";

        // Get the current domain (live site)
        const site = window.location.hostname.toLowerCase().replace(/^www\./, "");

        // Get the Duda site ID (works inside the Duda editor)
        // dmAPI is Duda's built-in JavaScript API available when in editor mode
        let siteid = "";
        try {
            if (window.dmAPI && typeof window.dmAPI.getSiteAlias === "function") {
                siteid = window.dmAPI.getSiteAlias() || "";
            }
        } catch (_) { }

        // Build the request URL
        const params = new URLSearchParams();
        if (site) params.set("site", site);
        if (siteid) params.set("siteid", siteid);
        if (widgetName) params.set("widget", widgetName);

        try {
            const res = await fetch(`${LICENSE_API}?${params.toString()}`);
            if (!res.ok) return false;
            const data = await res.json();
            return data.ok === true;
        } catch (_) {
            // Network error, Apps Script down, etc. → fail closed (deny)
            return false;
        }
    };
})();
