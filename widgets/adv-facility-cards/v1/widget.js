(function () {

    const WIDGET_ID = "adv-facility-cards";

    const WIDGET_CSS = `
.ms-facility-cards .facility-widget {
  width: 100%;
  padding: 20px 0;
}
.ms-facility-cards .facility-columns-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
}
.ms-facility-cards .facility-columns-container.stacked-horizontally {
  flex-direction: row;
}
.ms-facility-cards .facility-columns-container.stacked-vertically {
  flex-direction: column;
  align-items: center;
}
.ms-facility-cards .facility-columns-container.wrap-enabled {
  flex-wrap: wrap;
  justify-content: center;
}
.ms-facility-cards .facility-columns-container.wrap-disabled {
  flex-wrap: nowrap;
  justify-content: center;
}
.ms-facility-cards .facility-column {
  min-width: 250px;
  max-width: 350px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
.ms-facility-cards .facility-columns-container.wrap-enabled .facility-column {
  flex: 0 0 auto;
}
.ms-facility-cards .facility-columns-container.wrap-disabled .facility-column {
  flex: 0 1 auto;
}
.ms-facility-cards .facility-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.ms-facility-cards .facility-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.ms-facility-cards .facility-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  text-align: center;
}
.ms-facility-cards .facility-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  text-align: center;
}
.ms-facility-cards .facility-address {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.4;
  flex-grow: 1;
  text-align: center;
}
.ms-facility-cards .facility-debug-info {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0 15px 0;
  font-size: 0.85rem;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}
.ms-facility-cards .facility-debug-info .debug-item {
  margin: 5px 0;
  color: #495057;
  word-break: break-word;
}
.ms-facility-cards .facility-debug-info .debug-item strong {
  color: #212529;
  font-weight: 600;
}
.ms-facility-cards .facility-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  width: 100%;
  align-items: center;
}
.ms-facility-cards .facility-link-button,
.ms-facility-cards .facility-phone-button {
  display: inline-block;
  padding: 12px 20px;
  text-decoration: none !important;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
}
.ms-facility-cards .facility-link-button {
  background-color: #007cba;
  color: white !important;
  border: 2px solid #007cba;
}
.ms-facility-cards .facility-link-button:hover {
  background-color: #005a87;
  border-color: #005a87;
}
.ms-facility-cards .facility-phone-button {
  background-color: transparent;
  color: #007cba !important;
  border: 2px solid #007cba;
}
.ms-facility-cards .facility-phone-button:hover {
  background-color: #007cba;
  color: white !important;
}
.ms-facility-cards .no-facilities-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 1.1rem;
  width: 100%;
}
.ms-facility-cards .facility-pagination-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px 0;
}
.ms-facility-cards .pagination-btn {
  padding: 10px 20px;
  background-color: #555555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}
.ms-facility-cards .pagination-btn:hover:not(:disabled) {
  background-color: #333333;
}
.ms-facility-cards .pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}
.ms-facility-cards .pagination-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}
.ms-facility-cards .pagination-number {
  padding: 8px 12px;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.ms-facility-cards .pagination-number:hover {
  background-color: #e0e0e0;
}
.ms-facility-cards .pagination-number.active {
  background-color: #555555;
  color: white;
  border-color: #555555;
  font-weight: 600;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .ms-facility-cards .facility-column {
    min-width: 200px;
  }
}
@media (max-width: 767px) {
  .ms-facility-cards .facility-columns-container {
    flex-direction: column !important;
    gap: 15px !important;
    justify-content: flex-start !important;
    align-items: center !important;
  }
  .ms-facility-cards .facility-column {
    min-width: 100%;
    max-width: 100%;
    flex: 1 1 auto !important;
  }
  .ms-facility-cards .facility-content {
    padding: 15px;
  }
  .ms-facility-cards .facility-buttons {
    flex-direction: column;
  }
  .ms-facility-cards .facility-pagination-controls {
    gap: 8px;
  }
  .ms-facility-cards .pagination-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  .ms-facility-cards .pagination-number {
    padding: 6px 10px;
    font-size: 0.85rem;
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

        // Add scoping class to blank container div (HTML tab: <div id="ms-widget-root"></div>)
        container.classList.add('ms-facility-cards');

        // Compute layout classes from config (replaces Duda Handlebars template conditionals)
        const stackingClass = data.config.stackingDirection === 'column' ? 'stacked-vertically' : 'stacked-horizontally';
        const wrapClass = data.config.wrapColumns ? 'wrap-enabled' : 'wrap-disabled';

        container.innerHTML = `
<div class="facility-widget">
  <div class="facility-columns-container ${stackingClass} ${wrapClass}">
    <!-- Columns generated by JavaScript -->
  </div>
  <div class="facility-pagination-controls">
    <button class="pagination-btn prev-btn" disabled>Previous</button>
    <div class="pagination-numbers"></div>
    <button class="pagination-btn next-btn">Next</button>
  </div>
</div>`;

        // ── Shared widget state ───────────────────────────────────────────
        let allFacilityData = [];
        let currentPage = 1;
        let facilitiesPerPage = 10;
        let filteredColumns = [];
        let additionalFacilitySourceMap = {};

        // ── Helpers ───────────────────────────────────────────────────────

        function normalizeForComparison(value) {
            if (!value) return '';
            return value.toString().toLowerCase().trim().replace(/-/g, ' ').replace(/\s+/g, ' ');
        }

        function getCurrentPageItemUrl() {
            const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
            return pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
        }

        function getCurrentPageSlug() {
            const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
            if (pathParts.length === 0) return null;
            const pageItemUrl = pathParts[pathParts.length - 1];
            if (pageItemUrl.includes('_')) {
                return pageItemUrl.split('_').slice(1).join('_');
            }
            return pageItemUrl;
        }

        function getCurrentPageFacility() {
            const urlSegment = getCurrentPageItemUrl();
            if (!urlSegment) return null;

            let f = allFacilityData.find(i => i.page_item_url === urlSegment);
            if (!f) f = allFacilityData.find(i => {
                const slug = i.data['M.slug'];
                return slug && normalizeForComparison(slug) === normalizeForComparison(urlSegment);
            });
            if (!f) f = allFacilityData.find(i => {
                const pid = i.page_item_url;
                if (!pid) return false;
                const np = normalizeForComparison(pid);
                const nu = normalizeForComparison(urlSegment);
                return np.includes(nu) || nu.includes(np);
            });
            return f || null;
        }

        function scrollToTop() {
            const widgetTop = container.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: widgetTop - 120, behavior: 'smooth' });
        }

        // ── Data fetching ─────────────────────────────────────────────────

        async function fetchAllFacilities(collection, collectionName) {
            const allData = [];
            let pageNum = 0;
            let hasMoreData = true;
            while (hasMoreData) {
                const response = await collection
                    .data(collectionName)
                    .pageSize(100)
                    .pageNumber(pageNum)
                    .get();
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

        function extractAdditionalSlugs(additionalCollectionData, facilityFilter, currentFacility) {
            const slugsToAdd = [];
            let matchField = '';
            let matchValue = '';

            if (facilityFilter === 'City') { matchField = 'M.city'; matchValue = currentFacility.data['M.city']; }
            else if (facilityFilter === 'State') { matchField = 'M.state'; matchValue = currentFacility.data['M.state']; }
            else { return slugsToAdd; }

            if (!matchValue || matchValue.trim() === '') return slugsToAdd;

            const normalizedMatch = normalizeForComparison(matchValue);
            const matchingRows = additionalCollectionData.filter(item => {
                const v = item.data[matchField];
                return v && normalizeForComparison(v) === normalizedMatch;
            });

            const fieldsToCheck = [
                'M.add-fac-01', 'M.add-fac-02', 'M.add-fac-03', 'M.add-fac-04', 'M.add-fac-05',
                'M.add-fac-06', 'M.add-fac-07', 'M.add-fac-08', 'M.add-fac-09', 'M.add-fac-10'
            ];

            matchingRows.forEach(item => {
                fieldsToCheck.forEach(field => {
                    const slugValue = item.data[field];
                    if (slugValue && slugValue.trim() !== '') {
                        const trimmedSlug = slugValue.trim();
                        const exists = allFacilityData.find(f => {
                            const s = f.data['M.slug'];
                            return s && normalizeForComparison(s) === normalizeForComparison(trimmedSlug);
                        });
                        if (exists && !additionalFacilitySourceMap[trimmedSlug]) {
                            slugsToAdd.push(trimmedSlug);
                            additionalFacilitySourceMap[trimmedSlug] = field;
                        }
                    }
                });
            });

            return slugsToAdd;
        }

        // ── Filter processing ─────────────────────────────────────────────

        function processFilteredColumns(facilityData, facilityFilter, customGroupings, stateCity, additionalSlugs = []) {
            let columnsToCreate = [];
            const normalizedFilter = normalizeForComparison(stateCity);

            if (facilityFilter === 'Portfolio') {
                const uniqueSlugs = [...new Set(facilityData.map(i => i.data['M.slug']).filter(Boolean))];
                columnsToCreate = uniqueSlugs.map(slug => ({ slug, type: 'portfolio' }));
            }
            else if (facilityFilter === 'State') {
                const uniq = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], state = item.data['M.state'];
                    if (slug && state && (!normalizedFilter || normalizeForComparison(state) === normalizedFilter)) {
                        uniq.add(`${slug}|${state}`);
                    }
                });
                columnsToCreate = [...uniq].map(c => { const [slug, state] = c.split('|'); return { slug, state, type: 'state' }; });
            }
            else if (facilityFilter === 'City') {
                const uniq = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], city = item.data['M.city'];
                    if (slug && city && (!normalizedFilter || normalizeForComparison(city) === normalizedFilter)) {
                        uniq.add(`${slug}|${city}`);
                    }
                });
                columnsToCreate = [...uniq].map(c => { const [slug, city] = c.split('|'); return { slug, city, type: 'city' }; });
            }
            else if (facilityFilter === 'Brand') {
                const uniq = new Set();
                facilityData.forEach(item => {
                    const slug = item.data['M.slug'], brand = item.data['M.fac-brand'], pageItemUrl = item.page_item_url;
                    if (!slug) return;
                    let include = false;
                    if (!normalizedFilter) { include = true; }
                    else {
                        if (brand) {
                            const nb = normalizeForComparison(brand);
                            if (nb === normalizedFilter || nb.includes(normalizedFilter) || normalizedFilter.includes(nb)) include = true;
                        }
                        if (!include && pageItemUrl) {
                            const np = normalizeForComparison(pageItemUrl);
                            if (np.includes(normalizedFilter) || normalizedFilter.includes(np)) include = true;
                        }
                    }
                    if (include && brand) uniq.add(`${slug}|${brand}`);
                });
                columnsToCreate = [...uniq].map(c => { const [slug, brand] = c.split('|'); return { slug, brand, type: 'brand' }; });
            }
            else if (facilityFilter === 'Custom') {
                customGroupings.forEach(g => {
                    if (g.customSlug && g.customSlug.trim() !== '') {
                        columnsToCreate.push({ slug: g.customSlug.trim(), type: 'custom' });
                    }
                });
            }
            else if (facilityFilter === 'Nearby') {
                const currentSlug = getCurrentPageSlug();
                if (currentSlug) {
                    const cf = facilityData.find(i => i.data['M.slug'] === currentSlug);
                    if (cf) {
                        ['M.nearby-01', 'M.nearby-02', 'M.nearby-03'].forEach(field => {
                            const ns = cf.data[field];
                            if (ns && ns.trim() !== '') columnsToCreate.push({ slug: ns.trim(), type: 'nearby' });
                        });
                    }
                }
                customGroupings.forEach(g => {
                    if (g.customSlug && g.customSlug.trim() !== '') {
                        columnsToCreate.push({ slug: g.customSlug.trim(), type: 'custom' });
                    }
                });
            }

            // Custom groupings appended for State/City/Brand
            if (['State', 'City', 'Brand'].includes(facilityFilter) && customGroupings.length > 0) {
                customGroupings.forEach(g => {
                    if (g.customSlug && g.customSlug.trim() !== '') {
                        columnsToCreate.push({ slug: g.customSlug.trim(), type: 'custom' });
                    }
                });
            }

            // Additional collection slugs appended for City/State
            additionalSlugs.forEach(slug => columnsToCreate.push({ slug, type: 'additional-collection' }));

            return columnsToCreate;
        }

        // ── Rendering ─────────────────────────────────────────────────────

        function getNearbyFacilitiesDebugInfo(facilityInfo) {
            return ['M.nearby-01', 'M.nearby-02', 'M.nearby-03']
                .map(f => facilityInfo.data[f])
                .filter(v => v && v.trim() !== '');
        }

        function createColumnElement(facilityInfo, index, columnData) {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'facility-column';

            const facData = facilityInfo.data;
            const isDebugMode = data.config.enableDebug || false;
            const facilityFilter = data.config.facilityFilter || 'Portfolio';
            const useBrandColors = (facilityFilter === 'Brand' || facilityFilter === 'Custom');

            // Build URL
            let facilityUrl = facilityInfo.page_item_url || '#';
            if (data.config.urlAppend && data.config.urlAppend.trim() !== '') {
                const urlAppend = data.config.urlAppend.trim().replace(/^\/+|\/+$/g, '');
                facilityUrl = `/${urlAppend}/${facilityInfo.page_item_url}`;
            }

            const phoneButtonText = data.config.phoneButtonText && data.config.phoneButtonText.trim() !== ''
                ? data.config.phoneButtonText
                : (facData['M.fac-phone'] || 'Call Now');

            let debugInfoHTML = '';
            if (isDebugMode) {
                const nearby = getNearbyFacilitiesDebugInfo(facilityInfo);
                const currentSlug = facData['M.slug'];
                const sourceField = additionalFacilitySourceMap[currentSlug];
                debugInfoHTML = `
                    <div class="facility-debug-info">
                        <div class="debug-item"><strong>M.slug:</strong> ${currentSlug || 'N/A'}</div>
                        <div class="debug-item"><strong>Nearby:</strong> ${nearby.length > 0 ? nearby.join(', ') : 'None'}</div>
                        <div class="debug-item"><strong>Additional Source:</strong> ${sourceField || 'None'}</div>
                    </div>`;
            }

            columnDiv.innerHTML = `
                <div class="facility-image-container">
                    <img src="${facData['M.fac-img01'] || 'https://placehold.co/300x200'}"
                         alt="${facData['M.fac-name'] || 'Facility Image'}"
                         class="facility-image">
                </div>
                <div class="facility-content">
                    <h3 class="facility-name">${facData['M.fac-name'] || 'Facility Name'}</h3>
                    <p class="facility-address">${facData['M.fac-address'] || 'Facility Address'}</p>
                    ${debugInfoHTML}
                    <div class="facility-buttons">
                        <a href="${facilityUrl}" class="facility-link-button">
                            ${data.config.linkButtonText || 'View Details'}
                        </a>
                        <a href="tel:${facData['M.fac-phone'] || ''}" class="facility-phone-button">
                            ${phoneButtonText}
                        </a>
                    </div>
                </div>`;

            if (useBrandColors) {
                const cp = facData['M.c-primary'] || '';
                const cc = facData['M.c-cta'] || '';
                const cl = facData['M.c-light'] || '';
                const cd = facData['M.c-dark'] || '';

                if (cl) columnDiv.style.setProperty('background-color', cl, 'important');

                const nameEl = columnDiv.querySelector('.facility-name');
                if (nameEl && cp) nameEl.style.setProperty('color', cp, 'important');

                const imgEl = columnDiv.querySelector('.facility-image');
                if (imgEl && cd) imgEl.style.setProperty('border-color', cd, 'important');

                const linkBtn = columnDiv.querySelector('.facility-link-button');
                if (linkBtn && cc) {
                    linkBtn.style.setProperty('background-color', cc, 'important');
                    linkBtn.style.setProperty('border-color', cc, 'important');
                    linkBtn.style.setProperty('color', 'white', 'important');
                    linkBtn.setAttribute('data-hover-bg', cp);
                    linkBtn.setAttribute('data-hover-border', cp);
                    linkBtn.setAttribute('data-normal-bg', cc);
                    linkBtn.setAttribute('data-normal-border', cc);
                    linkBtn.addEventListener('mouseenter', function () {
                        this.style.setProperty('background-color', this.getAttribute('data-hover-bg'), 'important');
                        this.style.setProperty('border-color', this.getAttribute('data-hover-border'), 'important');
                        this.style.setProperty('color', 'white', 'important');
                    });
                    linkBtn.addEventListener('mouseleave', function () {
                        this.style.setProperty('background-color', this.getAttribute('data-normal-bg'), 'important');
                        this.style.setProperty('border-color', this.getAttribute('data-normal-border'), 'important');
                        this.style.setProperty('color', 'white', 'important');
                    });
                }

                const phoneBtn = columnDiv.querySelector('.facility-phone-button');
                if (phoneBtn) {
                    if (cl) phoneBtn.style.setProperty('background-color', cl, 'important');
                    if (cp) {
                        phoneBtn.style.setProperty('border-color', cp, 'important');
                        phoneBtn.style.setProperty('color', cp, 'important');
                    }
                    if (cc) {
                        phoneBtn.setAttribute('data-hover-bg', cc);
                        phoneBtn.setAttribute('data-hover-border', cc);
                    }
                    phoneBtn.setAttribute('data-normal-bg', cl || 'transparent');
                    phoneBtn.setAttribute('data-normal-border', cp);
                    phoneBtn.setAttribute('data-normal-color', cp);
                    phoneBtn.addEventListener('mouseenter', function () {
                        this.style.setProperty('background-color', this.getAttribute('data-hover-bg'), 'important');
                        this.style.setProperty('border-color', this.getAttribute('data-hover-border'), 'important');
                        this.style.setProperty('color', 'white', 'important');
                    });
                    phoneBtn.addEventListener('mouseleave', function () {
                        this.style.setProperty('background-color', this.getAttribute('data-normal-bg'), 'important');
                        this.style.setProperty('border-color', this.getAttribute('data-normal-border'), 'important');
                        this.style.setProperty('color', this.getAttribute('data-normal-color'), 'important');
                    });
                }

                columnDiv.classList.add('use-brand-colors');
            }

            return columnDiv;
        }

        function renderPage(pageNumber) {
            const c = container.querySelector('.facility-columns-container');
            c.innerHTML = '';
            const start = (pageNumber - 1) * facilitiesPerPage;
            const end = Math.min(start + facilitiesPerPage, filteredColumns.length);
            const page = filteredColumns.slice(start, end);

            page.forEach((column, index) => {
                const info = allFacilityData.find(i => {
                    const s = i.data['M.slug'];
                    return s && normalizeForComparison(s) === normalizeForComparison(column.slug);
                });
                if (info) c.appendChild(createColumnElement(info, index, column));
            });

            if (page.length === 0) {
                c.innerHTML = '<p class="no-facilities-message">No facilities found matching your criteria.</p>';
            }
        }

        function getBrandColorsForCurrentPage() {
            const start = (currentPage - 1) * facilitiesPerPage;
            const first = filteredColumns[start];
            if (first) {
                const info = allFacilityData.find(i => i.data['M.slug'] === first.slug);
                if (info) return {
                    primary: info.data['M.c-primary'] || '',
                    cta: info.data['M.c-cta'] || '',
                    light: info.data['M.c-light'] || '',
                    dark: info.data['M.c-dark'] || ''
                };
            }
            return null;
        }

        function renderPaginationControls() {
            const totalPages = Math.ceil(filteredColumns.length / facilitiesPerPage);
            const paginationNumbers = container.querySelector('.pagination-numbers');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const paginationControls = container.querySelector('.facility-pagination-controls');

            if (totalPages <= 1) { paginationControls.style.display = 'none'; return; }
            paginationControls.style.display = 'flex';

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
                    if (brandColors && brandColors.primary) {
                        pageBtn.style.setProperty('background-color', brandColors.primary, 'important');
                        pageBtn.style.setProperty('color', 'white', 'important');
                        pageBtn.style.setProperty('border-color', brandColors.primary, 'important');
                    }
                }
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    renderPage(currentPage);
                    renderPaginationControls();
                    scrollToTop();
                });
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
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');

            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) { currentPage--; renderPage(currentPage); renderPaginationControls(); scrollToTop(); }
            });
            nextBtn.addEventListener('click', () => {
                const total = Math.ceil(filteredColumns.length / facilitiesPerPage);
                if (currentPage < total) { currentPage++; renderPage(currentPage); renderPaginationControls(); scrollToTop(); }
            });

            [prevBtn, nextBtn].forEach(btn => {
                btn.addEventListener('mouseenter', function () {
                    const cta = this.getAttribute('data-brand-cta');
                    if (cta && !this.disabled) {
                        this.style.setProperty('background-color', cta, 'important');
                        this.style.setProperty('border-color', cta, 'important');
                        this.style.setProperty('color', 'white', 'important');
                    }
                });
                btn.addEventListener('mouseleave', function () {
                    const primary = this.getAttribute('data-brand-primary');
                    if (primary && !this.disabled) {
                        this.style.setProperty('background-color', primary, 'important');
                        this.style.setProperty('border-color', primary, 'important');
                        this.style.setProperty('color', 'white', 'important');
                    }
                });
            });
        }

        function applyDynamicCSS() {
            let css = '';
            const c = data.config;

            if (c.gapBetweenColumns !== undefined)
                css += `.ms-facility-cards .facility-columns-container { gap: ${c.gapBetweenColumns}px !important; }`;
            if (c.columnPadding !== undefined)
                css += `.ms-facility-cards .facility-content { padding: ${c.columnPadding}px !important; }`;
            if (c.columnMargin !== undefined)
                css += `.ms-facility-cards .facility-column { margin: ${c.columnMargin}px !important; }`;
            if (c.columnWidth !== undefined)
                css += `.ms-facility-cards .facility-column { min-width: ${c.columnWidth}px !important; max-width: ${c.columnWidth}px !important; flex: 0 1 ${c.columnWidth}px !important; }`;
            if (c.columnHeight !== undefined) {
                const h = c.columnHeight * 4;
                css += `.ms-facility-cards .facility-columns-container.stacked-vertically .facility-column { min-height: ${h}px !important; }`;
                css += `@media (max-width: 767px) { .ms-facility-cards .facility-column { min-height: ${h}px !important; } }`;
            }
            if (c.buttonGap !== undefined)
                css += `.ms-facility-cards .facility-buttons { gap: ${c.buttonGap}px !important; }`;
            if (c.buttonAlignment !== undefined)
                css += `.ms-facility-cards .facility-buttons { align-items: ${c.buttonAlignment} !important; }`;

            const existing = container.querySelector('.dynamic-css-style');
            if (existing) existing.remove();
            const style = document.createElement('style');
            style.className = 'dynamic-css-style';
            style.textContent = css;
            container.appendChild(style);
        }

        function applyHoverEffects() {
            let css = '';
            if (data.config.enableColumnHover)
                css += `.ms-facility-cards .facility-column:not(.use-brand-colors):hover { transform: translateY(-5px) !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }`;
            if (data.config.enableImageHover)
                css += `.ms-facility-cards .facility-image:hover { transform: scale(1.05) !important; }`;

            const existing = container.querySelector('.hover-effects-style');
            if (existing) existing.remove();
            const style = document.createElement('style');
            style.className = 'hover-effects-style';
            style.textContent = css;
            container.appendChild(style);
        }

        function showSampleData() {
            filteredColumns = Array.from({ length: 25 }, (_, i) => ({ slug: `sample-${i + 1}`, type: 'sample' }));
            allFacilityData = Array.from({ length: 25 }, (_, i) => ({
                data: {
                    'M.slug': `sample-${i + 1}`,
                    'M.fac-name': `Sample Facility ${i + 1}`,
                    'M.fac-address': '123 Sample Street, Sample City, ST 12345',
                    'M.fac-img01': 'https://placehold.co/300x200',
                    'M.fac-phone': '555-123-4567',
                    'M.nearby-01': 'sample-nearby-1',
                    'M.nearby-02': 'sample-nearby-2',
                    'M.nearby-03': ''
                },
                page_item_url: `sample-${i + 1}`
            }));
            facilitiesPerPage = parseInt(data.config.facilitiesPerPage) || 10;
            currentPage = 1;
            renderPage(currentPage);
            renderPaginationControls();
            attachPaginationListeners();
        }

        // ── Main init ─────────────────────────────────────────────────────

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
                    if (['State', 'City', 'Brand'].includes(facilityFilter)) {
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

        initFacilityWidget();
    }

    function clean(container) {
        if (container) container.innerHTML = '';
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init: init, clean: clean };

})();
