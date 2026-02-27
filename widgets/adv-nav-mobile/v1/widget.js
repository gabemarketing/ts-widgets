(function () {

    const WIDGET_ID = "adv-nav-mobile";

    const WIDGET_CSS = `
.ms-nav-mobile {
  width: 100%;
  font-family: inherit;
}
.ms-nav-mobile .nav-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 50px;
}
.ms-nav-mobile .nav-loading {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  opacity: 1;
  transition: opacity 0.3s ease;
}
.ms-nav-mobile .nav-item {
  display: flex !important;
  flex-direction: column;
  border-bottom: 1px solid var(--nav-border-color, #e5e5e5);
  opacity: 1;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
.ms-nav-mobile .nav-item.level-1 .nav-item-content {
  padding-left: 32px;
}
.ms-nav-mobile .nav-item.level-2 .nav-item-content {
  padding-left: 48px;
  border-top: 1px solid var(--nav-border-color, #e5e5e5);
}
.ms-nav-mobile .nav-item.level-3 .nav-item-content {
  padding-left: 64px;
  border-top: 1px solid var(--nav-border-color, #e5e5e5);
}
.ms-nav-mobile .nav-item.collection-item {
  background: var(--dropdown-bg-color, #f9f9f9);
}
.ms-nav-mobile .nav-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--nav-text-spacing, 16px);
  gap: 12px;
  position: relative;
  transition: background-color 0.2s ease;
}
.ms-nav-mobile a.nav-link {
  flex: 1;
  color: var(--nav-text-color, #333333) !important;
  text-decoration: none !important;
  font-size: var(--nav-font-size, 16px) !important;
  font-weight: var(--nav-font-weight, 400) !important;
  line-height: 1.5;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.ms-nav-mobile a.nav-link.nav-folder {
  color: var(--nav-text-color, #666666) !important;
}
.ms-nav-mobile a.nav-link.current-page {
  color: var(--nav-text-selected-color, #333333) !important;
  font-weight: var(--nav-current-font-weight, 600) !important;
}
.ms-nav-mobile a.nav-link.current-page-parent {
  color: var(--nav-text-selected-color, #333333) !important;
  font-weight: var(--nav-current-font-weight, 600) !important;
}
.ms-nav-mobile .nav-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--nav-text-color, #666666);
  transition: all 0.3s ease;
  border-radius: 4px;
  padding: 4px;
}
.ms-nav-mobile .nav-toggle:hover {
  background-color: var(--nav-bg-hover-color, #e5e5e5);
  color: var(--nav-text-hover-color, #333333);
}
.ms-nav-mobile .nav-toggle svg {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}
.ms-nav-mobile .nav-item.open > .nav-item-content .nav-toggle svg {
  transform: rotate(180deg);
}
.ms-nav-mobile .nav-item.open > .nav-submenu {
  max-height: 2000px !important;
  opacity: 1 !important;
  overflow: visible !important;
}
.ms-nav-mobile .nav-submenu {
  display: flex !important;
  flex-direction: column;
  max-height: 0 !important;
  overflow: hidden !important;
  opacity: 0 !important;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.ms-nav-mobile .nav-submenu .nav-item {
  border-bottom: 1px solid var(--nav-border-color, #eeeeee);
}
.ms-nav-mobile .nav-submenu .nav-item:last-child {
  border-bottom: none;
}
.ms-nav-mobile .nav-item.level-0 > .nav-submenu {
  background-color: var(--dropdown-bg-color, #f9f9f9);
}
.ms-nav-mobile .nav-item.level-1 > .nav-submenu {
  background-color: var(--dropdown-bg-color, #f3f3f3);
}
.ms-nav-mobile .nav-item.level-2 > .nav-submenu {
  background-color: var(--dropdown-bg-color, #eeeeee);
}
@media (max-width: 767px) {
  .ms-nav-mobile a.nav-link {
    font-size: var(--nav-font-size, 15px) !important;
  }
  .ms-nav-mobile .nav-item-content {
    padding: 14px;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .ms-nav-mobile a.nav-link {
    font-size: var(--nav-font-size, 15px) !important;
  }
}
`;

    function injectCSS() {
        if (document.getElementById("ms-css-" + WIDGET_ID)) return;
        var style = document.createElement("style");
        style.id = "ms-css-" + WIDGET_ID;
        style.textContent = WIDGET_CSS;
        (document.body || document.head).appendChild(style);
    }

    function setCSSVariables(navContainer, config) {
        var map = {
            '--nav-text-color': config['navTextColor'] || '',
            '--nav-text-hover-color': config['navTextHoverColor'] || '',
            '--nav-text-selected-color': config['navTextSelectedColor'] || '',
            '--nav-bg-hover-color': config['navBgHoverColor'] || '',
            '--nav-bg-selected-color': config['navBgSelectedColor'] || '',
            '--nav-font-size': config['navFontSize'] ? config['navFontSize'] + 'px' : '',
            '--nav-font-weight': config['navFontWeight'] || '',
            '--nav-current-font-weight': config['navCurrentFontWeight'] || '',
            '--nav-text-spacing': config['textSpacing'] ? config['textSpacing'] + 'px' : '',
            '--nav-border-color': config['navBorderColor'] || '',
            '--dropdown-bg-color': config['dropdownBgColor'] || '',
        };
        Object.keys(map).forEach(function (k) {
            if (map[k]) navContainer.style.setProperty(k, map[k]);
        });
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

        container.innerHTML = `
<div class="dynamic-nav-widget ms-nav-mobile">
  <nav class="nav-container" role="navigation">
    <div class="nav-loading">Loading navigation...</div>
  </nav>
</div>`;

        const navContainer = container.querySelector('.nav-container');
        const loadingEl = container.querySelector('.nav-loading');

        setCSSVariables(navContainer, data.config);

        const collectionName = data.config['collectionName'] || '';
        const selectedPageLink = data.config['selectedPage'];
        const facilityUrlPrefix = data.config['facilityUrlPrefix'] || 'storage-units';
        const stateUrlPrepend = data.config['stateUrlPrepend'] || '';
        const cityUrlPrepend = data.config['cityUrlPrepend'] || '';

        // ── Helpers ───────────────────────────────────────────────────────

        function extractUrlFromLinkData(linkData) {
            if (!linkData) return '';
            if (typeof linkData === 'string') return linkData;
            if (typeof linkData === 'object') return linkData.url || linkData.href || linkData.link || '';
            return '';
        }

        const selectedPageUrl = extractUrlFromLinkData(selectedPageLink);
        const currentPageUrl = window.location.pathname;

        function normalizeUrl(url) {
            if (!url) return '';
            let n = url.toString()
                .toLowerCase()
                .replace(/^https?:\/\/[^/]+/, '')
                .replace(/[?#].*$/, '')
                .replace(/\/$/, '');
            if (!n.startsWith('/')) n = '/' + n;
            return n;
        }

        function sanitizeUrlSegment(str) {
            if (!str) return '';
            return str.toLowerCase()
                .replace(/&/g, '-and-')
                .replace(/\./g, '-')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        function getPageName(linkElement) {
            const methods = [
                () => linkElement.getAttribute('data-page-name'),
                () => linkElement.getAttribute('title'),
                () => linkElement.getAttribute('aria-label'),
                () => {
                    const s = linkElement.querySelector('span:not(.icon):not(.arrow):not(.dropdown-arrow)');
                    return s ? s.textContent.trim() : null;
                },
                () => {
                    let text = linkElement.textContent.trim();
                    linkElement.querySelectorAll('.icon,.arrow,.dropdown-arrow,svg').forEach(icon => {
                        if (icon.textContent) text = text.replace(icon.textContent, '').trim();
                    });
                    return text;
                }
            ];
            for (const m of methods) {
                const n = m();
                if (n && n.length > 0) return n;
            }
            return 'Untitled';
        }

        function getPageUrl(linkElement) {
            return linkElement.getAttribute('href') ||
                linkElement.getAttribute('data-page-id') ||
                linkElement.getAttribute('data-href') || '#';
        }

        function parsePageItem(item) {
            const pageData = { name: '', url: '', isFolder: false, children: [] };
            const directLink = item.querySelector(':scope > a, :scope > .nav-link, :scope > a.nav-link');
            const hasSubMenu = item.querySelector(':scope > ul, :scope > ol, :scope > .submenu, :scope > .dropdown, :scope > .sub-menu');
            const isNavFolder = item.classList.contains('nav-folder') ||
                item.classList.contains('navigation-folder') ||
                item.classList.contains('menu-folder') ||
                item.classList.contains('folder') ||
                item.hasAttribute('data-folder') ||
                hasSubMenu;

            if (directLink) {
                pageData.name = getPageName(directLink);
                pageData.url = getPageUrl(directLink);
            }
            if (isNavFolder || hasSubMenu) pageData.isFolder = true;

            if (!pageData.name) {
                const fallback = item.querySelector(':scope > span:not(.icon):not(.arrow), :scope > .folder-name, :scope > .nav-folder-name');
                if (fallback) {
                    pageData.name = fallback.textContent.trim();
                    pageData.isFolder = true;
                    if (!pageData.url) pageData.url = '#';
                }
            }
            if (!pageData.name) return null;

            if (hasSubMenu) {
                hasSubMenu.querySelectorAll(':scope > li').forEach(child => {
                    const childData = parsePageItem(child);
                    if (childData) pageData.children.push(childData);
                });
            }
            return pageData;
        }

        function parseNavigationStructure(navElement) {
            const selectors = [':scope > ul > li', ':scope > ol > li', ':scope > div > ul > li', ':scope > div > ol > li', ':scope > li'];
            let items = [];
            for (const s of selectors) {
                try {
                    items = navElement.querySelectorAll(s);
                    if (items.length > 0) break;
                } catch (e) { continue; }
            }
            const pages = [];
            items.forEach(item => {
                const d = parsePageItem(item);
                if (d) pages.push(d);
            });
            return pages;
        }

        function getSitePages() {
            const headerSelectors = [
                'header nav', '.header nav', '[data-aid="HEADER_NAV"]', '.site-navigation',
                '.main-navigation', '.navigation', '.navbar', 'nav[role="navigation"]',
                '.nav-container:not(.dynamic-nav-widget .nav-container)',
                '[class*="navigation"]', '[id*="nav"]'
            ];
            for (const selector of headerSelectors) {
                try {
                    const navElements = document.querySelectorAll(selector);
                    for (const nav of navElements) {
                        if (nav.closest('.dynamic-nav-widget')) continue;
                        if (nav.querySelector('a[href], [data-page-id]')) {
                            return parseNavigationStructure(nav);
                        }
                    }
                } catch (e) { continue; }
            }
            return [];
        }

        function closeAllChildDropdowns(parentElement) {
            parentElement.querySelectorAll('.nav-item.open').forEach(item => item.classList.remove('open'));
        }

        function createNavItem(page, level = 0, isCollectionItem = false) {
            const item = document.createElement('div');
            item.className = `nav-item level-${level}`;
            if (isCollectionItem) item.classList.add('collection-item');
            if (page.children && page.children.length > 0) item.classList.add('has-children');

            const link = document.createElement('a');
            link.href = page.url || '#';
            link.className = 'nav-link';
            link.textContent = page.name || 'Untitled';
            link.setAttribute('data-page-url', page.url);

            if (page.isFolder && (!page.url || page.url === '#')) {
                link.classList.add('nav-folder');
                link.addEventListener('click', e => e.preventDefault());
            }

            const itemContent = document.createElement('div');
            itemContent.className = 'nav-item-content';
            itemContent.appendChild(link);

            if (page.children && page.children.length > 0) {
                const toggle = document.createElement('button');
                toggle.className = 'nav-toggle';
                toggle.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
                toggle.setAttribute('aria-label', 'Toggle submenu');
                itemContent.appendChild(toggle);

                const submenu = document.createElement('div');
                submenu.className = 'nav-submenu';
                page.children.forEach(child => submenu.appendChild(createNavItem(child, level + 1, isCollectionItem)));

                item.appendChild(itemContent);
                item.appendChild(submenu);

                toggle.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const wasOpen = item.classList.contains('open');
                    const parent = item.parentElement;
                    if (parent) {
                        parent.querySelectorAll(':scope > .nav-item.open').forEach(sib => {
                            if (sib !== item) { sib.classList.remove('open'); closeAllChildDropdowns(sib); }
                        });
                    }
                    if (wasOpen) { item.classList.remove('open'); closeAllChildDropdowns(item); }
                    else { item.classList.add('open'); }
                });
            } else {
                item.appendChild(itemContent);
            }
            return item;
        }

        function markParentItemsAsActive(activeLink) {
            let currentSubmenu = activeLink.closest('.nav-submenu');
            while (currentSubmenu) {
                const parentNavItem = currentSubmenu.parentElement;
                if (parentNavItem && parentNavItem.classList.contains('nav-item')) {
                    const parentLink = parentNavItem.querySelector(':scope > .nav-item-content > .nav-link');
                    const isTopLevel = !parentNavItem.closest('.nav-submenu');
                    if (!isTopLevel && parentLink) parentLink.classList.add('current-page-parent');
                }
                currentSubmenu = parentNavItem?.closest('.nav-submenu');
            }
        }

        function detectAndMarkCurrentPage() {
            const normalizedCurrentUrl = normalizeUrl(currentPageUrl);
            const homeUrls = ['', '/', '/home', '/index', '/index.html', '/main', '/homepage', '/default'];
            const isHomePage = homeUrls.includes(normalizedCurrentUrl);

            navContainer.querySelectorAll('.nav-link').forEach(link => {
                const normalizedLinkUrl = normalizeUrl(link.getAttribute('data-page-url'));
                const isMatch = isHomePage
                    ? homeUrls.includes(normalizedLinkUrl)
                    : normalizedLinkUrl === normalizedCurrentUrl;

                if (isMatch) {
                    link.classList.add('current-page');
                    markParentItemsAsActive(link);
                }
            });
        }

        async function fetchAllCollectionItems(collectionAPI, name) {
            const all = [];
            let page = 0;
            const size = 100;
            let hasMore = true;
            while (hasMore) {
                try {
                    const res = await collectionAPI.data(name).pageSize(size).pageNumber(page).get();
                    if (res && res.values && res.values.length > 0) {
                        all.push(...res.values);
                        hasMore = res.values.length === size;
                        page++;
                    } else {
                        hasMore = false;
                    }
                } catch (err) {
                    console.error('Collection page error:', err);
                    hasMore = false;
                }
            }
            return all;
        }

        function buildCollectionHierarchy(collectionData) {
            const stateMap = new Map();
            const cityMap = new Map();
            const facilityList = [];

            collectionData.forEach(item => {
                const facName = item.data['M.fac-name'];
                const state = item.data['M.state'];
                const city = item.data['M.city'];
                const stateLink = item.data['M.state-link'];
                const cityLink = item.data['M.city-link'];
                const pageItemUrl = item.data['page_item_url'] || item.page_item_url;

                if (!facName) return;

                const facilityUrl = pageItemUrl ? `/${facilityUrlPrefix}/${pageItemUrl}` : '#';
                const facilityItem = { name: facName, url: facilityUrl, isFolder: false, children: [] };

                if (facName && !city && !state) {
                    facilityList.push(facilityItem);
                } else if (facName && city && !state) {
                    if (!cityMap.has(city)) {
                        const clickable = cityLink && cityLink.toLowerCase() === 'yes';
                        const citySan = sanitizeUrlSegment(city);
                        const cityUrl = clickable ? (cityUrlPrepend ? `/${cityUrlPrepend}/${citySan}` : `/${citySan}`) : '#';
                        cityMap.set(city, { name: city, url: cityUrl, isFolder: !clickable, children: [] });
                    }
                    cityMap.get(city).children.push(facilityItem);
                } else if (facName && city && state) {
                    if (!stateMap.has(state)) {
                        const clickable = stateLink && stateLink.toLowerCase() === 'yes';
                        const stateSan = sanitizeUrlSegment(state);
                        const stateUrl = clickable ? (stateUrlPrepend ? `/${stateUrlPrepend}/${stateSan}` : `/${stateSan}`) : '#';
                        stateMap.set(state, { name: state, url: stateUrl, isFolder: !clickable, children: [] });
                    }
                    const stateObj = stateMap.get(state);
                    let cityObj = stateObj.children.find(c => c.name === city);
                    if (!cityObj) {
                        const clickable = cityLink && cityLink.toLowerCase() === 'yes';
                        const stateSan = sanitizeUrlSegment(state);
                        const citySan = sanitizeUrlSegment(city);
                        let cityUrl = '#';
                        if (clickable) {
                            cityUrl = cityUrlPrepend ? `/${cityUrlPrepend}/${stateSan}/${citySan}` :
                                stateUrlPrepend ? `/${stateUrlPrepend}/${stateSan}/${citySan}` :
                                    `/${stateSan}/${citySan}`;
                        }
                        cityObj = { name: city, url: cityUrl, isFolder: !clickable, children: [] };
                        stateObj.children.push(cityObj);
                    }
                    cityObj.children.push(facilityItem);
                }
            });

            return [...facilityList, ...Array.from(cityMap.values()), ...Array.from(stateMap.values())];
        }

        function addCollectionSubNavToPage(pages, targetPageUrl, collectionHierarchy) {
            const normalizedTarget = normalizeUrl(targetPageUrl);
            function findAndReplace(list) {
                for (let i = 0; i < list.length; i++) {
                    if (normalizeUrl(list[i].url) === normalizedTarget) {
                        list[i].children = collectionHierarchy;
                        return true;
                    }
                    if (list[i].children && list[i].children.length > 0) {
                        if (findAndReplace(list[i].children)) return true;
                    }
                }
                return false;
            }
            return findAndReplace(pages);
        }

        // ── Build navigation ──────────────────────────────────────────────

        async function buildNavigation() {
            try {
                loadingEl.style.display = 'block';

                let pages = getSitePages();

                if (pages && pages.length > 0) {
                    if (collectionName && selectedPageUrl) {
                        try {
                            loadingEl.textContent = 'Loading locations...';
                            const collectionAPI = await window.dmAPI.loadCollectionsAPI();
                            const allItems = await fetchAllCollectionItems(collectionAPI, collectionName);
                            if (allItems.length > 0) {
                                const hierarchy = buildCollectionHierarchy(allItems);
                                addCollectionSubNavToPage(pages, selectedPageUrl, hierarchy);
                            }
                        } catch (err) {
                            console.error('Collection error:', err);
                        }
                    }

                    navContainer.innerHTML = '';
                    pages.forEach(page => navContainer.appendChild(createNavItem(page, 0, false)));
                    detectAndMarkCurrentPage();
                } else {
                    loadingEl.innerHTML = `
                        <div style="padding:16px;text-align:center;">
                            <p style="color:#666;margin-bottom:8px;">No pages detected.</p>
                            <p style="font-size:13px;color:#999;">This widget will display your site navigation when published.</p>
                        </div>`;
                }
            } catch (err) {
                console.error('Navigation build error:', err);
                loadingEl.innerHTML = `
                    <div style="padding:16px;">
                        <p style="color:#d32f2f;margin-bottom:8px;font-weight:600;">Error loading navigation</p>
                        <p style="font-size:13px;color:#666;">${err.message}</p>
                    </div>`;
            }
        }

        buildNavigation();
    }

    function clean(container) {
        if (container) container.innerHTML = '';
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init: init, clean: clean };

})();
