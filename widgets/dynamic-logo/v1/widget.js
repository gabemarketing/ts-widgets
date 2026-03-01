(function () {

    const WIDGET_ID = 'dynamic-logo';

    const WIDGET_CSS = `
.ms-dynamic-logo {
  height: 100%;
  display: flex;
  align-items: center;
}

.ms-dynamic-logo .dynamic-logo-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ms-dynamic-logo .dynamic-logo-container a {
  display: inline-flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
}

.ms-dynamic-logo .dynamic-logo-image {
  max-width: 100%;
  width: auto;
  height: 100%;
  object-fit: contain;
  display: block;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.ms-dynamic-logo .dynamic-logo-image.logo-visible {
  opacity: 1;
}
`;

    function injectCSS() {
        if (document.getElementById('ms-css-' + WIDGET_ID)) return;
        var style = document.createElement('style');
        style.id = 'ms-css-' + WIDGET_ID;
        style.textContent = WIDGET_CSS;
        (document.body || document.head).appendChild(style);
    }

    async function init(container, props) {

        if (!window.MSLicenseCheck) {
            container.innerHTML = '<div style="padding:12px;color:#888;font-size:13px;">License module unavailable.</div>';
            return;
        }
        var licensed = await window.MSLicenseCheck(WIDGET_ID);
        if (!licensed) {
            container.innerHTML = '<div style="padding:12px;color:#888;font-size:13px;">Inactive license</div>';
            return;
        }

        injectCSS();

        var data = (props && props.dudaData) ? props.dudaData : { config: {} };
        var config = data.config || {};

        // Add scoping class to the container
        container.classList.add('ms-dynamic-logo');

        // Read config values passed from the Duda widget panel
        var defaultLogoUrl = config.defaultLogoUrl || '';
        var defaultLogoAlt = config.defaultLogoAlt || '';
        // Duda link content fields return an object like { href: "...", target: "_blank" }
        // resolveLink() extracts the plain URL string from whatever Duda gives us.
        function resolveLink(val) {
            if (!val) return '';
            if (typeof val === 'string') return val;
            if (typeof val === 'object') return val.href || val.url || val.link || '';
            return '';
        }

        var logoLinkHref = resolveLink(config.logoLink) || '#';
        var logoLinkTarget = (config.logoLink && config.logoLink.target) ? config.logoLink.target : '_self';
        var collectionName = config.collectionName || '';
        var exclusionStrings = config.exclusionStrings || '';

        // Render WITHOUT src — we set it only after we know which logo to show
        // This prevents the default logo from downloading and flashing on brand pages
        container.innerHTML = `
<div class="dynamic-logo-container">
  <a href="${logoLinkHref}" target="${logoLinkTarget}">
    <img
      alt="${defaultLogoAlt}"
      class="dynamic-logo-image"
      data-default-src="${defaultLogoUrl}"
      data-default-alt="${defaultLogoAlt}"
      data-collection-name="${collectionName}"
    />
  </a>
</div>`;

        const logoImage = container.querySelector('.dynamic-logo-image');
        const logoLink = container.querySelector('a');

        if (!logoImage) return;

        // Apply max-height: use config value if set, otherwise read the container height
        // This makes the logo automatically fill whatever height Duda's Size control sets
        var configuredHeight = config.logoMaxHeight || '';
        if (configuredHeight) {
            // Config provides an explicit override (e.g. "120px")
            logoImage.style.maxHeight = configuredHeight;
        } else {
            // Fall back to the widget container's rendered height
            var containerHeight = container.clientHeight || container.offsetHeight;
            if (containerHeight > 0) {
                logoImage.style.maxHeight = containerHeight + 'px';
            }
            // If container height is 0 (not yet laid out), CSS height:100% handles it
        }

        // ── Helpers ───────────────────────────────────────────────────────

        const toSlug = (text) => {
            if (!text || typeof text !== 'string') return '';
            return text
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        };

        // showLogo — sets the final src/alt/href and reveals ONLY after the image has loaded.
        // Called with no args → shows default logo. Called with brand args → shows brand logo.
        // `revealed` guard: if fallback fires first, a brand logo call can still replace it.
        let revealed = false;
        const showLogo = (overrideSrc, overrideAlt, overrideHref) => {
            const finalSrc = overrideSrc || defaultLogoUrl;
            const finalAlt = overrideAlt || defaultLogoAlt;

            // If already showing default (via fallback) and this is also default, skip.
            if (revealed && !overrideSrc) return;
            revealed = true;

            if (overrideAlt) logoImage.alt = finalAlt;
            if (overrideHref && logoLink) logoLink.href = overrideHref;

            const reveal = () => logoImage.classList.add('logo-visible');

            if (finalSrc) {
                logoImage.onload = reveal;
                logoImage.onerror = reveal;
                logoImage.src = finalSrc;
            } else {
                reveal();
            }
        };


        // ── URL analysis ──────────────────────────────────────────────────

        let currentPath = window.location.pathname.toLowerCase().replace(/^\/|\/$/g, '');
        const fullUrl = window.location.href.toLowerCase();

        currentPath = currentPath.split('?')[0].split('#')[0];

        const pathSegments = currentPath.split('/').filter(seg => seg.length > 0);
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        const lastSegmentSlug = toSlug(lastSegment);

        // ── Exclusion check ───────────────────────────────────────────────

        if (exclusionStrings && exclusionStrings.trim() !== '') {
            const exclusions = exclusionStrings
                .split(',')
                .map(str => str.trim().toLowerCase())
                .filter(str => str.length > 0);

            const isExcluded = exclusions.some(exc => fullUrl.includes(exc) || currentPath.includes(exc));
            if (isExcluded) {
                showLogo();
                return;
            }
        }

        // If no collection configured, show default logo immediately
        if (!collectionName || collectionName.trim() === '') {
            showLogo();
            return;
        }

        // Fallback: if the collection API is completely unresponsive, show default after 6s.
        // 6s gives plenty of time for license check + widget load + collection API on slow connections.
        // This only fires in truly broken scenarios — normal loads complete in < 2s.
        const fallbackTimeout = setTimeout(() => showLogo(), 6000);

        try {
            const collectionAPI = await dmAPI.loadCollectionsAPI();

            // Fetch ALL items with pagination
            let allItems = [];
            let pageNumber = 0;
            let hasMore = true;
            const pageSize = 100;

            while (hasMore) {
                const collectionData = await collectionAPI
                    .data(collectionName)
                    .pageSize(pageSize)
                    .pageNumber(pageNumber)
                    .get();

                if (collectionData && collectionData.values && collectionData.values.length > 0) {
                    allItems = allItems.concat(collectionData.values);
                    hasMore = collectionData.values.length === pageSize;
                    pageNumber++;
                } else {
                    hasMore = false;
                }
            }

            if (allItems.length === 0) {
                clearTimeout(fallbackTimeout);
                showLogo();
                return;
            }

            // ── Build lookup sets / maps ───────────────────────────────────

            const stateSet = new Set();
            const citySet = new Set();
            const brandUrlParams = new Set();
            const brandDataMap = new Map(); // brandParam → brand data

            for (let item of allItems) {
                const mState = item.data['M.state'];
                if (mState && typeof mState === 'string') stateSet.add(toSlug(mState));

                const mCity = item.data['M.city'];
                if (mCity && typeof mCity === 'string') citySet.add(toSlug(mCity));

                const pageItemUrl = item.data['page_item_url'];
                if (pageItemUrl && typeof pageItemUrl === 'string') {
                    const urlParts = pageItemUrl.split('/').filter(p => p.length > 0);
                    // Brand param is at index 2 (state/city/brand-param/facility-slug)
                    if (urlParts.length >= 3) {
                        const brandParam = urlParts[2];
                        if (brandParam) {
                            brandUrlParams.add(brandParam);
                            if (!brandDataMap.has(brandParam)) {
                                brandDataMap.set(brandParam, {
                                    brandLogo: item.data['M.brand-logo-img'],
                                    brandLogoAlt: item.data['M.brand-logo-img-alt'],
                                    brandLogoLink: item.data['M.brand-logo-link'],
                                    brandName: item.data['M.fac-brand']
                                });
                            }
                        }
                    }
                }
            }

            // ── Step 1: STATE page — show default logo ──────────────────────

            if (stateSet.has(lastSegmentSlug)) {
                clearTimeout(fallbackTimeout);
                showLogo();
                return;
            }

            // ── Step 2: CITY page — show default logo ───────────────────────

            if (citySet.has(lastSegmentSlug)) {
                clearTimeout(fallbackTimeout);
                showLogo();
                return;
            }

            // ── Step 3: BRAND page — swap to brand logo ─────────────────────

            if (brandUrlParams.has(lastSegmentSlug)) {
                const bd = brandDataMap.get(lastSegmentSlug);
                clearTimeout(fallbackTimeout);
                if (bd && bd.brandLogo) {
                    showLogo(bd.brandLogo, bd.brandLogoAlt || null, null);
                } else {
                    showLogo();
                }
                return;
            }

            // ── Step 4: FACILITY page — match by M.slug or page_item_url ────

            let matchedItem = null;

            for (let item of allItems) {
                const mSlug = item.data['M.slug'];
                const pageItemUrl = item.data['page_item_url'];
                const brandLogo = item.data['M.brand-logo-img'];

                if (!brandLogo) continue;

                if (mSlug && typeof mSlug === 'string') {
                    if (toSlug(mSlug) === lastSegmentSlug) {
                        matchedItem = item.data;
                        break;
                    }
                }

                if (!matchedItem && pageItemUrl && typeof pageItemUrl === 'string') {
                    const piu = pageItemUrl.toLowerCase();
                    if (currentPath.includes(piu)) {
                        matchedItem = item.data;
                        break;
                    }
                }
            }

            clearTimeout(fallbackTimeout);
            if (matchedItem) {
                const brandLogo = matchedItem['M.brand-logo-img'];
                const brandLogoAlt = matchedItem['M.brand-logo-img-alt'];
                const brandLogoLink = resolveLink(matchedItem['M.brand-logo-link']);
                if (brandLogo) {
                    showLogo(brandLogo, brandLogoAlt || null, brandLogoLink || null);
                } else {
                    showLogo();
                }
            } else {
                showLogo();
            }

        } catch (error) {
            console.error('[Dynamic Logo] Error:', error);
            clearTimeout(fallbackTimeout);
            showLogo();
        }
    }

    // ── Register widget ───────────────────────────────────────────────────────

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init };

})();
