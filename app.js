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
        techGrid.className = 'gallery-mix-grid tech-grid-custom';

        const activeImages = parseRange(currentRange);
        const catLabel = getCategoryLabel(currentFolder);
        const totalItemsCount = activeImages.length;
        
        const leftImgNum = activeImages[0];
        const subgridNums = activeImages.slice(1, 5);
        const rightBottomNum = activeImages[5];
        const bottomRowNums = activeImages.slice(6, 9);
        
        const hiddenMoreCount = totalItemsCount - 9;
        const leftImgPath = `TieuChuanEdit/${currentFolder}/${leftImgNum}.png`;

        // Create Top Block
        const topBlock = document.createElement('div');
        topBlock.className = 'gallery-mix-top';

        // Left Main Image
        const leftMainDiv = document.createElement('div');
        leftMainDiv.className = 'gallery-mix-img-item gallery-mix-left-main';
        leftMainDiv.onclick = () => {
            if (typeof openImageModal === 'function') openImageModal(leftImgPath, `Quy chuẩn ${leftImgNum} - ${catLabel}`);
        };
        leftMainDiv.innerHTML = `
            <img src="${leftImgPath}" alt="Quy chuẩn ${leftImgNum}" loading="lazy">
            <div class="tech-grid-hover">
                <i data-lucide="zoom-in"></i>
                <span>Phóng to bản vẽ</span>
            </div>
        `;
        topBlock.appendChild(leftMainDiv);

        // Right Stack
        const rightStackDiv = document.createElement('div');
        rightStackDiv.className = 'gallery-mix-right-stack';

        // Subgrid (2x2)
        if (subgridNums.length > 0) {
            const subgridDiv = document.createElement('div');
            subgridDiv.className = 'gallery-mix-subgrid';
            subgridNums.forEach(imgNum => {
                const imgPath = `TieuChuanEdit/${currentFolder}/${imgNum}.png`;
                const item = document.createElement('div');
                item.className = 'gallery-mix-img-item';
                item.onclick = () => {
                    if (typeof openImageModal === 'function') openImageModal(imgPath, `Quy chuẩn ${imgNum} - ${catLabel}`);
                };
                item.innerHTML = `
                    <img src="${imgPath}" alt="Quy chuẩn ${imgNum}" loading="lazy">
                    <div class="tech-grid-hover">
                        <i data-lucide="zoom-in"></i>
                    </div>
                `;
                subgridDiv.appendChild(item);
            });
            rightStackDiv.appendChild(subgridDiv);
        }

        // Single Image Bottom
        if (rightBottomNum) {
            const imgPath = `TieuChuanEdit/${currentFolder}/${rightBottomNum}.png`;
            const item = document.createElement('div');
            item.className = 'gallery-mix-img-item';
            item.onclick = () => {
                if (typeof openImageModal === 'function') openImageModal(imgPath, `Quy chuẩn ${rightBottomNum} - ${catLabel}`);
            };
            item.innerHTML = `
                <img src="${imgPath}" alt="Quy chuẩn ${rightBottomNum}" loading="lazy">
                <div class="tech-grid-hover">
                    <i data-lucide="zoom-in"></i>
                </div>
            `;
            rightStackDiv.appendChild(item);
        }

        topBlock.appendChild(rightStackDiv);
        techGrid.appendChild(topBlock);

        // Bottom Row
        if (bottomRowNums.length > 0) {
            const bottomRowDiv = document.createElement('div');
            bottomRowDiv.className = 'gallery-mix-bottom-row';

            bottomRowNums.forEach((imgNum, idx) => {
                const imgPath = `TieuChuanEdit/${currentFolder}/${imgNum}.png`;
                const isLastItem = (idx === bottomRowNums.length - 1 && hiddenMoreCount > 0);

                const item = document.createElement('div');
                item.className = isLastItem ? 'gallery-mix-img-item overflow-overlay' : 'gallery-mix-img-item';
                item.onclick = () => {
                    if (typeof openImageModal === 'function') openImageModal(imgPath, `Quy chuẩn ${imgNum} - ${catLabel}`);
                };

                item.innerHTML = `
                    <img src="${imgPath}" alt="Quy chuẩn ${imgNum}" loading="lazy">
                    ${!isLastItem ? `
                    <div class="tech-grid-hover">
                        <i data-lucide="zoom-in"></i>
                    </div>` : ''}
                    ${isLastItem ? `<div class="overlay-more-count">+${hiddenMoreCount + 1}</div>` : ''}
                `;
                bottomRowDiv.appendChild(item);
            });

            techGrid.appendChild(bottomRowDiv);
        }

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
            const service = document.getElementById('m-service').value;
            const buildingType = document.getElementById('m-building-type').value;
            const projectType = document.getElementById('m-project-type').value;

            // Webhook CRM payloads
            const webhookPayload = {
                event: "main_consultation_request",
                timestamp: new Date().toISOString(),
                data: { 
                    name, 
                    phone, 
                    service, 
                    building_type: buildingType || "Không cung cấp", 
                    project_type: projectType || "Không cung cấp" 
                }
            };
            console.log('Sending Webhook Data to CRM:', webhookPayload);

            mainContactForm.style.display = 'none';
            if (mainFormSuccess) mainFormSuccess.style.display = 'flex';
        });
    }

    // 7. Define full image lists for each tab/gallery category to support browsing all images in modal
    const modernImages = [
        'BoSuuTap/BIỆT THỰ 20/2.png', 'BoSuuTap/BIỆT THỰ 20/3.png', 'BoSuuTap/BIỆT THỰ 20/4.png', 'BoSuuTap/BIỆT THỰ 20/5.png',
        'BoSuuTap/BIỆT THỰ 20/6.png', 'BoSuuTap/BIỆT THỰ 20/1.2.png', 'BoSuuTap/BIỆT THỰ 20/7.png', 'BoSuuTap/BIỆT THỰ 20/8.png',
        'BoSuuTap/BIỆT THỰ 20/9.png', 'BoSuuTap/BIỆT THỰ 20/10.png', 'BoSuuTap/BIỆT THỰ 20/11.png', 'BoSuuTap/BIỆT THỰ 20/12.png',
        'BoSuuTap/BIỆT THỰ 20/13.png', 'BoSuuTap/BIỆT THỰ 20/14.png', 'BoSuuTap/BIỆT THỰ 20/15.png', 'BoSuuTap/BIỆT THỰ 20/16.png',
        'BoSuuTap/BIỆT THỰ 20/17.png', 'BoSuuTap/BIỆT THỰ 20/18.png', 'BoSuuTap/BIỆT THỰ 20/19.png', 'BoSuuTap/BIỆT THỰ 20/20.png',
        'BoSuuTap/BIỆT THỰ 20/21.png', 'BoSuuTap/BIỆT THỰ 20/22.png', 'BoSuuTap/BIỆT THỰ 20/23.png', 'BoSuuTap/BIỆT THỰ 20/24.png',
        'BoSuuTap/BIỆT THỰ 20/25.png', 'BoSuuTap/BIỆT THỰ 20/26.png', 'BoSuuTap/BIỆT THỰ 20/27.png', 'BoSuuTap/BIỆT THỰ 20/28.png',
        'BoSuuTap/BIỆT THỰ 20/29.png', 'BoSuuTap/BIỆT THỰ 20/30.png', 'BoSuuTap/BIỆT THỰ 20/31.png', 'BoSuuTap/BIỆT THỰ 20/32.png',
        'BoSuuTap/BIỆT THỰ 20/33.png', 'BoSuuTap/BIỆT THỰ 20/34.png', 'BoSuuTap/BIỆT THỰ 20/35.png', 'BoSuuTap/BIỆT THỰ 20/36.png',
        'BoSuuTap/BIỆT THỰ 20/37.png', 'BoSuuTap/BIỆT THỰ 20/38.png', 'BoSuuTap/BIỆT THỰ 20/39.png', 'BoSuuTap/BIỆT THỰ 20/40.png',
        'BoSuuTap/BIỆT THỰ 20/41.png', 'BoSuuTap/BIỆT THỰ 20/42.png', 'BoSuuTap/BIỆT THỰ 20/43.png', 'BoSuuTap/BIỆT THỰ 20/44.png',
        'BoSuuTap/BIỆT THỰ 20/45.png'
    ];

    const classicImages = [
        'BoSuuTap/ĐỊA TRUNG HẢI/1.png', 'BoSuuTap/ĐỊA TRUNG HẢI/2.png', 'BoSuuTap/ĐỊA TRUNG HẢI/3.png',
        'BoSuuTap/ĐỊA TRUNG HẢI/4.png', 'BoSuuTap/ĐỊA TRUNG HẢI/5.png', 'BoSuuTap/ĐỊA TRUNG HẢI/6.png',
        'BoSuuTap/ĐỊA TRUNG HẢI/7.png', 'BoSuuTap/ĐỊA TRUNG HẢI/8.png', 'BoSuuTap/ĐỊA TRUNG HẢI/9.png'
    ];

    const indochineImages = [
        'BoSuuTap/INDOCHINE 9/1.png', 'BoSuuTap/INDOCHINE 9/2.png', 'BoSuuTap/INDOCHINE 9/3.png', 'BoSuuTap/INDOCHINE 9/4.png',
        'BoSuuTap/INDOCHINE 9/5.png', 'BoSuuTap/INDOCHINE 9/6.png', 'BoSuuTap/INDOCHINE 9/7.png', 'BoSuuTap/INDOCHINE 9/8.png',
        'BoSuuTap/INDOCHINE 9/9.png', 'BoSuuTap/INDOCHINE 9/10.png', 'BoSuuTap/INDOCHINE 9/11.png', 'BoSuuTap/INDOCHINE 9/12.png',
        'BoSuuTap/INDOCHINE 9/13.png', 'BoSuuTap/INDOCHINE 9/14.png', 'BoSuuTap/INDOCHINE 9/15.png', 'BoSuuTap/INDOCHINE 9/16.png',
        'BoSuuTap/INDOCHINE 9/17.png', 'BoSuuTap/INDOCHINE 9/18.png', 'BoSuuTap/INDOCHINE 9/19.png', 'BoSuuTap/INDOCHINE 9/20.png',
        'BoSuuTap/INDOCHINE 9/21.png', 'BoSuuTap/INDOCHINE 9/22.png', 'BoSuuTap/INDOCHINE 9/23.png', 'BoSuuTap/INDOCHINE 9/24.png',
        'BoSuuTap/INDOCHINE 9/25.png', 'BoSuuTap/INDOCHINE 9/26.png', 'BoSuuTap/INDOCHINE 9/27.png', 'BoSuuTap/INDOCHINE 9/28.png',
        'BoSuuTap/INDOCHINE 9/29.png', 'BoSuuTap/INDOCHINE 9/30.png', 'BoSuuTap/INDOCHINE 9/31.png', 'BoSuuTap/INDOCHINE 9/32.png',
        'BoSuuTap/INDOCHINE 9/33.png', 'BoSuuTap/INDOCHINE 9/34.png', 'BoSuuTap/INDOCHINE 9/35.png'
    ];

    const diaryImages = [
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445480851_c73fd547e7e3c8c2ba1420c16c15a6cb.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445493253_4cb1433d62fe79d37ff06d6df02b49e9.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445500078_b175ff5e4913da3503c10d5a70c9064d.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445514868_44d643305fad884bcca84c910cfbcccf.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445520293_1a94e9eee262e09d0d2f2e0c17b73381.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445526801_deb73374f2801fb92c54549215714134.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445532650_b2b8d81285a14d2746eaa773eceb1951.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7950445539537_5a61bfc069b96dcd69cdbde2285a19b1.jpg',
        'NhatKyCongTrinh/Công Trình Chị Hương/z7954219043783_bd34d812898a6e398a861e5e1d6ded66.jpg'
    ];

    // 7.5. Gallery Slider Layout logic
    // Deprecated slider controls removed as the gallery is now a static grid layout

    // 8. Image Lightbox Modal logic with Slideshow Slider Navigation
    const imageModal = document.getElementById('image-modal');
    const modalImgTarget = document.getElementById('modal-img-target');
    const modalCaptionTarget = document.getElementById('modal-caption-target');
    const modalCloseBtn = document.querySelector('.modal-close');
    const prevArrow = document.getElementById('modal-prev-arrow');
    const nextArrow = document.getElementById('modal-next-arrow');

    let currentModalImageList = [];
    let currentModalImageIndex = 0;
    let currentModalCaptionList = [];

    function openImageModal(imgList, startIndex, captionList = []) {
        if (!imageModal || !modalImgTarget || !modalCaptionTarget) return;

        // Auto-resolve string parameters from inline HTML calls
        if (typeof imgList === 'string') {
            const srcStr = imgList;
            const captionStr = startIndex || 'CAS Design';
            
            if (srcStr.includes('BIỆT THỰ 20')) {
                currentModalImageList = modernImages;
                currentModalCaptionList = modernImages.map(src => {
                    const filename = src.split('/').pop().replace('.png', '');
                    return `Biệt thự Hiện đại - Ảnh ${filename}`;
                });
            } else if (srcStr.includes('ĐỊA TRUNG HẢI')) {
                currentModalImageList = classicImages;
                currentModalCaptionList = classicImages.map(src => {
                    const filename = src.split('/').pop().replace('.png', '');
                    return `Địa Trung Hải - Ảnh ${filename}`;
                });
            } else if (srcStr.includes('INDOCHINE 9')) {
                currentModalImageList = indochineImages;
                currentModalCaptionList = indochineImages.map(src => {
                    const filename = src.split('/').pop().replace('.png', '');
                    return `Phong Cách Indochine - Ảnh ${filename}`;
                });
            } else if (srcStr.includes('NhatKyCongTrinh')) {
                currentModalImageList = diaryImages;
                currentModalCaptionList = diaryImages.map((src, i) => `Nhật ký công trình - Ảnh ${i + 1}`);
            } else if (srcStr.includes('TieuChuanEdit')) {
                // Determine the range from active variables in the scope
                const activeRangeImages = parseRange(currentRange);
                currentModalImageList = activeRangeImages.map(imgNum => `TieuChuanEdit/${currentFolder}/${imgNum}.png`);
                currentModalCaptionList = activeRangeImages.map(imgNum => `Quy chuẩn ${imgNum} - ${getCategoryLabel(currentFolder)}`);
            } else {
                currentModalImageList = [srcStr];
                currentModalCaptionList = [captionStr];
            }

            currentModalImageIndex = currentModalImageList.findIndex(src => srcStr.endsWith(src) || src === srcStr);
            if (currentModalImageIndex === -1) currentModalImageIndex = 0;
        } else {
            currentModalImageList = imgList;
            currentModalImageIndex = startIndex;
            currentModalCaptionList = captionList;
        }

        updateModalImage();
        imageModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Expose to window object for global inline HTML onclick support
    window.openImageModal = openImageModal;

    function updateModalImage() {
        if (currentModalImageList.length === 0) return;
        const src = currentModalImageList[currentModalImageIndex];
        modalImgTarget.src = src;

        const caption = currentModalCaptionList[currentModalImageIndex] || 'CAS Design';
        modalCaptionTarget.innerHTML = `${caption} <span style="opacity: 0.7; font-size: 0.85rem; margin-left: 10px;">(${currentModalImageIndex + 1}/${currentModalImageList.length})</span>`;

        // Toggle navigation arrow visibility
        if (prevArrow && nextArrow) {
            if (currentModalImageList.length > 1) {
                prevArrow.style.display = 'flex';
                nextArrow.style.display = 'flex';
            } else {
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
            }
        }
    }

    function modalPrev() {
        if (currentModalImageList.length <= 1) return;
        currentModalImageIndex = (currentModalImageIndex - 1 + currentModalImageList.length) % currentModalImageList.length;
        updateModalImage();
    }

    function modalNext() {
        if (currentModalImageList.length <= 1) return;
        currentModalImageIndex = (currentModalImageIndex + 1) % currentModalImageList.length;
        updateModalImage();
    }

    function closeImageModal() {
        if (!imageModal) return;
        imageModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeImageModal);
    }

    if (prevArrow) prevArrow.addEventListener('click', (e) => { e.stopPropagation(); modalPrev(); });
    if (nextArrow) nextArrow.addEventListener('click', (e) => { e.stopPropagation(); modalNext(); });

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('modal-close')) {
                closeImageModal();
            }
        });
    }

    // Keyboard navigation handlers
    document.addEventListener('keydown', (e) => {
        if (!imageModal || !imageModal.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') {
            modalPrev();
        } else if (e.key === 'ArrowRight') {
            modalNext();
        } else if (e.key === 'Escape') {
            closeImageModal();
        }
    });

    // Handle generic image grid clicks dynamically
    document.querySelectorAll('.gallery-img, .image-wrapper img, .diary-img').forEach(img => {
        img.addEventListener('click', (e) => {
            // Let overflow overlay clicks be handled by their inline onclick handler
            if (img.parentElement.classList.contains('overflow-overlay')) return;

            let imgList = [img.getAttribute('src')];
            let startIndex = 0;
            let captionList = [img.alt || 'CAS Homes & Design Project'];

            const pane = img.closest('.tab-pane');
            const diary = img.closest('#trust');

            if (pane) {
                const paneId = pane.id;
                if (paneId === 'pane-modern') {
                    imgList = modernImages;
                    captionList = modernImages.map(src => {
                        const filename = src.split('/').pop().replace('.png', '');
                        return `Biệt thự Hiện đại - Ảnh ${filename}`;
                    });
                } else if (paneId === 'pane-classic') {
                    imgList = classicImages;
                    captionList = classicImages.map(src => {
                        const filename = src.split('/').pop().replace('.png', '');
                        return `Địa Trung Hải - Ảnh ${filename}`;
                    });
                } else if (paneId === 'pane-indochine') {
                    imgList = indochineImages;
                    captionList = indochineImages.map(src => {
                        const filename = src.split('/').pop().replace('.png', '');
                        return `Phong Cách Indochine - Ảnh ${filename}`;
                    });
                }
            } else if (diary) {
                imgList = diaryImages;
                captionList = diaryImages.map((src, i) => `Nhật ký công trình - Ảnh ${i + 1}`);
            }

            const cleanSrc = img.getAttribute('src');
            startIndex = imgList.findIndex(src => src === cleanSrc || img.src.endsWith(src));
            if (startIndex === -1) startIndex = 0;

            openImageModal(imgList, startIndex, captionList);
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

    // 10. Sticky Bottom CTA Bar scroll visibility controller
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                stickyBar.classList.add('show');
            } else {
                stickyBar.classList.remove('show');
            }
        });
    }

    // 11. Popup Registration Modal logic
    const registerPopupModal = document.getElementById('register-popup-modal');
    const popupContactForm = document.getElementById('popup-contact-form');
    const popupFormSuccess = document.getElementById('popup-form-success');

    function openRegisterPopup() {
        if (!registerPopupModal) return;
        registerPopupModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeRegisterPopup() {
        if (!registerPopupModal) return;
        registerPopupModal.classList.remove('show');
        document.body.style.overflow = '';
        // Reset form and success alert when closing
        if (popupContactForm) popupContactForm.reset();
        if (popupFormSuccess) popupFormSuccess.style.display = 'none';
        if (popupContactForm) popupContactForm.style.display = 'block';
    }

    // Expose functions globally for inline HTML onclick calls
    window.openRegisterPopup = openRegisterPopup;
    window.closeRegisterPopup = closeRegisterPopup;

    // Connect all Page CTA Buttons to open the Popup Form instead of just scrolling
    document.querySelectorAll('.btn-quote-style, .btn-cta-shimmer, .process-image-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If it's a link or button, prevent default to open popup
            e.preventDefault();
            openRegisterPopup();
        });
    });

    // Close popup on outside click
    if (registerPopupModal) {
        registerPopupModal.addEventListener('click', (e) => {
            if (e.target === registerPopupModal || e.target.classList.contains('popup-modal-close')) {
                closeRegisterPopup();
            }
        });
    }

    // Handle Popup Form Submission
    if (popupContactForm) {
        popupContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real LadiPage, this pushes leads to Google Sheets, CRM, or email.
            // We simulate a successful submission with a sleek fade transition
            popupContactForm.style.display = 'none';
            if (popupFormSuccess) popupFormSuccess.style.display = 'flex';

            // Auto-close popup after 3 seconds on success
            setTimeout(() => {
                closeRegisterPopup();
            }, 3000);
        });
    }
});
