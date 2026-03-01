(function () {

    const WIDGET_ID = 'dynamic-logo';

    const WIDGET_CSS = `
.ms-dynamic-logo .dynamic-logo-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ms-dynamic-logo .dynamic-logo-container a {
  display: inline-block;
  text-decoration: none;
}

.ms-dynamic-logo .dynamic-logo-image {
  max-width: 100%;
  height: auto;
  max-height: 70px;
  object-fit: contain;
  display: block;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.ms-dynamic-logo .dynamic-logo-image.logo-visible {
  opacity: 1;
}

@media (max-width: 767px) {
  .ms-dynamic-logo .dynamic-logo-image {
    max-height: 50px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .ms-dynamic-logo .dynamic-logo-image {
    max-height: 70px;
  }
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
        var logoLinkHref = config.logoLink || '#';
        var collectionName = config.collectionName || '';
        var exclusionStrings = config.exclusionStrings || '';

        // Render the base HTML (mirrors the Duda HTML tab)
        container.innerHTML = `
<div class="dynamic-logo-container">
  <a href="${logoLinkHref}" target="_self">
    <img
      src="${defaultLogoUrl}"
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

        const showLogo = () => {
            logoImage.classList.add('logo-visible');
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

        // Fallback timeout — show default if collection lookup takes too long
        const fallbackTimeout = setTimeout(() => showLogo(), 2000);

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
                if (bd && bd.brandLogo) {
                    logoImage.src = bd.brandLogo;
                    if (bd.brandLogoAlt) logoImage.alt = bd.brandLogoAlt;
                    // Brand pages keep the default link (no logoLink.href update)
                }
                clearTimeout(fallbackTimeout);
                showLogo();
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

            if (matchedItem) {
                const brandLogo = matchedItem['M.brand-logo-img'];
                const brandLogoAlt = matchedItem['M.brand-logo-img-alt'];
                const brandLogoLink = matchedItem['M.brand-logo-link'];

                if (brandLogo) {
                    logoImage.src = brandLogo;
                    if (brandLogoAlt) logoImage.alt = brandLogoAlt;
                    if (logoLink && brandLogoLink) logoLink.href = brandLogoLink;
                }
            }

            clearTimeout(fallbackTimeout);
            showLogo();

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
