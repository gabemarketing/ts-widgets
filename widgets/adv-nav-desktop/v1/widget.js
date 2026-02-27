(function () {

    const WIDGET_ID = "adv-nav-desktop";

    const WIDGET_CSS = `
.ms-nav-desktop {
  width: 100%;
  font-family: inherit;
}
.ms-nav-desktop .nav-container {
  position: relative;
  z-index: 1000;
}
.ms-nav-desktop .nav-main-list {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: var(--nav-justify, var(--nav-alignment, flex-start));
  background: transparent;
  width: 100%;
}
.ms-nav-desktop .nav-main-list.spread-items .nav-item {
  flex: 1;
}
.ms-nav-desktop .nav-main-list.spread-items .nav-item .nav-link {
  text-align: center;
  justify-content: center;
}
.ms-nav-desktop .nav-item {
  position: relative;
}
.ms-nav-desktop .nav-item.nav-main-item {
  margin-left: var(--nav-item-margin, 0px);
  margin-right: var(--nav-item-margin, 0px);
}
.ms-nav-desktop .nav-item .nav-link {
  padding-left: var(--nav-item-padding, 16px);
  padding-right: var(--nav-item-padding, 16px);
}
.ms-nav-desktop .nav-link {
  display: flex !important;
  align-items: center;
  padding-top: var(--nav-text-spacing, 12px);
  padding-bottom: var(--nav-text-spacing, 12px);
  color: var(--nav-text-color, #000000);
  text-decoration: none !important;
  font-size: var(--nav-font-size, 14px);
  font-weight: var(--nav-font-weight, 500);
  transition: all 0.3s ease;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
}
.ms-nav-desktop .nav-link:hover {
  color: var(--nav-text-hover-color, #000000);
  background-color: var(--nav-bg-hover-color, transparent);
}
.ms-nav-desktop .nav-link.current-page {
  color: var(--nav-text-selected-color, #000000);
  background-color: var(--nav-bg-selected-color, transparent);
  font-weight: var(--nav-current-font-weight, 600);
}
.ms-nav-desktop .nav-link.current-page-parent {
  color: var(--nav-text-selected-color, #000000);
  background-color: var(--nav-bg-selected-color, transparent);
  font-weight: var(--nav-current-font-weight, 600);
}
.ms-nav-desktop .nav-main-item > .nav-link {
  border: var(--border-width, 0px) solid transparent !important;
  border-radius: var(--border-radius, 0px) !important;
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.2s ease !important;
  box-sizing: border-box !important;
}
.ms-nav-desktop .nav-main-item > .nav-link:hover {
  border-color: var(--border-color-active, #000000) !important;
}
.ms-nav-desktop .nav-main-item > .nav-link.current-page {
  border-color: var(--border-color-active, #000000) !important;
}
.ms-nav-desktop .nav-main-item > .nav-link.current-page-parent {
  border-color: var(--border-color-active, #000000) !important;
}
.ms-nav-desktop .dropdown-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  width: 10px;
  height: 10px;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}
.ms-nav-desktop .dropdown-arrow svg {
  width: 100%;
  height: 100%;
  transition: transform 0.25s ease;
}
.ms-nav-desktop .nav-main-item > .nav-link .dropdown-arrow svg {
  transform: rotate(0deg);
}
.ms-nav-desktop .nav-main-item:hover > .nav-link .dropdown-arrow svg {
  transform: rotate(180deg);
}
.ms-nav-desktop .nav-main-item.dropdown-open > .nav-link .dropdown-arrow svg {
  transform: rotate(180deg);
}
.ms-nav-desktop .nav-dropdown .dropdown-arrow svg {
  transform: rotate(-90deg);
}
.ms-nav-desktop .nav-dropdown .has-dropdown:hover > .nav-link .dropdown-arrow svg {
  transform: rotate(90deg);
}
.ms-nav-desktop .nav-dropdown .has-dropdown.dropdown-open > .nav-link .dropdown-arrow svg {
  transform: rotate(90deg);
}
.ms-nav-desktop .nav-dropdown {
  position: absolute;
  min-width: 200px;
  max-width: 320px;
  width: max-content;
  background: var(--dropdown-bg-color, #ffffff);
  border: var(--dropdown-border-width, 0px) solid var(--dropdown-border-color, transparent);
  box-shadow: var(--dropdown-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
  list-style: none;
  margin: 0;
  padding: 0 !important;
  display: none;
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  overflow: hidden !important;
}
.ms-nav-desktop .nav-dropdown-scroll-inner {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 !important;
  margin: 0 !important;
  list-style: none;
}
.ms-nav-desktop .nav-dropdown-scroll-inner::-webkit-scrollbar {
  width: 8px;
}
.ms-nav-desktop .nav-dropdown-scroll-inner::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.ms-nav-desktop .nav-dropdown-scroll-inner::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.ms-nav-desktop .nav-dropdown-scroll-inner::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.ms-nav-desktop .nav-dropdown .nav-dropdown {
  z-index: 10000 !important;
}
.ms-nav-desktop .nav-dropdown.show {
  opacity: 1;
}
.ms-nav-desktop .nav-main-item > .nav-dropdown {
  top: 100%;
  left: 0;
}
.ms-nav-desktop .nav-dropdown .has-dropdown > .nav-dropdown {
  top: 0;
  left: 100%;
}
.ms-nav-desktop .nav-dropdown-scroll-inner > .nav-item {
  border-bottom: 1px solid var(--dropdown-divider-color, #f0f0f0);
  flex: none;
  padding: 0 !important;
  margin: 0 !important;
  list-style: none !important;
}
.ms-nav-desktop .nav-dropdown-scroll-inner > .nav-item:last-child {
  border-bottom: none;
}
.ms-nav-desktop .nav-dropdown .nav-link {
  border-radius: 0px !important;
  border: none !important;
  padding-top: var(--dropdown-text-spacing, 12px) !important;
  padding-bottom: var(--dropdown-text-spacing, 12px) !important;
  padding-left: var(--dropdown-item-padding, 20px) !important;
  padding-right: var(--dropdown-item-padding, 20px) !important;
  color: var(--dropdown-text-color, #000000);
  justify-content: flex-start;
  text-align: left;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}
.ms-nav-desktop .nav-dropdown .nav-link:hover {
  color: var(--dropdown-text-hover-color, #ffffff);
  background-color: var(--dropdown-bg-hover-color, #666666);
}
.ms-nav-desktop .nav-dropdown .nav-link.current-page {
  color: var(--dropdown-text-selected-color, #000000);
  background-color: var(--dropdown-bg-selected-color, transparent);
  font-weight: var(--nav-current-font-weight, 600);
}
.ms-nav-desktop .nav-dropdown .nav-link.current-page-parent {
  color: var(--dropdown-text-selected-color, #000000);
  background-color: var(--dropdown-bg-selected-color, transparent);
  font-weight: var(--nav-current-font-weight, 600);
}
.ms-nav-desktop .loading-indicator {
  padding: 20px;
  text-align: center;
  color: var(--loading-text-color, #666666);
  font-size: 14px;
}
@media (max-width: 767px) {
  .ms-nav-desktop .nav-main-list {
    flex-direction: column;
    width: 100%;
  }
  .ms-nav-desktop .nav-main-list.spread-items .nav-item {
    flex: none;
    width: 100%;
  }
  .ms-nav-desktop .nav-item {
    width: 100%;
  }
  .ms-nav-desktop .nav-item.nav-main-item {
    border-bottom: 1px solid var(--nav-border-color, #e0e0e0);
    margin-left: 0;
    margin-right: 0;
  }
  .ms-nav-desktop .nav-item.nav-main-item:last-child {
    border-bottom: none;
  }
  .ms-nav-desktop .nav-dropdown {
    position: static;
    display: none;
    box-shadow: none;
    border: none;
    border-top: 1px solid var(--dropdown-divider-color, #f0f0f0);
    opacity: 1;
    max-width: none;
    overflow: visible !important;
  }
  .ms-nav-desktop .nav-dropdown-scroll-inner {
    max-height: 400px;
    overflow-y: auto;
  }
  .ms-nav-desktop .nav-dropdown .nav-link {
    padding-left: calc(var(--dropdown-item-padding, 20px) + 12px) !important;
  }
  .ms-nav-desktop .nav-dropdown .nav-dropdown .nav-link {
    padding-left: calc(var(--dropdown-item-padding, 20px) + 28px) !important;
  }
  .ms-nav-desktop .has-dropdown .nav-link {
    cursor: pointer;
  }
  .ms-nav-desktop .has-dropdown.dropdown-open .nav-dropdown {
    display: block;
  }
}
`;

    function injectCSS() {
        if (document.getElementById("ms-css-" + WIDGET_ID)) return;
        var style = document.createElement("style");
        style.id = "ms-css-" + WIDGET_ID;
        style.textContent = WIDGET_CSS;
        // Inject into body so our CSS comes after Duda's site CSS in the cascade,
        // ensuring we win for equal-specificity rules without needing !important everywhere.
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

        container.innerHTML = `
<div class="dynamic-navigation-widget ms-nav-desktop">
  <nav class="nav-container" role="navigation">
    <ul class="nav-main-list">
      <!-- Navigation will be populated by JavaScript -->
    </ul>
  </nav>
  <div class="loading-indicator" style="display: none;">
    <span>Loading navigation...</span>
  </div>
</div>
        `;

        var data = props.dudaData || { config: {} };
        var element = container;

        // --- ORIGINAL WIDGET LOGIC ---

        try {
            setCSSVariablesImmediately();
            applyDesignSettings();
            await buildCompleteNavigation();
            detectAndMarkCurrentPage();
        } catch (error) {
            renderFallbackNavigation();
        }

        function setCSSVariablesImmediately() {
            const borderWidth = data.config['navBorderWidth'] !== undefined ? data.config['navBorderWidth'] : 0;
            const borderColor = data.config['navBorderColor'] || '#007cba';
            const navContainer = element.querySelector('.nav-container');
            navContainer.style.setProperty('--border-width', borderWidth + 'px');
            navContainer.style.setProperty('--border-color-active', borderColor);
        }

        function applyDesignSettings() {
            const navList = element.querySelector('.nav-main-list');
            const alignment = data.config['navAlignment'];
            if (alignment) {
                let alignmentValue = 'flex-start';
                switch (alignment) {
                    case 'center': alignmentValue = 'center'; break;
                    case 'right': alignmentValue = 'flex-end'; break;
                    default: alignmentValue = 'flex-start';
                }
                navList.style.setProperty('--nav-alignment', alignmentValue);
            }

            const spreadItems = data.config['spreadItems'];
            if (spreadItems) {
                navList.classList.add('spread-items');
                navList.style.setProperty('--nav-justify', 'space-between');
            } else {
                navList.classList.remove('spread-items');
                navList.style.setProperty('--nav-justify', 'var(--nav-alignment, flex-start)');
            }

            const itemPadding = data.config['itemPadding'];
            if (itemPadding !== undefined && itemPadding !== null) {
                navList.style.setProperty('--nav-item-padding', itemPadding + 'px');
            } else {
                navList.style.setProperty('--nav-item-padding', '16px');
            }

            const textSpacing = data.config['textSpacing'];
            if (textSpacing !== undefined && textSpacing !== null) {
                navList.style.setProperty('--nav-text-spacing', textSpacing + 'px');
            } else {
                navList.style.setProperty('--nav-text-spacing', '12px');
            }

            const itemMargin = data.config['itemMargin'];
            if (itemMargin !== undefined && itemMargin !== null) {
                navList.style.setProperty('--nav-item-margin', itemMargin + 'px');
            } else {
                navList.style.setProperty('--nav-item-margin', '0px');
            }

            const dropdownOffset = data.config['dropdownOffset'];
            let offsetValue = '5px';
            if (dropdownOffset !== undefined && dropdownOffset !== null && dropdownOffset !== '') {
                let numericOffset = 0;
                if (typeof dropdownOffset === 'number') {
                    numericOffset = dropdownOffset;
                } else if (typeof dropdownOffset === 'string') {
                    const cleanValue = dropdownOffset.replace(/px$/, '').trim();
                    numericOffset = parseFloat(cleanValue);
                } else {
                    numericOffset = Number(dropdownOffset);
                }
                if (!isNaN(numericOffset)) {
                    offsetValue = numericOffset + 'px';
                } else {
                    offsetValue = '5px';
                }
            }
            navList.style.setProperty('--dropdown-offset', offsetValue);

            const dropdownTextSpacing = data.config['dropdownTextSpacing'];
            if (dropdownTextSpacing !== undefined && dropdownTextSpacing !== null) {
                navList.style.setProperty('--dropdown-text-spacing', dropdownTextSpacing + 'px');
            } else {
                navList.style.setProperty('--dropdown-text-spacing', '12px');
            }

            const dropdownItemPadding = data.config['dropdownItemPadding'];
            if (dropdownItemPadding !== undefined && dropdownItemPadding !== null) {
                navList.style.setProperty('--dropdown-item-padding', dropdownItemPadding + 'px');
            } else {
                navList.style.setProperty('--dropdown-item-padding', '20px');
            }
        }

        function detectAndMarkCurrentPage() {
            const currentUrl = getCurrentPageUrl();
            const allNavLinks = element.querySelectorAll('.nav-link');
            const matches = [];

            allNavLinks.forEach(link => {
                link.classList.remove('current-page', 'current-page-parent');
            });

            allNavLinks.forEach((link, index) => {
                const linkUrl = link.getAttribute('href');
                const linkText = link.textContent.trim();
                let isMatch = false;

                if (linkUrl && linkUrl !== '#') {
                    const normalizedLinkUrl = normalizeUrl(linkUrl);
                    const normalizedCurrentUrl = normalizeUrl(currentUrl);

                    if (isHomePage(normalizedCurrentUrl) && isHomePage(normalizedLinkUrl)) {
                        isMatch = true;
                        matches.push({ text: linkText, url: linkUrl, reason: 'HOME_PAGE_MATCH' });
                    } else if (!isHomePage(normalizedCurrentUrl) && !isHomePage(normalizedLinkUrl) && normalizedLinkUrl === normalizedCurrentUrl) {
                        isMatch = true;
                        matches.push({ text: linkText, url: linkUrl, reason: 'EXACT_MATCH' });
                    }
                }

                if (isMatch) {
                    link.classList.add('current-page');
                    const navItem = link.closest('.nav-item');
                    const isMainNavItem = navItem && navItem.classList.contains('nav-main-item');
                    const isInDropdown = link.closest('.nav-dropdown');

                    if (!isMainNavItem && isInDropdown && !isLinkPageRedirect(link, currentUrl)) {
                        markParentItemsAsActive(link);
                    }
                }
            });
        }

        function isLinkPageRedirect(linkElement, currentUrl) {
            const linkUrl = linkElement.getAttribute('href');
            const isInDropdown = !!linkElement.closest('.nav-dropdown');
            const parentDropdown = linkElement.closest('.has-dropdown');
            if (isInDropdown && linkUrl && parentDropdown) {
                const normalizedLinkUrl = normalizeUrl(linkUrl);
                const normalizedCurrentUrl = normalizeUrl(currentUrl);
                return normalizedLinkUrl === normalizedCurrentUrl;
            }
            return false;
        }

        function getCurrentPageUrl() {
            const methods = [
                () => window.location.pathname,
                () => window.location.href.replace(window.location.origin, ''),
                () => document.location.pathname
            ];
            for (const method of methods) {
                try {
                    const url = method();
                    if (url) return normalizeUrl(url);
                } catch (e) {
                    continue;
                }
            }
            return '/';
        }

        function normalizeUrl(url) {
            if (!url) return '/';
            let normalized = url.toString().toLowerCase()
                .replace(/^https?:\/\/[^\/]+/, '')
                .replace(/[?#].*$/, '')
                .replace(/\/$/, '');
            if (!normalized.startsWith('/')) normalized = '/' + normalized;
            if (normalized === '') normalized = '/';
            return normalized;
        }

        function isHomePage(url) {
            if (!url) return false;
            const normalizedUrl = normalizeUrl(url);
            const homePatterns = ['/', '/home', '/index', '/index.html', '/index.htm', '/main', '/homepage', '/default'];
            return homePatterns.includes(normalizedUrl);
        }

        function markParentItemsAsActive(activeLink) {
            let currentDropdown = activeLink.closest('.nav-dropdown');
            if (!currentDropdown) return;
            while (currentDropdown) {
                const parentNavItem = currentDropdown.parentElement.closest('.nav-item.has-dropdown');
                if (parentNavItem) {
                    const parentLink = parentNavItem.querySelector(':scope > .nav-link');
                    if (parentLink && !parentLink.classList.contains('current-page')) {
                        const isMainNavParent = parentNavItem.classList.contains('nav-main-item');
                        if (!isMainNavParent) {
                            parentLink.classList.add('current-page-parent');
                        }
                    }
                }
                currentDropdown = currentDropdown.parentElement?.closest('.nav-dropdown');
            }
        }

        function sanitizeUrlSegment(segment) {
            if (!segment || typeof segment !== 'string') return '';
            let sanitized = segment.toLowerCase()
                .replace(/\s*&\s*/g, '-and-')
                .replace(/\./g, '-')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            if (!sanitized) sanitized = segment.replace(/[^\w]/g, '').toLowerCase() || 'page';
            return sanitized;
        }

        async function buildCompleteNavigation() {
            const navContainer = element.querySelector('.nav-main-list');
            navContainer.innerHTML = '';

            const showSitePages = data.config['showSitePages'];
            const customLinks = data.config['customLinks'] || [];
            const collectionName = data.config['collectionName'];
            const locationsPageLink = data.config['locationsPage'];

            let navigationPages = [];

            if (showSitePages) {
                navigationPages = await getSitePages();
            }

            if (customLinks && customLinks.length > 0) {
                customLinks.forEach((linkData, index) => {
                    if (linkData.linkText && linkData.linkUrl) {
                        navigationPages.push({
                            name: linkData.linkText,
                            url: getCustomLinkUrl(linkData.linkUrl),
                            order: navigationPages.length + index,
                            children: [],
                            isFolder: false,
                            isCustomLink: true
                        });
                    }
                });
            }

            if (collectionName && collectionName.trim() !== '' && locationsPageLink && locationsPageLink !== '') {
                const locationsPageUrl = extractUrlFromLinkData(locationsPageLink);
                if (locationsPageUrl) {
                    try {
                        const allCollectionItems = await fetchAllCollectionItems(collectionName);
                        if (allCollectionItems.length > 0) {
                            const collectionHierarchy = buildCollectionHierarchy(allCollectionItems);
                            addCollectionSubNavToPage(navigationPages, locationsPageUrl, collectionHierarchy);
                        }
                    } catch (error) {
                        const sampleHierarchy = createSampleCollectionHierarchy();
                        addCollectionSubNavToPage(navigationPages, locationsPageUrl, sampleHierarchy);
                    }
                }
            }

            if (navigationPages.length === 0) {
                navigationPages = createSampleNavigationForPreview();
            }

            renderNavigationStructure(navContainer, navigationPages);

            const loadingIndicator = element.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }

        async function fetchAllCollectionItems(collectionName) {
            const collectionAPI = await window.dmAPI.loadCollectionsAPI();
            const allItems = [];
            let currentPage = 0;
            let hasMorePages = true;

            while (hasMorePages) {
                try {
                    const response = await collectionAPI
                        .data(collectionName)
                        .pageSize(100)
                        .pageNumber(currentPage)
                        .get();
                    if (response.values && response.values.length > 0) {
                        allItems.push(...response.values);
                        if (response.values.length < 100) {
                            hasMorePages = false;
                        } else {
                            currentPage++;
                        }
                    } else {
                        hasMorePages = false;
                    }
                } catch (error) {
                    hasMorePages = false;
                }
            }
            return allItems;
        }

        function createSampleNavigationForPreview() {
            return [
                { name: 'Home', url: '/', order: 0, children: [], isFolder: false },
                {
                    name: 'Locations', url: '/locations', order: 1, isFolder: true, isClickable: true,
                    children: [
                        {
                            name: 'California', url: '/california', order: 0, isFolder: true, isClickable: true,
                            children: [
                                {
                                    name: 'Los Angeles', url: '/california/los-angeles', order: 0, isFolder: true, isClickable: true,
                                    children: [
                                        { name: 'Downtown LA Storage', url: '/storage-units/downtown-la-storage', order: 0, children: [], isFolder: false, isClickable: true },
                                        { name: 'Hollywood Storage', url: '/storage-units/hollywood-storage', order: 1, children: [], isFolder: false, isClickable: true }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { name: 'About', url: '/about', order: 2, children: [], isFolder: false }
            ];
        }

        function createSampleCollectionHierarchy() {
            return [
                {
                    name: 'California', url: '/california', order: 0, isFolder: true, isClickable: true,
                    children: [
                        {
                            name: 'Los Angeles', url: '/california/los-angeles', order: 0, isFolder: true, isClickable: true,
                            children: [
                                { name: 'Downtown Storage', url: '/storage-units/downtown', order: 0, children: [], isFolder: false, isClickable: true }
                            ]
                        }
                    ]
                }
            ];
        }

        function extractUrlFromLinkData(linkData) {
            if (!linkData) return null;
            if (typeof linkData === 'string') return linkData;
            if (typeof linkData === 'object') {
                const possibleUrlProps = ['url', 'href', 'link', 'page_url', 'target', 'value'];
                for (const prop of possibleUrlProps) {
                    if (linkData[prop]) return linkData[prop];
                }
                for (const [key, value] of Object.entries(linkData)) {
                    if (typeof value === 'string' && value.trim() !== '' && value !== 'null') return value;
                }
            }
            return null;
        }

        function getCustomLinkUrl(linkData) {
            if (typeof linkData === 'string') return linkData;
            if (typeof linkData === 'object' && linkData) {
                return linkData.url || linkData.href || linkData.link || linkData.target || linkData.value || '#';
            }
            return '#';
        }

        async function getSitePages() {
            try {
                const headerSelectors = ['header nav', '.header nav', '[data-aid="HEADER_NAV"]', '.site-navigation', '.main-navigation', '.navigation', '.navbar', 'nav[role="navigation"]', '.nav-container:not(.dynamic-navigation-widget .nav-container)', '[class*="navigation"]', '[id*="nav"]'];
                let siteNav = null;
                for (const selector of headerSelectors) {
                    const nav = document.querySelector(selector);
                    if (nav && nav !== element.closest('.nav-container') && nav.querySelectorAll('a[href], [data-page-id]').length > 0) {
                        siteNav = nav;
                        break;
                    }
                }
                if (siteNav) {
                    return parseNavigationStructure(siteNav);
                } else {
                    return [];
                }
            } catch (error) {
                return [];
            }
        }

        function parseNavigationStructure(navElement) {
            const pages = [];
            const topLevelSelectors = [':scope > ul > li', ':scope > ol > li', ':scope > div > ul > li', ':scope > div > ol > li', ':scope > li'];
            let topLevelItems = [];
            for (const selector of topLevelSelectors) {
                try {
                    topLevelItems = navElement.querySelectorAll(selector);
                    if (topLevelItems.length > 0) break;
                } catch (e) { continue; }
            }
            if (topLevelItems.length > 0) {
                topLevelItems.forEach((item, index) => {
                    const pageData = parsePageItem(item, index);
                    if (pageData) pages.push(pageData);
                });
            }
            return pages;
        }

        function parsePageItem(item, order) {
            const pageData = { name: '', url: '', order: order, children: [], isFolder: false };
            const hasSubMenu = item.querySelector(':scope > ul, :scope > ol, :scope > .submenu, :scope > .dropdown, :scope > .sub-menu');
            const isNavFolder = item.classList.contains('nav-folder') || item.classList.contains('navigation-folder') || item.classList.contains('menu-folder') || item.classList.contains('folder') || item.hasAttribute('data-folder') || hasSubMenu;
            const directLink = item.querySelector(':scope > a[href], :scope > a[data-page-id], :scope > a[data-href]');

            if (directLink) {
                pageData.name = getPageName(directLink);
                pageData.url = getPageUrl(directLink);
            }

            if (isNavFolder || hasSubMenu) {
                if (!pageData.name) {
                    const folderNameElement = item.querySelector(':scope > span:not(.icon):not(.arrow), :scope > div:not(:has(ul)):not(:has(ol)):not(:has(a)), :scope > .folder-name, :scope > .nav-folder-name');
                    if (folderNameElement) {
                        pageData.name = folderNameElement.textContent.trim();
                        pageData.isFolder = true;
                        if (!pageData.url || pageData.url === '') pageData.url = '#';
                    }
                } else {
                    pageData.isFolder = true;
                }
            }

            if (!pageData.name) {
                let textContent = item.textContent.trim();
                const childLinks = item.querySelectorAll('a, ul, ol');
                childLinks.forEach(child => {
                    const childText = child.textContent.trim();
                    if (childText) textContent = textContent.replace(childText, '').trim();
                });
                if (textContent) {
                    pageData.name = textContent;
                    pageData.url = pageData.url || '#';
                }
            }

            if (!pageData.name) return null;

            if (hasSubMenu) {
                const childItems = hasSubMenu.querySelectorAll(':scope > li');
                childItems.forEach((childItem, childIndex) => {
                    const childData = parsePageItem(childItem, childIndex);
                    if (childData) pageData.children.push(childData);
                });
            }
            return pageData;
        }

        function getPageName(linkElement) {
            const methods = [
                () => linkElement.getAttribute('data-page-name'),
                () => linkElement.getAttribute('title'),
                () => linkElement.getAttribute('aria-label'),
                () => {
                    const textSpan = linkElement.querySelector('span:not(.icon):not(.arrow)');
                    return textSpan ? textSpan.textContent.trim() : null;
                },
                () => {
                    let text = linkElement.textContent.trim();
                    const iconElements = linkElement.querySelectorAll('.icon, .arrow, .dropdown-arrow, svg');
                    iconElements.forEach(icon => {
                        if (icon.textContent) text = text.replace(icon.textContent, '').trim();
                    });
                    return text;
                }
            ];
            for (const method of methods) {
                const name = method();
                if (name && name.trim() !== '') return name.trim();
            }
            return linkElement.textContent ? linkElement.textContent.trim() : '';
        }

        function getPageUrl(linkElement) {
            return linkElement.getAttribute('href') || linkElement.getAttribute('data-page-id') || linkElement.getAttribute('data-href') || '#';
        }

        function addCollectionSubNavToPage(pages, targetUrl, collectionHierarchy) {
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (urlMatches(page.url, targetUrl)) {
                    page.children = [...collectionHierarchy];
                    page.isFolder = collectionHierarchy.length > 0;
                    return true;
                }
                if (page.children && page.children.length > 0) {
                    const found = addCollectionSubNavToPage(page.children, targetUrl, collectionHierarchy);
                    if (found) return true;
                }
            }
            return false;
        }

        function urlMatches(pageUrl, targetUrl) {
            if (!pageUrl || !targetUrl) return false;
            if (pageUrl === targetUrl) return true;
            const normalize = (url) => url.toString().toLowerCase().replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '').replace(/^\//, '');
            const normalizedPage = normalize(pageUrl);
            const normalizedTarget = normalize(targetUrl);
            if (normalizedPage === normalizedTarget) return true;
            if (normalizedPage.includes(normalizedTarget) || normalizedTarget.includes(normalizedPage)) return true;
            return false;
        }

        function buildCollectionHierarchy(collectionItems) {
            const hierarchy = {};
            let urlPrefix = data.config['facilityUrlPrefix'] || 'storage-units';
            urlPrefix = urlPrefix.replace(/^\/+|\/+$/g, '');
            let statePrepend = data.config['statePrepend'] || '';
            let cityPrepend = data.config['cityPrepend'] || '';
            statePrepend = statePrepend.replace(/^\/+|\/+$/g, '');
            cityPrepend = cityPrepend.replace(/^\/+|\/+$/g, '');

            collectionItems.forEach((item, index) => {
                const itemData = item.data;
                const facilityName = itemData['M.fac-name'] || itemData['facility-name'];
                const facilityState = itemData['M.state'] || itemData['facility-state'];
                const facilityCity = itemData['M.city'] || itemData['facility-city'];
                const stateLink = itemData['M.state-link'] || itemData['state-link'] || '';
                const cityLink = itemData['M.city-link'] || itemData['city-link'] || '';
                const pageItemUrl = item.page_item_url;

                if (!facilityName || facilityName.trim() === '') return;

                let facilityUrl = '#';
                if (pageItemUrl) facilityUrl = `/${urlPrefix}/${pageItemUrl}`;

                const isStateClickable = stateLink.toLowerCase() === 'yes';
                const isCityClickable = cityLink.toLowerCase() === 'yes';
                const facilityKey = `${facilityName}-${index}`;

                if (facilityState && facilityState.trim() !== '' && facilityCity && facilityCity.trim() !== '') {
                    if (!hierarchy[facilityState]) {
                        const stateSlug = sanitizeUrlSegment(facilityState);
                        let stateUrl = '#';
                        if (isStateClickable) stateUrl = statePrepend ? `/${statePrepend}/${stateSlug}` : `/${stateSlug}`;
                        hierarchy[facilityState] = { name: facilityState, url: stateUrl, children: {}, order: Object.keys(hierarchy).length, isFolder: true, isClickable: isStateClickable };
                    }
                    if (!hierarchy[facilityState].children[facilityCity]) {
                        const stateSlug = sanitizeUrlSegment(facilityState);
                        const citySlug = sanitizeUrlSegment(facilityCity);
                        let cityUrl = '#';
                        if (isCityClickable) {
                            if (cityPrepend) cityUrl = `/${cityPrepend}/${stateSlug}/${citySlug}`;
                            else if (statePrepend) cityUrl = `/${statePrepend}/${stateSlug}/${citySlug}`;
                            else cityUrl = `/${stateSlug}/${citySlug}`;
                        }
                        hierarchy[facilityState].children[facilityCity] = { name: facilityCity, url: cityUrl, children: {}, order: Object.keys(hierarchy[facilityState].children).length, isFolder: true, isClickable: isCityClickable };
                    }
                    hierarchy[facilityState].children[facilityCity].children[facilityKey] = { name: facilityName, url: facilityUrl, children: [], order: Object.keys(hierarchy[facilityState].children[facilityCity].children).length, isFolder: false, isClickable: true };
                } else if (facilityState && facilityState.trim() !== '') {
                    if (!hierarchy[facilityState]) {
                        const stateSlug = sanitizeUrlSegment(facilityState);
                        let stateUrl = '#';
                        if (isStateClickable) stateUrl = statePrepend ? `/${statePrepend}/${stateSlug}` : `/${stateSlug}`;
                        hierarchy[facilityState] = { name: facilityState, url: stateUrl, children: {}, order: Object.keys(hierarchy).length, isFolder: true, isClickable: isStateClickable };
                    }
                    hierarchy[facilityState].children[facilityKey] = { name: facilityName, url: facilityUrl, children: [], order: Object.keys(hierarchy[facilityState].children).length, isFolder: false, isClickable: true };
                } else if (facilityCity && facilityCity.trim() !== '' && (!facilityState || facilityState.trim() === '')) {
                    if (!hierarchy[facilityCity]) {
                        const citySlug = sanitizeUrlSegment(facilityCity);
                        let cityUrl = '#';
                        if (isCityClickable) cityUrl = cityPrepend ? `/${cityPrepend}/${citySlug}` : `/${citySlug}`;
                        hierarchy[facilityCity] = { name: facilityCity, url: cityUrl, children: {}, order: Object.keys(hierarchy).length, isFolder: true, isClickable: isCityClickable };
                    }
                    hierarchy[facilityCity].children[facilityKey] = { name: facilityName, url: facilityUrl, children: [], order: Object.keys(hierarchy[facilityCity].children).length, isFolder: false, isClickable: true };
                } else {
                    hierarchy[facilityKey] = { name: facilityName, url: facilityUrl, children: [], order: Object.keys(hierarchy).length, isFolder: false, isClickable: true };
                }
            });
            return convertHierarchyToArray(hierarchy);
        }

        function convertHierarchyToArray(hierarchy) {
            const result = [];
            Object.values(hierarchy).forEach(item => {
                const navItem = { name: item.name, url: item.url, order: item.order, children: [], isFolder: item.children && Object.keys(item.children).length > 0, isClickable: item.isClickable !== false };
                if (item.children && Object.keys(item.children).length > 0) navItem.children = convertHierarchyToArray(item.children);
                result.push(navItem);
            });
            return result.sort((a, b) => a.order - b.order);
        }

        function renderNavigationStructure(container, pages) {
            pages.forEach(page => {
                if (page && page.name) {
                    const navItem = createNavigationItem(page);
                    container.appendChild(navItem);
                }
            });
        }

        function createNavigationItem(page, depth = 0) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.setAttribute('data-depth', depth);
            if (depth === 0) li.classList.add('nav-main-item');
            const hasChildren = page.children && page.children.length > 0;
            if (hasChildren) li.classList.add('has-dropdown');

            const link = document.createElement('a');
            link.className = 'nav-link';
            link.textContent = page.name;
            const isClickable = page.isClickable !== false && page.url && page.url !== '#';
            if (isClickable) link.href = page.url;
            else { link.href = '#'; link.addEventListener('click', (e) => e.preventDefault()); }
            li.appendChild(link);

            if (hasChildren) {
                const arrow = document.createElement('span');
                arrow.className = 'dropdown-arrow';
                arrow.innerHTML = '<svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                link.appendChild(arrow);
            }

            if (hasChildren) {
                const dropdown = document.createElement('ul');
                dropdown.className = 'nav-dropdown';
                dropdown.setAttribute('data-dropdown-depth', depth);
                const scrollInner = document.createElement('div');
                scrollInner.className = 'nav-dropdown-scroll-inner';

                page.children.forEach(child => {
                    const childItem = createNavigationItem(child, depth + 1);
                    scrollInner.appendChild(childItem);
                });
                dropdown.appendChild(scrollInner);
                li.appendChild(dropdown);

                li.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 767) {
                        dropdown.style.display = 'block';
                        li.classList.add('dropdown-open');
                        setTimeout(() => { positionDropdown(dropdown, li); dropdown.classList.add('show'); }, 10);
                    }
                });

                li.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 767) {
                        dropdown.classList.remove('show');
                        setTimeout(() => {
                            dropdown.style.display = 'none';
                            li.classList.remove('dropdown-open');
                            if (dropdown._positionUpdater) { clearInterval(dropdown._positionUpdater); delete dropdown._positionUpdater; }
                        }, 200);
                    }
                });

                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 767) {
                        e.preventDefault();
                        const isOpen = li.classList.contains('dropdown-open');
                        const allDropdowns = element.querySelectorAll('.has-dropdown.dropdown-open');
                        allDropdowns.forEach(item => {
                            if (item !== li) {
                                item.classList.remove('dropdown-open');
                                const otherDropdown = item.querySelector('.nav-dropdown');
                                if (otherDropdown) otherDropdown.style.display = 'none';
                            }
                        });
                        if (isOpen) {
                            li.classList.remove('dropdown-open');
                            dropdown.style.display = 'none';
                        } else {
                            li.classList.add('dropdown-open');
                            dropdown.style.display = 'block';
                        }
                    }
                });
            }
            return li;
        }

        function positionDropdown(dropdown, parentItem) {
            const viewportHeight = window.innerHeight;
            const parentRect = parentItem.getBoundingClientRect();
            const isMainNavDropdown = parentItem.classList.contains('nav-main-item');

            dropdown.style.position = ''; dropdown.style.left = ''; dropdown.style.right = ''; dropdown.style.top = ''; dropdown.style.bottom = '';

            if (isMainNavDropdown) {
                dropdown.style.position = 'absolute';
                dropdown.style.top = '100%';
                const availableHeight = viewportHeight - parentRect.bottom;
                const scrollInner = dropdown.querySelector('.nav-dropdown-scroll-inner');
                if (scrollInner) scrollInner.style.maxHeight = Math.min(400, availableHeight - 20) + 'px';

                const dropdownWidth = dropdown.offsetWidth;
                const dropdownRight = parentRect.left + dropdownWidth;
                if (dropdownRight > window.innerWidth - 20) { dropdown.style.right = '0px'; dropdown.style.left = 'auto'; }
                else { dropdown.style.left = '0px'; dropdown.style.right = 'auto'; }
            } else {
                dropdown.style.position = 'fixed';
                dropdown.style.zIndex = '10000';

                const computedStyle = getComputedStyle(element.querySelector('.nav-main-list'));
                const offsetStr = computedStyle.getPropertyValue('--dropdown-offset').trim();
                const offset = parseFloat(offsetStr) || 5;

                const updatePosition = () => {
                    const currentRect = parentItem.getBoundingClientRect();
                    dropdown.style.top = currentRect.top + 'px';
                    dropdown.style.left = (currentRect.right + offset) + 'px';
                    const availableHeight = viewportHeight - currentRect.top - 20;
                    const scrollInner = dropdown.querySelector('.nav-dropdown-scroll-inner');
                    if (scrollInner) scrollInner.style.maxHeight = Math.min(400, availableHeight) + 'px';
                };

                updatePosition();
                if (dropdown._positionUpdater) clearInterval(dropdown._positionUpdater);
                dropdown._positionUpdater = setInterval(updatePosition, 16);
            }
        }

        function renderFallbackNavigation() {
            console.error('[MS Widgets] Rendering fallback navigation');
        }

    }

    function clean(container) {
        if (container) container.innerHTML = "";
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init, clean };

})();
