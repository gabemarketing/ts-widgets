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

        // Special callout ::before pill (e.g. "SPECIAL" label before promo text)
        // Duda Toggle returns true/false; also handle 'yes'/'no' strings
        var calloutVal = (c.showSpecialCallout !== undefined && c.showSpecialCallout !== null) ? c.showSpecialCallout : false;
        var showCallout = calloutVal === true || calloutVal === 'true' || calloutVal === 'yes';
        if (showCallout) {
            var calloutText = c.specialCalloutText || 'SPECIAL';
            var calloutBg = c.specialCalloutBg || 'var(--cubby-primary-color, #007bff)';
            var calloutColor = c.specialCalloutColor || '#ffffff';
            var calloutRadius = c.specialCalloutRadius || '50px';
            css += [
                '.ms-adv-cubby-grid cubby-facility::part(card-alert)::before {',
                "    content: '" + calloutText + "';",
                '    display: inline-block;',
                '    background-color: ' + calloutBg + ';',
                '    color: ' + calloutColor + ';',
                '    font-size: 10px;',
                '    font-weight: 700;',
                '    letter-spacing: 1px;',
                '    text-transform: uppercase;',
                '    padding: 4px 10px;',
                '    border-radius: ' + calloutRadius + ';',
                '    margin-right: 8px;',
                '    vertical-align: middle;',
                '}',
                ''
            ].join('\n');
        }

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
        // Duda does NOT resolve {{...}} collection variables in custom widget
        // content panel fields OR HTML tab attributes. Instead we parse the slug
        // from the URL path — on a live dynamic Duda page the URL ends with the
        // collection item slug (e.g. .../maine/parsonfield/all-purpose-kezar-falls).
        // In the Duda builder the URL ends with ~page-item~ which we reject, so
        // it falls back to config.facilitySlug for builder preview.
        //
        // Priority:
        //   1. URL last path segment (live dynamic page — most reliable)
        //   2. config.facilitySlug content panel field (builder preview / static pages)
        function getUrlSlug() {
            var segments = window.location.pathname.split('/').filter(Boolean);
            var last = segments[segments.length - 1] || '';
            // Accept only valid slugs: lowercase letters, digits, hyphens
            return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(last) ? last : '';
        }

        var urlSlug = getUrlSlug();
        var cfgSlug = (config.facilitySlug || '').trim();
        var isCfgUnresolved = cfgSlug.startsWith('{{') && cfgSlug.endsWith('}}');

        var facilitySlug = urlSlug || (!isCfgUnresolved && cfgSlug) || '';
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
            renderTarget.innerHTML = '<div class="ms-cubby-placeholder">Tech.Storage — Adv Cubby Unit Grid<br>Set the <strong>Facility Slug</strong> in the widget panel to preview, or publish to a dynamic page to load automatically.</div>';
            return;
        }

        renderTarget.innerHTML = '<cubby-facility facility="' + facilitySlug + '" layout="' + layout + '"></cubby-facility>';

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
