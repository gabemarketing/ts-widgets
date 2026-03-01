(function () {

    const WIDGET_ID = 'adv-button';

    const WIDGET_CSS = `
.ms-adv-button {
  display: block;
  width: 100%;
  height: 100%;
}

.ms-adv-button .dynamic-collection-button {
  display: block;
  width: 100%;
  height: 100%;
}

.ms-adv-button .collection-btn-link {
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}

.ms-adv-button .collection-btn {
  background-color: var(--btn-bg-color, #ffffff);
  border: 2px solid var(--btn-border-color, #333333);
  color: var(--btn-color, #333333);
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-shadow: none;
  font-family: inherit;
  opacity: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.2s ease;
}

.ms-adv-button .collection-btn.loaded {
  opacity: 1;
}

.ms-adv-button .collection-btn:hover {
  background-color: var(--btn-hover-bg-color, #007bff);
  border-color: var(--btn-hover-border-color, #007bff);
  color: var(--btn-hover-color, #ffffff);
  box-shadow: none;
}

.ms-adv-button .btn-text {
  display: inline-block;
}

@media (max-width: 767px) {
  .ms-adv-button .collection-btn {
    padding: 10px 20px;
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

    function toSlug(text) {
        if (!text) return '';
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Extracts the brand URL segment from page_item_url.
    // Format: state/city/brand-param/facility-slug → returns brand-param (index 2)
    function extractBrandParam(pageItemUrl) {
        if (!pageItemUrl) return null;
        var parts = pageItemUrl.split('/').filter(function (p) { return p.length > 0; });
        return parts.length >= 2 ? parts[parts.length - 2] : null;
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

        // ── Read config ────────────────────────────────────────────────────
        var defaultPrimary = config.defaultPrimaryColor || '#333333';
        var defaultLight = config.defaultLightColor || '#ffffff';
        var defaultCta = config.defaultCtaColor || '#007bff';
        var defaultLink = config.defaultLink || '#';
        var buttonText = config.buttonText || 'Click Here';
        var fontWeight = config.buttonFontWeight || '600';
        var fontSize = config.buttonFontSize || '16px';
        var openInNewTab = config.openInNewTab === true || config.openInNewTab === 'true';
        var collectionName = config.collectionName || '';
        var exclusionStrings = config.exclusionStrings || '';
        // linkCollectionField: which collection field drives the button href on brand/facility pages.
        // Common values: 'M.brand-pay-link' (Pay/Reserve) · 'M.brand-logo-link' (Brand site)
        var linkCollectionField = config.linkCollectionField || 'M.brand-pay-link';

        container.classList.add('ms-adv-button');

        // Render HTML — opacity:0 until styled (no flash)
        var targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        container.innerHTML = `
<div class="dynamic-collection-button">
  <a href="${defaultLink}" class="collection-btn-link" ${targetAttr}>
    <button class="collection-btn" style="font-weight:${fontWeight};font-size:${fontSize};">
      <span class="btn-text">${buttonText}</span>
    </button>
  </a>
</div>`;

        var button = container.querySelector('.collection-btn');
        var linkElement = container.querySelector('.collection-btn-link');

        if (!button || !linkElement) return;

        // ── Apply default colors (secondary color scheme) ─────────────────
        // Primary → text & border   Light → background   CTA → hover bg/border
        button.style.setProperty('--btn-color', defaultPrimary);
        button.style.setProperty('--btn-border-color', defaultPrimary);
        button.style.setProperty('--btn-bg-color', defaultLight);
        button.style.setProperty('--btn-hover-bg-color', defaultCta);
        button.style.setProperty('--btn-hover-border-color', defaultCta);
        button.style.setProperty('--btn-hover-color', defaultLight);

        var reveal = function () { button.classList.add('loaded'); };

        // ── Exclusion check ───────────────────────────────────────────────
        var currentPath = window.location.pathname.toLowerCase()
            .replace(/^\/|\/$/g, '').split('?')[0];

        if (exclusionStrings && exclusionStrings.trim()) {
            var exclusions = exclusionStrings.split(',')
                .map(function (s) { return s.trim().toLowerCase(); })
                .filter(function (s) { return s.length > 0; });
            if (exclusions.some(function (e) { return currentPath.includes(e); })) {
                setTimeout(reveal, 50);
                return;
            }
        }

        // ── No collection → show default button ───────────────────────────
        if (!collectionName || !collectionName.trim()) {
            setTimeout(reveal, 50);
            return;
        }

        // ── Collection lookup ─────────────────────────────────────────────
        try {
            var collectionAPI = await dmAPI.loadCollectionsAPI();
            var allItems = [];
            var pageNumber = 0;
            var pageSize = 100;
            var hasMore = true;

            while (hasMore) {
                var results = await collectionAPI
                    .data(collectionName)
                    .pageSize(pageSize)
                    .pageNumber(pageNumber)
                    .get();

                if (results && results.values && results.values.length > 0) {
                    allItems = allItems.concat(results.values);
                    hasMore = results.values.length === pageSize;
                    pageNumber++;
                } else {
                    hasMore = false;
                }
            }

            if (allItems.length === 0) { setTimeout(reveal, 50); return; }

            // ── Build lookup sets ─────────────────────────────────────────
            var stateSet = new Set();
            var citySet = new Set();
            var brandParamMap = new Map(); // brand-param → first matching item

            allItems.forEach(function (item) {
                if (item.data['M.state']) stateSet.add(toSlug(item.data['M.state']));
                if (item.data['M.city']) citySet.add(toSlug(item.data['M.city']));

                if (item.page_item_url) {
                    var bp = extractBrandParam(item.page_item_url);
                    if (bp && !brandParamMap.has(bp)) brandParamMap.set(bp, item);
                }
                // Also index normalized M.fac-brand as fallback brand param
                if (item.data['M.fac-brand']) {
                    var nb = toSlug(item.data['M.fac-brand']);
                    if (nb && !brandParamMap.has(nb)) brandParamMap.set(nb, item);
                }
            });

            // ── Match current page ────────────────────────────────────────
            var pathSegments = currentPath.split('/').filter(function (s) { return s.length > 0; });
            var lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
            var prevSegment = pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : '';

            // State or city page → defaults
            if (stateSet.has(lastSegment) || citySet.has(lastSegment)) {
                setTimeout(reveal, 50); return;
            }

            var matchedItem = null;

            // Brand page: last segment is the brand param
            if (brandParamMap.has(lastSegment)) {
                matchedItem = brandParamMap.get(lastSegment);
            }

            // Facility page: second-to-last is brand param, last is facility slug
            if (!matchedItem && prevSegment && brandParamMap.has(prevSegment)) {
                matchedItem = brandParamMap.get(prevSegment);
            }

            // Fallback: match M.slug
            if (!matchedItem) {
                allItems.some(function (item) {
                    if (item.data['M.slug'] && toSlug(item.data['M.slug']) === lastSegment) {
                        matchedItem = item; return true;
                    }
                });
            }

            if (matchedItem) {
                var primaryColor = matchedItem.data['M.c-primary'];
                var lightColor = matchedItem.data['M.c-light'];
                var ctaColor = matchedItem.data['M.c-cta'];
                var dynamicLink = matchedItem.data[linkCollectionField];

                if (primaryColor) {
                    button.style.setProperty('--btn-color', primaryColor);
                    button.style.setProperty('--btn-border-color', primaryColor);
                }
                if (lightColor) {
                    button.style.setProperty('--btn-bg-color', lightColor);
                    button.style.setProperty('--btn-hover-color', lightColor);
                }
                if (ctaColor) {
                    button.style.setProperty('--btn-hover-bg-color', ctaColor);
                    button.style.setProperty('--btn-hover-border-color', ctaColor);
                }
                if (dynamicLink) {
                    linkElement.setAttribute('href', dynamicLink);
                }
            }

        } catch (err) {
            console.warn('[Dynamic Button] Error:', err);
        } finally {
            setTimeout(reveal, 50);
        }
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init };

})();
