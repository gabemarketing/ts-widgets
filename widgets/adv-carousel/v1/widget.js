(function () {

    const WIDGET_ID = 'adv-carousel';

    const WIDGET_CSS = `
.ms-img-carousel {
  width: 100%;
  height: 100%;
}

.ms-img-carousel .carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ms-img-carousel .carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.ms-img-carousel .carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  box-sizing: border-box;
}

.ms-img-carousel .carousel-image.active {
  opacity: 1;
}

/* ── Navigation controls ─────────────────────────────────── */

.ms-img-carousel .carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: background 0.2s ease, opacity 0.2s ease;
  padding: 0;
}

.ms-img-carousel .carousel-control:hover {
  background: rgba(255, 255, 255, 0.45);
}

.ms-img-carousel .carousel-control:active {
  background: rgba(255, 255, 255, 0.6);
}

.ms-img-carousel .carousel-prev {
  left: 10px;
}

.ms-img-carousel .carousel-next {
  right: 10px;
}

.ms-img-carousel .error-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}
`;

    const PREV_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.4))"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const NEXT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.4))"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

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

        var collectionName = config.collectionName || '';
        var rotationSpeed = (parseInt(config.rotationSpeed) || 5) * 1000;
        var displayMode = config.displayMode || 'cover';
        var imagePosition = config.imagePosition || 'center center';
        var selectionMode = config.selectionMode || 'current';
        var specificSlug = config.specificSlug || '';
        var displayControls = config.displayControls === true || config.displayControls === 'true';
        var controlPosition = (config.controlPosition || 'middle').toLowerCase();

        container.classList.add('ms-img-carousel');

        container.innerHTML = `
<div class="carousel-wrapper">
  <div class="carousel-track"></div>
  ${displayControls ? `
  <button class="carousel-control carousel-prev" aria-label="Previous image" type="button">${PREV_ICON}</button>
  <button class="carousel-control carousel-next" aria-label="Next image" type="button">${NEXT_ICON}</button>` : ''}
</div>`;

        const carouselTrack = container.querySelector('.carousel-track');

        if (!collectionName) {
            carouselTrack.innerHTML = '<p class="error-message">Please configure the collection name in widget settings.</p>';
            return;
        }

        function getCurrentPageSlug() {
            const segments = window.location.pathname.split('/').filter(s => s.length > 0);
            return segments[segments.length - 1] || '';
        }

        try {
            const collection = await dmAPI.loadCollectionsAPI();
            let item;

            if (selectionMode === 'current') {
                const slug = getCurrentPageSlug();
                const result = await collection.data(collectionName).where('M.slug', 'EQ', slug).get();
                if (!result.values || result.values.length === 0) {
                    carouselTrack.innerHTML = `<p class="error-message">No record found for page "${slug}"</p>`;
                    return;
                }
                item = result.values[0].data;

            } else if (selectionMode === 'specific') {
                if (!specificSlug) {
                    carouselTrack.innerHTML = '<p class="error-message">Please enter a specific slug in widget settings.</p>';
                    return;
                }
                const result = await collection.data(collectionName).where('M.slug', 'EQ', specificSlug).get();
                if (!result.values || result.values.length === 0) {
                    carouselTrack.innerHTML = `<p class="error-message">No record found for slug "${specificSlug}"</p>`;
                    return;
                }
                item = result.values[0].data;

            } else {
                const result = await collection.data(collectionName).pageSize(1).get();
                if (!result.values || result.values.length === 0) {
                    carouselTrack.innerHTML = '<p class="error-message">No data found in collection.</p>';
                    return;
                }
                item = result.values[0].data;
            }

            const imageFields = [
                { img: 'M.fac-img01', alt: 'M.fac-img01-alt' },
                { img: 'M.fac-img02', alt: 'M.fac-img02-alt' },
                { img: 'M.fac-img03', alt: 'M.fac-img03-alt' },
                { img: 'M.fac-img04', alt: 'M.fac-img04-alt' },
                { img: 'M.fac-img05', alt: 'M.fac-img05-alt' },
                { img: 'M.fac-img06', alt: 'M.fac-img06-alt' },
                { img: 'M.fac-img07', alt: 'M.fac-img07-alt' },
                { img: 'M.fac-img08', alt: 'M.fac-img08-alt' },
                { img: 'M.fac-img09', alt: 'M.fac-img09-alt' },
                { img: 'M.fac-img10', alt: 'M.fac-img10-alt' },
            ];

            const available = imageFields.filter(f => item[f.img]);

            if (available.length === 0) {
                carouselTrack.innerHTML = '<p class="error-message">No images found in collection record.</p>';
                return;
            }

            available.forEach((field, idx) => {
                const img = document.createElement('img');
                img.src = item[field.img];
                img.alt = item[field.alt] || '';
                img.className = 'carousel-image' + (idx === 0 ? ' active' : '');
                img.style.objectFit = displayMode === 'full' ? 'contain' : 'cover';
                img.style.objectPosition = imagePosition;
                carouselTrack.appendChild(img);
            });

            if (available.length <= 1) return;

            const images = carouselTrack.querySelectorAll('.carousel-image');
            let currentIndex = 0;
            let autoInterval = null;

            function goTo(index) {
                images[currentIndex].classList.remove('active');
                currentIndex = ((index % images.length) + images.length) % images.length;
                images[currentIndex].classList.add('active');
            }

            function goNext() { goTo(currentIndex + 1); }
            function goPrev() { goTo(currentIndex - 1); }

            function startAuto() {
                if (rotationSpeed > 0) {
                    autoInterval = setInterval(goNext, rotationSpeed);
                }
            }

            function resetAuto() {
                if (autoInterval) clearInterval(autoInterval);
                startAuto();
            }

            startAuto();

            if (displayControls) {
                const prevBtn = container.querySelector('.carousel-prev');
                const nextBtn = container.querySelector('.carousel-next');

                // Apply vertical position then reveal — prevents flash at wrong position
                [prevBtn, nextBtn].forEach(function (btn) {
                    if (!btn) return;
                    if (controlPosition === 'bottom') {
                        btn.style.top = 'auto';
                        btn.style.bottom = '16px';
                        btn.style.transform = 'none';
                    } else {
                        btn.style.top = '50%';
                        btn.style.bottom = 'auto';
                        btn.style.transform = 'translateY(-50%)';
                    }
                    btn.style.opacity = '1';
                });

                if (prevBtn) prevBtn.addEventListener('click', function () { goPrev(); resetAuto(); });
                if (nextBtn) nextBtn.addEventListener('click', function () { goNext(); resetAuto(); });
            }

        } catch (error) {
            console.error('[Dynamic Carousel] Error:', error);
            carouselTrack.innerHTML = '<p class="error-message">Error loading images from collection.</p>';
        }
    }

    window.MSWidgets = window.MSWidgets || {};
    window.MSWidgets[WIDGET_ID] = { init };

})();
