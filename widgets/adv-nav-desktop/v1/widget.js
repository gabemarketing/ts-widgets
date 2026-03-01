window.dmAPI.runOnReady('msNavDesktop', function () {

    var BASE = 'https://widgets.marketing.storage';
    var WIDGET_ID = 'adv-nav-desktop';
    var FALLBACK_PATH = '/widgets/' + WIDGET_ID + '/v1/widget.js';

    function loadScript(src, callback) {
        if (document.querySelector('script[data-ms-src="' + src + '"]')) {
            callback();
            return;
        }
        var s = document.createElement('script');
        s.setAttribute('data-ms-src', src);
        s.src = src;
        s.onload = callback;
        s.onerror = function () { };
        document.head.appendChild(s);
    }

    function tryInit() {
        if (window.MSWidgets && window.MSWidgets[WIDGET_ID]) {
            window.MSWidgets[WIDGET_ID].init(element, { dudaData: data });
        } else {
            setTimeout(function () {
                if (window.MSWidgets && window.MSWidgets[WIDGET_ID]) {
                    window.MSWidgets[WIDGET_ID].init(element, { dudaData: data });
                }
            }, 300);
        }
    }

    function loadWidget(widgetPath) {
        loadScript(BASE + widgetPath + '?t=' + Date.now(), function () {
            tryInit();
        });
    }

    loadScript(BASE + '/_shared/license-check.js', function () {
        if (!window.MSLicenseCheck) {
            element.innerHTML = '<div style="padding:12px;color:#888;font-size:13px;">License module unavailable.</div>';
            return;
        }
        window.MSLicenseCheck(WIDGET_ID).then(function (result) {
            if (!result || !result.ok) {
                element.innerHTML = '<div style="padding:12px;color:#888;font-size:13px;">Inactive license</div>';
                return;
            }
            loadWidget(result.widgetUrl || FALLBACK_PATH);
        }).catch(function () {
            loadWidget(FALLBACK_PATH);
        });
    });

});
