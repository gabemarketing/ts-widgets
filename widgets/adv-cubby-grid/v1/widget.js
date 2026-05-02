(function () {

    const WIDGET_ID = 'adv-cubby-grid';

    // ── Minimal scoping CSS for our container ──────────────────────────────
    // All cubby-facility styling is injected dynamically from config values.
    const WIDGET_CSS = `
.ms-adv-cubby-grid {
    display: block;
    width: 100%;
    height: auto;
    min-height: 0;
}
.ms-adv-cubby-grid cubby-facility {
    display: block;
    width: 100%;
}
.ms-adv-cubby-grid .ms-cubby-placeholder {
    padding: 24px;
    color: #888;
    font-size: 13px;
    border: 1px dashed #ccc;
    border-radius: 6px;
    text-align: center;
}
.ms-adv-cubby-grid .ms-cubby-error {
    padding: 24px;
    color: #c0392b;
    font-size: 13px;
    border: 1px dashed #c0392b;
    border-radius: 6px;
    text-align: center;
    background: rgba(192,57,43,.05);
}
`;

    function injectCSS() {
        if (document.getElementById('ms-css-' + WIDGET_ID)) return;
        var style = document.createElement('style');
        style.id = 'ms-css-' + WIDGET_ID;
        style.textContent = WIDGET_CSS;
        (document.body || document.head).appendChild(style);
    }

    // ── Build dynamic Cubby CSS from config values ─────────────────────────
    // Only emits a property/rule if the config value is non-empty.
    function buildCubbyCSS(config) {
        var c = config;

        // Helper: emit a CSS custom property declaration only if value is set
        function prop(cssVar, value) {
            return (value && value.trim) && value.trim() ? '    ' + cssVar + ': ' + value.trim() + ';\n' : '';
        }

        // ── 1. CSS Custom Properties (penetrate Shadow DOM) ────────────────
        var customProps = '';
        customProps += prop('--cubby-primary-color', c.colorPrimary);
        customProps += prop('--cubby-on-primary-color', c.colorOnPrimary);
        customProps += prop('--cubby-secondary-color', c.colorSecondary);
        customProps += prop('--cubby-on-secondary-color', c.colorOnSecondary);
        customProps += prop('--cubby-surface-color', c.colorSurface);
        customProps += prop('--cubby-on-surface-color', c.colorOnSurface);
        customProps += prop('--cubby-outline-color', c.colorOutline);
        customProps += prop('--cubby-divider-color', c.colorDivider);
        customProps += prop('--cubby-success-color', c.colorSuccess);
        customProps += prop('--cubby-heading-font', c.headingFont);
        customProps += prop('--cubby-body-font', c.bodyFont);
        customProps += prop('--cubby-radius', c.globalRadius);
        customProps += prop('--cubby-spacing', c.globalSpacing);
        customProps += prop('--cubby-density', c.globalDensity);
        customProps += prop('--cubby-shadow', c.shadowOverride);

        var css = '';

        if (customProps) {
            css += '.ms-adv-cubby-grid cubby-facility {\n' + customProps + '}\n';
        }

        // ── 2. ::part() overrides ──────────────────────────────────────────

        // Card image — Duda Toggle returns true/false; also handle 'yes'/'no' strings
        var showImageVal = (c.showCardImage !== undefined && c.showCardImage !== null) ? c.showCardImage : true;
        var hideImage = showImageVal === false || showImageVal === 'false' || showImageVal === 'no';
        if (hideImage) {
            css += '.ms-adv-cubby-grid cubby-facility::part(card-image) {\n    display: none;\n}\n';
        }

        // Card title
        var titleDecl = '';
        titleDecl += c.cardTitleFontSize ? '    font-size: ' + c.cardTitleFontSize + ';\n' : '';
        titleDecl += c.cardTitleFontWeight ? '    font-weight: ' + c.cardTitleFontWeight + ';\n' : '';
        titleDecl += c.cardTitleColor ? '    color: ' + c.cardTitleColor + ';\n' : '';
        titleDecl += c.cardTitleTextAlign ? '    text-align: ' + c.cardTitleTextAlign + ';\n' : '';
        if (titleDecl) css += '.ms-adv-cubby-grid cubby-facility::part(card-title) {\n' + titleDecl + '}\n';

        // Feature text
        var featureDecl = '';
        featureDecl += c.featureFontSize ? '    font-size: ' + c.featureFontSize + ';\n' : '';
        featureDecl += c.featureColor ? '    color: ' + c.featureColor + ';\n' : '';
        if (featureDecl) css += '.ms-adv-cubby-grid cubby-facility::part(card-feature) {\n' + featureDecl + '}\n';

        // Feature icon
        if (c.featureIconColor) {
            css += '.ms-adv-cubby-grid cubby-facility::part(card-feature-icon) {\n    color: ' + c.featureIconColor + ';\n}\n';
        }

        // Price amount
        var priceDecl = '';
        priceDecl += c.priceFontSize ? '    font-size: ' + c.priceFontSize + ';\n' : '';
        priceDecl += c.priceColor ? '    color: ' + c.priceColor + ';\n' : '';
        if (priceDecl) css += '.ms-adv-cubby-grid cubby-facility::part(card-price-amount) {\n' + priceDecl + '}\n';

        // Price period
        if (c.pricePeriodFontSize) {
            css += '.ms-adv-cubby-grid cubby-facility::part(card-price-period) {\n    font-size: ' + c.pricePeriodFontSize + ';\n}\n';
        }

        // Strike-through price
        if (c.strikeColor) {
            css += '.ms-adv-cubby-grid cubby-facility::part(card-price-strike-amount) {\n    color: ' + c.strikeColor + ';\n}\n';
        }

        // Buttons (Reserve / Rent / Waitlist)
        var btnDecl = '';
        btnDecl += c.buttonFontSize ? '    font-size: ' + c.buttonFontSize + ';\n' : '';
        btnDecl += c.buttonFontWeight ? '    font-weight: ' + c.buttonFontWeight + ';\n' : '';
        btnDecl += c.buttonTextTransform ? '    text-transform: ' + c.buttonTextTransform + ';\n' : '';
        btnDecl += c.buttonPadding ? '    padding: ' + c.buttonPadding + ';\n' : '';
        if (btnDecl) css += '.ms-adv-cubby-grid cubby-facility::part(card-button) {\n' + btnDecl + '}\n';

        // Promo / alert badge
        var promoDecl = '';
        promoDecl += c.promoBgColor ? '    background-color: ' + c.promoBgColor + ';\n' : '';
        promoDecl += c.promoTextColor ? '    color: ' + c.promoTextColor + ';\n' : '';
        promoDecl += c.promoBorder ? '    border: ' + c.promoBorder + ';\n' : '';
        promoDecl += c.promoBorderRadius ? '    border-radius: ' + c.promoBorderRadius + ';\n' : '';
        promoDecl += c.promoFontSize ? '    font-size: ' + c.promoFontSize + ';\n' : '';
        promoDecl += c.promoFontWeight ? '    font-weight: ' + c.promoFontWeight + ';\n' : '';
        if (promoDecl) css += '.ms-adv-cubby-grid cubby-facility::part(card-alert) {\n' + promoDecl + '}\n';

        // Tabs bar
        var tabsDecl = '';
        tabsDecl += c.tabBgColor ? '    background-color: ' + c.tabBgColor + ';\n' : '';
        if (tabsDecl) css += '.ms-adv-cubby-grid cubby-facility::part(tabs) {\n' + tabsDecl + '}\n';

        // Individual tabs
        var tabDecl = '';
        tabDecl += c.tabFontSize ? '    font-size: ' + c.tabFontSize + ';\n' : '';
        tabDecl += c.tabTextTransform ? '    text-transform: ' + c.tabTextTransform + ';\n' : '';
        if (tabDecl) css += '.ms-adv-cubby-grid cubby-facility::part(tab) {\n' + tabDecl + '}\n';

        // Active tab
        var activeTabDecl = '';
        activeTabDecl += c.tabActiveBg ? '    background-color: ' + c.tabActiveBg + ';\n' : '';
        activeTabDecl += c.tabActiveColor ? '    color: ' + c.tabActiveColor + ';\n' : '';
        if (activeTabDecl) {
            css += '.ms-adv-cubby-grid cubby-facility::part(tab active-tab) {\n' + activeTabDecl + '}\n';
        }

        return css;
    }

    // ── Deep shadow-DOM query ──────────────────────────────────────────
    // querySelectorAll does NOT cross shadow-root boundaries. Cubby may
    // render each card inside a nested custom element with its own shadow
    // root, so we recursively walk every open shadow root we can reach.
    function deepQueryAll(root, selector) {
        var results = [];
        function walk(node) {
            if (!node || !node.querySelectorAll) return;
            var matches = node.querySelectorAll(selector);
            for (var i = 0; i < matches.length; i++) results.push(matches[i]);
            var all = node.querySelectorAll('*');
            for (var j = 0; j < all.length; j++) {
                if (all[j].shadowRoot) walk(all[j].shadowRoot);
            }
        }
        walk(root);
        return results;
    }

    // ── Inject a single callout pill before each card's promo badges ────
    // Walks cubby-facility's full shadow-DOM tree (including nested shadow
    // roots) to prepend a styled <span> pill before the first
    // [part="card-alert"] in each card's alert container.
    function injectCalloutPills(container, config) {
        var calloutVal = (config.showSpecialCallout !== undefined && config.showSpecialCallout !== null) ? config.showSpecialCallout : false;
        var showCallout = calloutVal === true || calloutVal === 'true' || calloutVal === 'yes';
        if (!showCallout) return;

        var calloutText = config.specialCalloutText || 'SPECIAL';
        var calloutBg = config.specialCalloutBg || 'var(--cubby-primary-color, #007bff)';
        var calloutColor = config.specialCalloutColor || '#ffffff';
        var calloutRadius = config.specialCalloutRadius || '50px';
        var calloutFontSize = config.specialCalloutFontSize || '10px';
        var calloutPadding = config.specialCalloutPadding || '4px 10px';
        var calloutBorder = config.specialCalloutBorder || 'none';

        var cubbyEl = container.querySelector('cubby-facility');
        if (!cubbyEl) return;

        var pillStyle = [
            'display: inline-block',
            'background-color: ' + calloutBg,
            'color: ' + calloutColor,
            'font-size: ' + calloutFontSize,
            'font-weight: 700',
            'letter-spacing: 1px',
            'text-transform: uppercase',
            'padding: ' + calloutPadding,
            'border-radius: ' + calloutRadius,
            'border: ' + calloutBorder,
            'margin-right: 8px',
            'vertical-align: middle',
            'line-height: 1'
        ].join('; ');

        function tryInject() {
            var alerts = deepQueryAll(cubbyEl, '[part~="card-alert"]');
            if (!alerts.length) return false;

            var processedParents = [];
            for (var i = 0; i < alerts.length; i++) {
                var parent = alerts[i].parentElement;
                if (!parent || processedParents.indexOf(parent) !== -1) continue;
                processedParents.push(parent);

                if (parent.querySelector('.ms-callout-pill')) continue;

                var pill = document.createElement('span');
                pill.className = 'ms-callout-pill';
                pill.textContent = calloutText;
                pill.style.cssText = pillStyle;
                parent.insertBefore(pill, parent.firstChild);
            }

            return processedParents.length > 0;
        }

        // Poll every 500ms for up to ~10 seconds (Cubby renders async; nested
        // card shadow roots may attach in a second phase after API data resolves).
        var attempts = 0;
        var maxAttempts = 20;
        var hasInjectedOnce = false;
        var observers = [];
        var debouncePending = false;

        function disconnectAll() {
            for (var k = 0; k < observers.length; k++) observers[k].disconnect();
            observers.length = 0;
        }

        // Coalesce mutation bursts so we don't run a deep traversal per micro-mutation.
        function scheduleCheck() {
            if (debouncePending) return;
            debouncePending = true;
            setTimeout(function () {
                debouncePending = false;
                if (tryInject()) hasInjectedOnce = true;
                attachToNewShadowRoots(cubbyEl);
            }, 50);
        }

        function attachObservers(rootNode) {
            if (!rootNode) return;
            var obs = new MutationObserver(scheduleCheck);
            obs.observe(rootNode, { childList: true, subtree: true });
            observers.push(obs);
        }

        // Walk the full tree (light DOM + every reachable open shadow root) and
        // attach a MutationObserver to each shadow root we haven't seen yet.
        // The __msObserved flag prevents duplicate observers on the same root.
        function attachToNewShadowRoots(node) {
            if (!node) return;
            function collect(n) {
                if (!n) return;
                if (n.shadowRoot && !n.shadowRoot.__msObserved) {
                    n.shadowRoot.__msObserved = true;
                    attachObservers(n.shadowRoot);
                }
                if (n.shadowRoot) {
                    var inner = n.shadowRoot.querySelectorAll('*');
                    for (var i = 0; i < inner.length; i++) collect(inner[i]);
                }
                if (n.children) {
                    for (var j = 0; j < n.children.length; j++) collect(n.children[j]);
                }
            }
            collect(node);
        }

        function poll() {
            attempts++;
            if (tryInject()) hasInjectedOnce = true;
            attachToNewShadowRoots(cubbyEl);
            // Once we've injected at least once, stop polling. Observers remain
            // attached so tab switches / re-renders re-pill any new cards
            // (parent.querySelector('.ms-callout-pill') guards prevent dupes).
            if (hasInjectedOnce) return;
            if (attempts < maxAttempts) {
                setTimeout(poll, 500);
            } else {
                disconnectAll();
                console.warn('[ms-adv-cubby-grid] Could not inject callout pills.',
                    'Has shadowRoot:', !!cubbyEl.shadowRoot,
                    'Nested elements with shadowRoot:', deepQueryAll(cubbyEl, '*').filter(function (n) { return n.shadowRoot; }).length,
                    'Found [part~="card-alert"]:', deepQueryAll(cubbyEl, '[part~="card-alert"]').length);
            }
        }

        // Try immediately (covers the rare case where Cubby is already rendered),
        // attach observers to every current shadow root, then poll for late content.
        if (tryInject()) hasInjectedOnce = true;
        attachToNewShadowRoots(cubbyEl);
        if (!hasInjectedOnce) setTimeout(poll, 500);
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

        // ── Facility slug ──────────────────────────────────────────────────
        // Source priority:
        //   1. config.facilitySlug (content panel) — use directly for preview/testing.
        //   2. Collection API lookup — query collection by URL slug, read M.component.
        //      This is the same pattern used by adv-button, adv-carousel, etc.

        var cfgSlug = (config.facilitySlug || '').trim();
        // Strip unresolved Duda handlebars
        if (cfgSlug.indexOf('{{') === 0 && cfgSlug.indexOf('}}') === cfgSlug.length - 2) cfgSlug = '';

        var collectionName = (config.collectionName || '').trim();
        var facilitySlug = cfgSlug;

        // If no manual slug, look up M.component from the collection via URL slug
        if (!facilitySlug && collectionName) {
            try {
                var collectionAPI = await dmAPI.loadCollectionsAPI();
                var allItems = [];
                var pageNumber = 0;
                var hasMore = true;

                while (hasMore) {
                    var results = await collectionAPI
                        .data(collectionName)
                        .pageSize(100)
                        .pageNumber(pageNumber)
                        .get();

                    if (results && results.values && results.values.length > 0) {
                        allItems = allItems.concat(results.values);
                        hasMore = results.values.length === 100;
                        pageNumber++;
                    } else {
                        hasMore = false;
                    }
                }

                // Match current page URL slug against M.slug in collection
                var pathSegments = window.location.pathname.toLowerCase()
                    .replace(/^\/|\/$/g, '').split('/').filter(function (s) { return s.length > 0; });
                var urlSlug = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';

                if (urlSlug) {
                    for (var i = 0; i < allItems.length; i++) {
                        var itemSlug = (allItems[i].data['M.slug'] || '').trim().toLowerCase();
                        if (itemSlug && itemSlug === urlSlug) {
                            facilitySlug = (allItems[i].data['M.component'] || '').trim();
                            break;
                        }
                    }
                }
            } catch (err) {
                console.warn('[ms-adv-cubby-grid] Collection lookup error:', err);
            }
        }
        var layout = (config.layout || 'list').trim();

        // Add scoping class
        container.classList.add('ms-adv-cubby-grid');

        // ── Inject Cubby dynamic CSS ───────────────────────────────────────
        var cubbyStyleId = 'ms-css-adv-cubby-grid-dynamic';
        var existingStyle = document.getElementById(cubbyStyleId);
        if (existingStyle) existingStyle.remove();

        var dynamicCSS = buildCubbyCSS(config);
        if (dynamicCSS) {
            var dynStyle = document.createElement('style');
            dynStyle.id = cubbyStyleId;
            dynStyle.textContent = dynamicCSS;
            (document.body || document.head).appendChild(dynStyle);
        }

        // ── Render into #ms-widget-root (keeps Duda's widget handle intact) ─
        // Replace container.innerHTML only if #ms-widget-root is not found.
        var renderTarget = container.querySelector('#ms-widget-root') || container;

        if (!facilitySlug) {
            renderTarget.innerHTML = '<div class="ms-cubby-placeholder">Tech.Storage — Adv Cubby Unit Grid<br>Set the <strong>Collection Name</strong> (for dynamic pages) or <strong>Facility Slug</strong> (for preview) in the widget panel.</div>';
            return;
        }

        renderTarget.innerHTML = '<cubby-facility facility="' + facilitySlug + '" layout="' + layout + '"></cubby-facility>';

        // ── Inject single callout pill before each card's promo badges ────
        injectCalloutPills(renderTarget, config);

        // ── Invalid slug detection ─────────────────────────────────────────
        // Cubby renders nothing (0 height) when a slug is not found.
        // After 6 s (generous for API latency), check height and show an error.
        var cubbyEl = renderTarget.querySelector('cubby-facility');
        if (cubbyEl) {
            setTimeout(function () {
                if (cubbyEl.isConnected && cubbyEl.offsetHeight < 50) {
                    renderTarget.innerHTML = '<div class="ms-cubby-error">⚠️ Facility not found — invalid slug: <strong>' + facilitySlug + '</strong></div>';
                }
            }, 6000);
        }
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init };

})();
