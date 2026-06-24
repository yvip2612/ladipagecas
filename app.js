document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Interactive Technical Standards Grid Layout with Category Filtering
    const techGrid = document.getElementById('tech-standards-grid');
    const techViewport = document.getElementById('tech-standards-viewport');
    const btnPrev = document.getElementById('tech-slider-prev');
    const btnNext = document.getElementById('tech-slider-next');
    const catButtons = document.querySelectorAll('.tech-cat-btn');
    const techCategorySelect = document.getElementById('tech-category-select');

    let currentRange = '1-9'; // Default range
    let currentFolder = 'DoBeTong'; // Default folder

    function parseRange(rangeStr) {
        const parts = rangeStr.split('-');
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);
        const list = [];
        for (let i = start; i <= end; i++) {
            list.push(i);
        }
        return list;
    }

    function getCategoryLabel(folder) {
        const labels = {
            'DoBeTong': 'Đổ Bê Tông',
            'XayTuong': 'Xây Tường',
            'ToTuong': 'Tô Tường',
            'DienNuoc': 'Điện Nước',
            'SonTuong': 'Sơn Tường',
            'ChongTham': 'Chống Thấm',
            'CanNen': 'Cán Nền'
        };
        return labels[folder] || 'Quy Chuẩn';
    }

    // Dynamic Preload Utility
    function preloadImages(paths) {
        paths.forEach(path => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = path;
            document.head.appendChild(link);
        });
    }

    // Preload next categories to reduce delay when user interacts
    const allCategoriesList = [
        { folder: 'DoBeTong', range: '1-9' },
        { folder: 'XayTuong', range: '10-19' },
        { folder: 'ToTuong', range: '20-26' },
        { folder: 'DienNuoc', range: '47-57' },
        { folder: 'SonTuong', range: '33-37' },
        { folder: 'ChongTham', range: '38-46' },
        { folder: 'CanNen', range: '27-32' }
    ];

    function preloadCategoryImages(folder, rangeStr) {
        const activeImages = parseRange(rangeStr);
        const paths = activeImages.map(imgNum => `TieuChuanEdit/${folder}/${imgNum.png || imgNum + '.png'}`);
        preloadImages(paths);
    }

    // Pre-cache other categories right after DOM load with a slight delay
    setTimeout(() => {
        // Preload next category (XayTuong) and a few portfolio tabs images
        preloadCategoryImages('XayTuong', '10-19');
        preloadImages([
            'BoSuuTap/ĐỊA TRUNG HẢI/1.png',
            'BoSuuTap/ĐỊA TRUNG HẢI/2.png',
            'BoSuuTap/INDOCHINE 9/1.png',
            'BoSuuTap/INDOCHINE 9/2.png'
        ]);
    }, 1500);

    function renderCategoryGrid() {
        if (!techGrid) return;
        techGrid.innerHTML = '';
        const activeImages = parseRange(currentRange);
        const catLabel = getCategoryLabel(currentFolder);
        
        // Split activeImages: item 1 goes to the left container, items 2-5 go to the right container
        const leftImgNum = activeImages[0];
        const rightImgNums = activeImages.slice(1, 5); // get up to 4 items for the right grid
        
        const totalItemsCount = activeImages.length;
        const hiddenMoreCount = totalItemsCount - 5; // how many are hidden beyond the first 5

        const leftImgPath = `TieuChuanEdit/${currentFolder}/${leftImgNum}.png`;

        // Left Container (Big) HTML
        const leftSideDiv = document.createElement('div');
        leftSideDiv.className = 'tech-grid-left-side';
        leftSideDiv.innerHTML = `
            <div class="tech-grid-item-big" onclick="if(typeof openImageModal === 'function') openImageModal('${leftImgPath}', 'Quy chuẩn ${leftImgNum} - ${catLabel}')">
                <div class="tech-grid-img-wrapper" style="height: 100%; aspect-ratio: 4/5;">
                    <img src="${leftImgPath}" alt="Quy chuẩn ${leftImgNum}" loading="lazy">
                    <div class="tech-grid-hover">
                        <i data-lucide="zoom-in"></i>
                        <span>Phóng to bản vẽ</span>
                    </div>
                </div>
            </div>
        `;

        // Right Container (Small Grids) HTML
        const rightSideDiv = document.createElement('div');
        rightSideDiv.className = 'tech-grid-right-side';

        rightImgNums.forEach((imgNum, idx) => {
            const imgPath = `TieuChuanEdit/${currentFolder}/${imgNum}.png`;
            const isLastThumbnail = (idx === 3 && hiddenMoreCount > 0);
            
            const card = document.createElement('div');
            card.className = isLastThumbnail ? 'tech-grid-item overflow-overlay' : 'tech-grid-item';
            if (isLastThumbnail) {
                card.onclick = () => {
                    if (typeof openImageModal === 'function') {
                        openImageModal(imgPath, `Quy chuẩn ${imgNum} - ${catLabel} (Xem tất cả)`);
                    }
                };
            }
            
            card.innerHTML = `
                <div class="tech-grid-img-wrapper" ${!isLastThumbnail ? `onclick="if(typeof openImageModal === 'function') openImageModal('${imgPath}', 'Quy chuẩn ${imgNum} - ${catLabel}')"` : ''}>
                    <img src="${imgPath}" alt="Quy chuẩn ${imgNum}" loading="lazy">
                    ${!isLastThumbnail ? `
                    <div class="tech-grid-hover">
                        <i data-lucide="zoom-in"></i>
                    </div>` : ''}
                </div>
                ${isLastThumbnail ? `<div class="overlay-more-count">+${hiddenMoreCount + 1}</div>` : ''}
            `;
            rightSideDiv.appendChild(card);
        });

        techGrid.appendChild(leftSideDiv);
        techGrid.appendChild(rightSideDiv);

        // Preload next folder images in advance when current render is done
        const currentIndex = allCategoriesList.findIndex(c => c.folder === currentFolder);
        const nextIndex = (currentIndex + 1) % allCategoriesList.length;
        const nextCat = allCategoriesList[nextIndex];
        setTimeout(() => {
            preloadCategoryImages(nextCat.folder, nextCat.range);
        }, 500);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Set up category select change handler (Mobile)
    if (techCategorySelect) {
        techCategorySelect.addEventListener('change', (e) => {
            const selectedOpt = techCategorySelect.options[techCategorySelect.selectedIndex];
            currentFolder = e.target.value;
            currentRange = selectedOpt.getAttribute('data-range');
            
            // Sync active class on desktop buttons
            catButtons.forEach(btn => {
                if (btn.getAttribute('data-folder') === currentFolder) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            renderCategoryGrid();
        });
    }

    // Set up category button click handlers (Desktop)
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFolder = btn.getAttribute('data-folder');
            currentRange = btn.getAttribute('data-range');
            
            // Sync mobile select option
            if (techCategorySelect) {
                techCategorySelect.value = currentFolder;
            }
            
            renderCategoryGrid();
        });
    });

    // Initialize Grid
    if (techGrid) {
        renderCategoryGrid();
    }

    // 3. Portfolio Tab Switcher with Auto Switch (3 seconds)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    let activeTabIdx = 0;
    const tabSwitchInterval = 3000; // 3 seconds
    let tabAutoSwitchTimer;

    function startTabAutoSwitch() {
        tabAutoSwitchTimer = setInterval(() => {
            // Switch style tabs every 3 seconds
            activeTabIdx = (activeTabIdx + 1) % tabButtons.length;
            const nextBtn = tabButtons[activeTabIdx];
            switchTab(nextBtn);
        }, tabSwitchInterval);
    }

    function switchTab(btn) {
        const targetTab = btn.getAttribute('data-tab');

        // Toggle Nav active state
        tabButtons.forEach((b, idx) => {
            if (b === btn) {
                activeTabIdx = idx;
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Show current pane
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) {
            targetPane.classList.add('active');
            // Lazy preloading of all images in the newly selected tab
            const images = targetPane.querySelectorAll('.gallery-img');
            images.forEach(img => {
                if (img.src) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = img.src;
                    document.head.appendChild(link);
                }
            });
        }
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            switchTab(btn);
            
            // Reset the auto-switch timer when user clicks manually
            clearInterval(tabAutoSwitchTimer);
            startTabAutoSwitch();
        });
        // Preload on mouseover/hover for ultra-fast instant load
        btn.addEventListener('mouseenter', () => {
            const targetTab = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(`pane-${targetTab}`);
            if (targetPane) {
                const images = targetPane.querySelectorAll('.gallery-img');
                images.forEach(img => {
                    if (img.src) {
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.as = 'image';
                        link.href = img.src;
                        document.head.appendChild(link);
                    }
                });
            }
        }, { passive: true });
    });

    if (tabButtons.length > 0) {
        startTabAutoSwitch();
    }

    // 4. Style Quick Consult Buttons (Pre-select style and scroll down)
    const styleQuoteButtons = document.querySelectorAll('.btn-quote-style');
    const mainStyleSelect = document.getElementById('m-style');

    styleQuoteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedStyle = btn.getAttribute('data-style');
            
            // Set value in dropdown
            if (mainStyleSelect) {
                mainStyleSelect.value = selectedStyle;
            }

            // Scroll down
            const contactSection = document.getElementById('contact-form-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. Cost Estimator Calculator logic has been replaced by static image in index.html.

    const mainContactForm = document.getElementById('main-contact-form');
    const mainFormSuccess = document.getElementById('main-form-success');

    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('m-name').value;
            const phone = document.getElementById('m-phone').value;
            const location = document.getElementById('m-location').value;
            const style = document.getElementById('m-style').value;

            // Webhook CRM payloads
            const webhookPayload = {
                event: "main_consultation_request",
                timestamp: new Date().toISOString(),
                data: { name, phone, location, favorite_style: style }
            };
            console.log('Sending Webhook Data to CRM:', webhookPayload);

            mainContactForm.style.display = 'none';
            if (mainFormSuccess) mainFormSuccess.style.display = 'flex';
        });
    }

    // 7. Image Lightbox Modal logic
    const imageModal = document.getElementById('image-modal');
    const modalImgTarget = document.getElementById('modal-img-target');
    const modalCaptionTarget = document.getElementById('modal-caption-target');
    const modalCloseBtn = document.querySelector('.modal-close');

    function openImageModal(src, caption) {
        if (!imageModal || !modalImgTarget || !modalCaptionTarget) return;
        modalImgTarget.src = src;
        modalCaptionTarget.textContent = caption;
        imageModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        if (!imageModal) return;
        imageModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeImageModal);
    }
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('modal-close')) {
                closeImageModal();
            }
        });
    }

    document.querySelectorAll('.gallery-img, .image-wrapper img, .diary-img').forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.src, img.alt || 'CAS Homes & Design Project');
        });
    });





    // 9. Auto-cycle Hero Banner Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlideIdx = 0;
        const slideInterval = 5000; // Switch slide every 5 seconds

        setInterval(() => {
            // Remove active from current
            slides[currentSlideIdx].classList.remove('active');
            
            // Increment index
            currentSlideIdx = (currentSlideIdx + 1) % slides.length;
            
            // Add active to next
            slides[currentSlideIdx].classList.add('active');
        }, slideInterval);
    }

    // 9. Gallery Touch Interaction Listeners
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.carousel-inner')) {
            isTouchingGallery = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        isTouchingGallery = false;
    }, { passive: true });
});
