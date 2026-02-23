(function () {

    const WIDGET_ID = "adv-nav-desktop";

    const WIDGET_CSS = `
.widget-c31e05 .facility-widget {
  width: 100%;
  padding: 20px 0;
}
.widget-c31e05 .facility-columns-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
}
.widget-c31e05 .facility-columns-container.stacked-horizontally { flex-direction: row; }
.widget-c31e05 .facility-columns-container.stacked-vertically { flex-direction: column; align-items: center; }
.widget-c31e05 .facility-columns-container.wrap-enabled { flex-wrap: wrap; justify-content: center; }
.widget-c31e05 .facility-columns-container.wrap-disabled { flex-wrap: nowrap; justify-content: center; }
.widget-c31e05 .facility-column {
  min-width: 250px; max-width: 350px; background: #ffffff;
  border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden;
  transition: all 0.3s ease; display: flex; flex-direction: column;
}
.widget-c31e05 .facility-columns-container.wrap-enabled .facility-column { flex: 0 0 auto; }
.widget-c31e05 .facility-columns-container.wrap-disabled .facility-column { flex: 0 1 auto; }
.widget-c31e05 .facility-image-container { width: 100%; height: 200px; overflow: hidden; position: relative; flex-shrink: 0; }
.widget-c31e05 .facility-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.widget-c31e05 .facility-content { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; align-items: center; text-align: center; }
.widget-c31e05 .facility-name { font-size: 1.25rem; font-weight: 600; color: #333; margin: 0 0 10px 0; line-height: 1.3; text-align: center; }
.widget-c31e05 .facility-address { font-size: 0.95rem; color: #666; margin: 0 0 20px 0; line-height: 1.4; flex-grow: 1; text-align: center; }
.widget-c31e05 .facility-debug-info { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; margin: 10px 0 15px 0; font-size: 0.85rem; text-align: left; width: 100%; box-sizing: border-box; }
.widget-c31e05 .facility-debug-info .debug-item { margin: 5px 0; color: #495057; word-break: break-word; }
.widget-c31e05 .facility-debug-info .debug-item strong { color: #212529; font-weight: 600; }
.widget-c31e05 .facility-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: auto; width: 100%; align-items: center; }
.widget-c31e05 .facility-link-button,
.widget-c31e05 .facility-phone-button { display: inline-block; padding: 12px 20px; text-decoration: none; border-radius: 5px; text-align: center; font-weight: 500; transition: all 0.3s ease; font-size: 0.95rem; width: 100%; box-sizing: border-box; }
.widget-c31e05 .facility-link-button { background-color: #007cba; color: white; border: 2px solid #007cba; }
.widget-c31e05 .facility-link-button:hover { background-color: #005a87; border-color: #005a87; }
.widget-c31e05 .facility-phone-button { background-color: transparent; color: #007cba; border: 2px solid #007cba; }
.widget-c31e05 .facility-phone-button:hover { background-color: #007cba; color: white; }
.widget-c31e05 .no-facilities-message { text-align: center; padding: 40px 20px; color: #666; font-size: 1.1rem; width: 100%; }
.widget-c31e05 .facility-pagination-controls { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; margin-top: 30px; padding: 20px 0; }
.widget-c31e05 .pagination-btn { padding: 10px 20px; background-color: #555555; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: all 0.3s ease; }
.widget-c31e05 .pagination-btn:hover:not(:disabled) { background-color: #333333; }
.widget-c31e05 .pagination-btn:disabled { background-color: #ccc; cursor: not-allowed; opacity: 0.6; }
.widget-c31e05 .pagination-numbers { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.widget-c31e05 .pagination-number { padding: 8px 12px; background-color: #f0f0f0; color: #333; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; }
.widget-c31e05 .pagination-number:hover { background-color: #e0e0e0; }
.widget-c31e05 .pagination-number.active { background-color: #555555; color: white; border-color: #555555; font-weight: 600; }
@media (min-width: 768px) and (max-width: 1024px) { .widget-c31e05 .facility-column { min-width: 200px; } }
@media (max-width: 767px) {
  .widget-c31e05 .facility-columns-container { flex-direction: column !important; gap: 15px !important; justify-content: flex-start !important; align-items: center !important; }
  .widget-c31e05 .facility-column { min-width: 100%; max-width: 100%; flex: 1 1 auto !important; }
  .widget-c31e05 .facility-content { padding: 15px; }
  .widget-c31e05 .facility-buttons { flex-direction: column; }
  .widget-c31e05 .facility-pagination-controls { gap: 8px; }
  .widget-c31e05 .pagination-btn { padding: 8px 16px; font-size: 0.85rem; }
  .widget-c31e05 .pagination-number { padding: 6px 10px; font-size: 0.85rem; }
}
`;

    function injectCSS() {
        if (document.getElementById("ms-css-" + WIDGET_ID)) return;
        var style = document.createElement("style");
        style.id = "ms-css-" + WIDGET_ID;
        style.textContent = WIDGET_CSS;
        document.head.appendChild(style);
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
        container.classList.add("widget-c31e05");

        var stackDir = (props.dudaData && props.dudaData.config && props.dudaData.config.stackingDirection) || "row";
        var wrapCols = (props.dudaData && props.dudaData.config && props.dudaData.config.wrapColumns);
        container.innerHTML = `
      <div class="facility-widget">
        <div class="facility-columns-container ${stackDir === 'column' ? 'stacked-vertically' : 'stacked-horizontally'} ${wrapCols ? 'wrap-enabled' : 'wrap-disabled'}">
        </div>
        <div class="facility-pagination-controls">
          <button class="pagination-btn prev-btn" disabled>Previous</button>
          <div class="pagination-numbers"></div>
          <button class="pagination-btn next-btn">Next</button>
        </div>
      </div>
    `;

        var data = props.dudaData || { config: {} };
        var element = container;

        var allFacilityData = [];
        var currentPage = 1;
        var facilitiesPerPage = 10;
        var filteredColumns = [];
        var additionalFacilitySourceMap = {};

        async function initFacilityWidget() {
            try {
                const collection = await window.dmAPI.loadCollectionsAPI();
                facilitiesPerPage = parseInt(data.config.facilitiesPerPage) || 10;
                allFacilityData = await fetchAllFacilities(collection, data.config.collectionName || 'facilities');

                let additionalCollectionData = [];
                if (data.config.additionalCollectionName && data.config.additionalCollectionName.trim() !== '') {
                    additionalCollectionData = await fetchAllFacilities(collection, data.config.additionalCollectionName.trim());
                }

                const facilityFilter = data.config.facilityFilter || 'Portfolio';
                const customGroupings = data.config.customGroupings || [];
                let stateCity = data.config.stateCity || '';

                if (!stateCity || stateCity.trim() === '') {
                    if (facilityFilter === 'State' || facilityFilter === 'City' || facilityFilter === 'Brand') {
                        stateCity = getCurrentPageItemUrl();
                    }
                }

                const currentFacility = getCurrentPageFacility();
                const additionalSlugs = additionalCollectionData.length > 0 && currentFacility
                    ? extractAdditionalSlugs(additionalCollectionData, facilityFilter, currentFacility)
                    : [];

                filteredColumns = processFilteredColumns(allFacilityData, facilityFilter, customGroupings, stateCity, additionalSlugs);
                renderPage(currentPage);
                renderPaginationControls();
                applyDynamicCSS();
                applyHoverEffects();
                attachPaginationListeners();

            } catch (error) {
                console.error('Error initializing facility widget:', error);
                showSampleData();
                applyDynamicCSS();
                applyHoverEffects();
            }
        }

        async function fetchAllFacilities(collection, collectionName) {
            const allData = [];
            let pageNum = 0;
            let hasMoreData = true;
            while (hasMoreData) {
                const response = await collection.data(collectionName).pageSize(100).pageNumber(pageNum).get();
                if (response.values && response.values.length > 0) {
                    allData.push(...response.values);
                    pageNum++;
                    if (response.values.length < 100) hasMoreData = false;
                } else {
                    hasMoreData = false;
                }
            }
            return allData;
        }

        function getCurrentPageFacility() {
            const urlSegment = getCurrentPageItemUrl();
            if (!urlSegment) return null;
            let currentFacility = allFacilityData.find(item => item.page_item_url === urlSegment);
            if (!currentFacility) {
                currentFacility = allFacilityData.find(item => {
                    const slug = item.data['M.slug'];
                    return slug && normalizeForComparison(slug) === normalizeForComparison(urlSegment);
                });
            }
            if (!currentFacility) {
                currentFacility = allFacilityData.find(item => {
                    const pageUrl = item.page_item_url;
                    if (!pageUrl) return false;
                    const n1 = normalizeForComparison(pageUrl);
                    const n2 = normalizeForComparison(urlSegment);
                    return n1.includes(n2) || n2.includes(n1);
                });
            }
            return currentFacility;
        }

        function extractAdditionalSlugs(additionalCollectionData, facilityFilter, currentFacility) {
            const slugsToAdd = [];
            let matchField = '', matchValue = '';
            if (facilityFilter === 'City') { matchField = 'M.city'; matchValue = currentFacility.data['M.city']; }
            else if (facilityFilter === 'State') { matchField = 'M.state'; matchValue = currentFacility.data['M.state']; }
            else return slugsToAdd;
            if (!matchValue || matchValue.trim() === '') return slugsToAdd;
            const normalizedMatchValue = normalizeForComparison(matchValue);
            const matchingRows = additionalCollectionData.filter(item => {
                const fieldValue = item.data[matchField];
                return fieldValue && normalizeForComparison(fieldValue) === normalizedMatchValue;
            });
            const fieldsToCheck = ['M.add-fac-01', 'M.add-fac-02', 'M.add-fac-03', 'M.add-fac-04', 'M.add-fac-05', 'M.add-fac-06', 'M.add-fac-07', 'M.add-fac-08', 'M.add-fac-09', 'M.add-fac-10'];
            matchingRows.forEach(item => {
                fieldsToCheck.forEach(fieldName => {
                    const slugValue = item.data[fieldName];
                    if (slugValue && slugValue.trim() !== '') {
                        const trimmedSlug = slugValue.trim();
                        const facilityExists = allFacilityData.find(fac => {
                            const facSlug = fac.data['M.slug'];
                            return facSlug && normalizeForComparison(facSlug) === normalizeForComparison(trimmedSlug);
                        });
                        if (facilityExists && !additionalFacilitySourceMap[trimmedSlug]) {
                            slugsToAdd.push(trimmedSlug);
                            additionalFacilitySourceMap[trimmedSlug] = fieldName;
                        }
                    }
                });
            });
            return slugsToAdd;
        }

        function normalizeForComparison(value) {
            if (!value) return '';
            return value.toString().toLowerCase().trim().replace(/-/g, ' ').replace(/\s+/g, ' ');
        }

        function processFilteredColumns(facilityData, facilityFilter, customGroupings, stateCity, additionalSlugs) {
            let columnsToCreate = [];
            const normalizedFilter = normalizeForComparison(stateCity);
            if (facilityFilter === 'Portfolio') {
                const uniqueSlugs = [...new Set(facilityData.map(item => item.data['M.slug']).filter(Boolean))];
                columnsToCreate = uniqueSlugs.map(slug => ({ slug, type: 'portfolio' }));
            } else if (facilityFilter === 'State') {
                const uniqueCombinations = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], state = item.data['M.state'];
                    if (slug && state && (!normalizedFilter || normalizeForComparison(state) === normalizedFilter)) uniqueCombinations.add(`${slug}|${state}`);
                });
                columnsToCreate = [...uniqueCombinations].map(combo => { const [slug, state] = combo.split('|'); return { slug, state, type: 'state' }; });
            } else if (facilityFilter === 'City') {
                const uniqueCombinations = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], city = item.data['M.city'];
                    if (slug && city && (!normalizedFilter || normalizeForComparison(city) === normalizedFilter)) uniqueCombinations.add(`${slug}|${city}`);
                });
                columnsToCreate = [...uniqueCombinations].map(combo => { const [slug, city] = combo.split('|'); return { slug, city, type: 'city' }; });
            } else if (facilityFilter === 'Brand') {
                const uniqueCombinations = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], brand = item.data['M.fac-brand'], pageItemUrl = item.page_item_url;
                    if (slug) {
                        let shouldInclude = false;
                        if (!normalizedFilter) { shouldInclude = true; }
                        else {
                            if (brand) { const nb = normalizeForComparison(brand); if (nb === normalizedFilter || nb.includes(normalizedFilter) || normalizedFilter.includes(nb)) shouldInclude = true; }
                            if (!shouldInclude && pageItemUrl) { const nu = normalizeForComparison(pageItemUrl); if (nu.includes(normalizedFilter) || normalizedFilter.includes(nu)) shouldInclude = true; }
                        }
                        if (shouldInclude && brand) uniqueCombinations.add(`${slug}|${brand}`);
                    }
                });
                columnsToCreate = [...uniqueCombinations].map(combo => { const [slug, brand] = combo.split('|'); return { slug, brand, type: 'brand' }; });
            } else if (facilityFilter === 'Custom') {
                customGroupings.forEach(grouping => { if (grouping.customSlug && grouping.customSlug.trim() !== '') columnsToCreate.push({ slug: grouping.customSlug.trim(), type: 'custom' }); });
            } else if (facilityFilter === 'Nearby') {
                const currentPageSlug = getCurrentPageSlug();
                if (currentPageSlug) {
                    const currentFacility = facilityData.find(item => item.data['M.slug'] === currentPageSlug);
                    if (currentFacility) {
                        ['M.nearby-01', 'M.nearby-02', 'M.nearby-03'].forEach(field => {
                            const nearbySlug = currentFacility.data[field];
                            if (nearbySlug && nearbySlug.trim() !== '') columnsToCreate.push({ slug: nearbySlug.trim(), type: 'nearby' });
                        });
                    }
                }
                customGroupings.forEach(grouping => { if (grouping.customSlug && grouping.customSlug.trim() !== '') columnsToCreate.push({ slug: grouping.customSlug.trim(), type: 'custom' }); });
            }
            if ((facilityFilter === 'State' || facilityFilter === 'City' || facilityFilter === 'Brand') && customGroupings.length > 0) {
                customGroupings.forEach(grouping => { if (grouping.customSlug && grouping.customSlug.trim() !== '') columnsToCreate.push({ slug: grouping.customSlug.trim(), type: 'custom' }); });
            }
            if (additionalSlugs.length > 0) additionalSlugs.forEach(slug => columnsToCreate.push({ slug, type: 'additional-collection' }));
            return columnsToCreate;
        }

        function scrollToTop() {
            const widgetTop = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: widgetTop - 120, behavior: 'smooth' });
        }

        function renderPage(pageNumber) {
            const container2 = element.querySelector('.facility-columns-container');
            container2.innerHTML = '';
            const startIndex = (pageNumber - 1) * facilitiesPerPage;
            const endIndex = Math.min(startIndex + facilitiesPerPage, filteredColumns.length);
            const pageColumns = filteredColumns.slice(startIndex, endIndex);
            pageColumns.forEach((column, index) => {
                const facilityInfo = allFacilityData.find(item => {
                    const itemSlug = item.data['M.slug'];
                    return itemSlug && normalizeForComparison(itemSlug) === normalizeForComparison(column.slug);
                });
                if (facilityInfo) container2.appendChild(createColumnElement(facilityInfo, index, column));
            });
            if (pageColumns.length === 0) container2.innerHTML = '<p class="no-facilities-message">No facilities found matching your criteria.</p>';
        }

        function getBrandColorsForCurrentPage() {
            const startIndex = (currentPage - 1) * facilitiesPerPage;
            const firstColumn = filteredColumns[startIndex];
            if (firstColumn) {
                const facilityInfo = allFacilityData.find(item => item.data['M.slug'] === firstColumn.slug);
                if (facilityInfo) return { primary: facilityInfo.data['M.c-primary'] || '', cta: facilityInfo.data['M.c-cta'] || '', light: facilityInfo.data['M.c-light'] || '', dark: facilityInfo.data['M.c-dark'] || '' };
            }
            return null;
        }

        function renderPaginationControls() {
            const totalPages = Math.ceil(filteredColumns.length / facilitiesPerPage);
            const paginationNumbers = element.querySelector('.pagination-numbers');
            const prevBtn = element.querySelector('.prev-btn');
            const nextBtn = element.querySelector('.next-btn');
            const paginationControls = element.querySelector('.facility-pagination-controls');
            if (totalPages <= 1) { paginationControls.style.display = 'none'; return; } else { paginationControls.style.display = 'flex'; }
            const facilityFilter = data.config.facilityFilter || 'Portfolio';
            const useBrandColors = (facilityFilter === 'Brand' || facilityFilter === 'Custom');
            const brandColors = useBrandColors ? getBrandColorsForCurrentPage() : null;
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'pagination-number';
                pageBtn.textContent = i;
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                    if (brandColors && brandColors.primary) { pageBtn.style.setProperty('background-color', brandColors.primary, 'important'); pageBtn.style.setProperty('color', 'white', 'important'); pageBtn.style.setProperty('border-color', brandColors.primary, 'important'); }
                }
                pageBtn.addEventListener('click', () => { currentPage = i; renderPage(currentPage); renderPaginationControls(); scrollToTop(); });
                paginationNumbers.appendChild(pageBtn);
            }
            if (brandColors && brandColors.primary) {
                [prevBtn, nextBtn].forEach(btn => {
                    btn.style.setProperty('background-color', brandColors.primary, 'important');
                    btn.style.setProperty('border-color', brandColors.primary, 'important');
                    btn.style.setProperty('color', 'white', 'important');
                    btn.setAttribute('data-brand-primary', brandColors.primary);
                    btn.setAttribute('data-brand-cta', brandColors.cta);
                });
            }
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
        }

        function attachPaginationListeners() {
            const prevBtn = element.querySelector('.prev-btn');
            const nextBtn = element.querySelector('.next-btn');
            prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); renderPaginationControls(); scrollToTop(); } });
            nextBtn.addEventListener('click', () => { const totalPages = Math.ceil(filteredColumns.length / facilitiesPerPage); if (currentPage < totalPages) { currentPage++; renderPage(currentPage); renderPaginationControls(); scrollToTop(); } });
            [prevBtn, nextBtn].forEach(btn => {
                btn.addEventListener('mouseenter', function () { const c = this.getAttribute('data-brand-cta'); if (c && !this.disabled) { this.style.setProperty('background-color', c, 'important'); this.style.setProperty('border-color', c, 'important'); this.style.setProperty('color', 'white', 'important'); } });
                btn.addEventListener('mouseleave', function () { const c = this.getAttribute('data-brand-primary'); if (c && !this.disabled) { this.style.setProperty('background-color', c, 'important'); this.style.setProperty('border-color', c, 'important'); this.style.setProperty('color', 'white', 'important'); } });
            });
        }

        function getCurrentPageSlug() {
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(part => part.length > 0);
            if (pathParts.length > 0) {
                const pageItemUrl = pathParts[pathParts.length - 1];
                if (pageItemUrl.includes('_')) { const urlParts = pageItemUrl.split('_'); return urlParts.slice(1).join('_'); }
                else { return pageItemUrl; }
            }
            const metaSlug = document.querySelector('meta[name="page-slug"]');
            if (metaSlug) return metaSlug.getAttribute('content');
            return null;
        }

        function getCurrentPageItemUrl() {
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(part => part.length > 0);
            if (pathParts.length > 0) return pathParts[pathParts.length - 1];
            return '';
        }

        function getNearbyFacilitiesDebugInfo(facilityInfo) {
            const facData = facilityInfo.data;
            return ['M.nearby-01', 'M.nearby-02', 'M.nearby-03'].map(f => facData[f]).filter(v => v && v.trim() !== '');
        }

        function createColumnElement(facilityInfo, index, columnData) {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'facility-column';
            const facData = facilityInfo.data;
            const isDebugMode = data.config.enableDebug || false;
            const facilityFilter = data.config.facilityFilter || 'Portfolio';
            const useBrandColors = (facilityFilter === 'Brand' || facilityFilter === 'Custom');
            let facilityUrl = facilityInfo.page_item_url || '#';
            if (data.config.urlAppend && data.config.urlAppend.trim() !== '') {
                const urlAppend = data.config.urlAppend.trim().replace(/^\/+|\/+$/g, '');
                facilityUrl = `/${urlAppend}/${facilityInfo.page_item_url}`;
            }
            const phoneButtonText = data.config.phoneButtonText && data.config.phoneButtonText.trim() !== '' ? data.config.phoneButtonText : (facData['M.fac-phone'] || 'Call Now');
            let debugInfoHTML = '';
            if (isDebugMode) {
                const nearbyFacilities = getNearbyFacilitiesDebugInfo(facilityInfo);
                const nearbyHTML = nearbyFacilities.length > 0 ? nearbyFacilities.join(', ') : 'None';
                const currentSlug = facData['M.slug'];
                const sourceField = additionalFacilitySourceMap[currentSlug];
                debugInfoHTML = `<div class="facility-debug-info"><div class="debug-item"><strong>M.slug:</strong> ${currentSlug || 'N/A'}</div><div class="debug-item"><strong>Nearby:</strong> ${nearbyHTML}</div><div class="debug-item"><strong>Additional Source:</strong> ${sourceField || 'None'}</div></div>`;
            }
            columnDiv.innerHTML = `
        <div class="facility-image-container"><img src="${facData['M.fac-img01'] || 'https://placehold.co/300x200'}" alt="${facData['M.fac-name'] || 'Facility Image'}" class="facility-image"></div>
        <div class="facility-content">
          <h3 class="facility-name">${facData['M.fac-name'] || 'Facility Name'}</h3>
          <p class="facility-address">${facData['M.fac-address'] || 'Facility Address'}</p>
          ${debugInfoHTML}
          <div class="facility-buttons">
            <a href="${facilityUrl}" class="facility-link-button">${data.config.linkButtonText || 'View Details'}</a>
            <a href="tel:${facData['M.fac-phone'] || ''}" class="facility-phone-button">${phoneButtonText}</a>
          </div>
        </div>`;
            if (useBrandColors) {
                const cp = facData['M.c-primary'] || '', cc = facData['M.c-cta'] || '', cl = facData['M.c-light'] || '', cd = facData['M.c-dark'] || '';
                if (cl) columnDiv.style.setProperty('background-color', cl, 'important');
                const fn = columnDiv.querySelector('.facility-name'); if (fn && cp) fn.style.setProperty('color', cp, 'important');
                const fi = columnDiv.querySelector('.facility-image'); if (fi && cd) fi.style.setProperty('border-color', cd, 'important');
                const lb = columnDiv.querySelector('.facility-link-button');
                if (lb && cc) {
                    lb.style.setProperty('background-color', cc, 'important'); lb.style.setProperty('border-color', cc, 'important'); lb.style.setProperty('color', 'white', 'important');
                    lb.setAttribute('data-hover-bg', cp); lb.setAttribute('data-hover-border', cp); lb.setAttribute('data-normal-bg', cc); lb.setAttribute('data-normal-border', cc);
                    lb.addEventListener('mouseenter', function () { this.style.setProperty('background-color', this.getAttribute('data-hover-bg'), 'important'); this.style.setProperty('border-color', this.getAttribute('data-hover-border'), 'important'); this.style.setProperty('color', 'white', 'important'); });
                    lb.addEventListener('mouseleave', function () { this.style.setProperty('background-color', this.getAttribute('data-normal-bg'), 'important'); this.style.setProperty('border-color', this.getAttribute('data-normal-border'), 'important'); this.style.setProperty('color', 'white', 'important'); });
                }
                const pb = columnDiv.querySelector('.facility-phone-button');
                if (pb) {
                    if (cl) pb.style.setProperty('background-color', cl, 'important');
                    if (cp) { pb.style.setProperty('border-color', cp, 'important'); pb.style.setProperty('color', cp, 'important'); }
                    if (cc) { pb.setAttribute('data-hover-bg', cc); pb.setAttribute('data-hover-border', cc); }
                    pb.setAttribute('data-normal-bg', cl || 'transparent'); pb.setAttribute('data-normal-border', cp); pb.setAttribute('data-normal-color', cp);
                    pb.addEventListener('mouseenter', function () { this.style.setProperty('background-color', this.getAttribute('data-hover-bg'), 'important'); this.style.setProperty('border-color', this.getAttribute('data-hover-border'), 'important'); this.style.setProperty('color', 'white', 'important'); });
                    pb.addEventListener('mouseleave', function () { this.style.setProperty('background-color', this.getAttribute('data-normal-bg'), 'important'); this.style.setProperty('border-color', this.getAttribute('data-normal-border'), 'important'); this.style.setProperty('color', this.getAttribute('data-normal-color'), 'important'); });
                }
                columnDiv.classList.add('use-brand-colors');
            }
            return columnDiv;
        }

        function showSampleData() {
            filteredColumns = Array.from({ length: 25 }, (_, i) => ({ slug: `sample-${i + 1}`, type: 'sample' }));
            allFacilityData = Array.from({ length: 25 }, (_, i) => ({ data: { 'M.slug': `sample-${i + 1}`, 'M.fac-name': `Sample Facility ${i + 1}`, 'M.fac-address': '123 Sample Street, Sample City, ST 12345', 'M.fac-img01': 'https://placehold.co/300x200', 'M.fac-phone': '555-123-4567' }, page_item_url: `sample-${i + 1}` }));
            facilitiesPerPage = parseInt(data.config.facilitiesPerPage) || 10;
            currentPage = 1;
            renderPage(currentPage); renderPaginationControls(); attachPaginationListeners();
        }

        function applyDynamicCSS() {
            var style = document.createElement('style');
            var css = '';
            if (data.config.gapBetweenColumns !== undefined) css += `.widget-c31e05 .facility-columns-container { gap: ${data.config.gapBetweenColumns}px !important; }`;
            if (data.config.columnPadding !== undefined) css += `.widget-c31e05 .facility-content { padding: ${data.config.columnPadding}px !important; }`;
            if (data.config.columnMargin !== undefined) css += `.widget-c31e05 .facility-column { margin: ${data.config.columnMargin}px !important; }`;
            if (data.config.columnWidth !== undefined) css += `.widget-c31e05 .facility-column { min-width: ${data.config.columnWidth}px !important; max-width: ${data.config.columnWidth}px !important; flex: 0 1 ${data.config.columnWidth}px !important; }`;
            if (data.config.columnHeight !== undefined) { const px = data.config.columnHeight * 4; css += `.widget-c31e05 .facility-columns-container.stacked-vertically .facility-column { min-height: ${px}px !important; } @media (max-width: 767px) { .widget-c31e05 .facility-column { min-height: ${px}px !important; } }`; }
            if (data.config.buttonGap !== undefined) css += `.widget-c31e05 .facility-buttons { gap: ${data.config.buttonGap}px !important; }`;
            if (data.config.buttonAlignment !== undefined) css += `.widget-c31e05 .facility-buttons { align-items: ${data.config.buttonAlignment} !important; }`;
            style.textContent = css;
            const existing = element.querySelector('.dynamic-css-style'); if (existing) existing.remove();
            style.className = 'dynamic-css-style'; element.appendChild(style);
        }

        function applyHoverEffects() {
            var style = document.createElement('style'); var css = '';
            if (data.config.enableColumnHover) css += `.widget-c31e05 .facility-column:not(.use-brand-colors):hover { transform: translateY(-5px) !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }`;
            if (data.config.enableImageHover) css += `.widget-c31e05 .facility-image:hover { transform: scale(1.05) !important; }`;
            style.textContent = css;
            const existing = element.querySelector('.hover-effects-style'); if (existing) existing.remove();
            style.className = 'hover-effects-style'; element.appendChild(style);
        }

        initFacilityWidget();
    }

    function clean(container) {
        if (container) container.innerHTML = "";
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init, clean };

})();
