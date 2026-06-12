document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Interactive Technical Standards Book Layout with Category Filtering
    const bookContainer = document.getElementById('tech-book');
    const pageLeft = document.getElementById('book-page-left');
    const pageRight = document.getElementById('book-page-right');
    const pageFlip = document.getElementById('book-page-flip');
    const flipFront = document.getElementById('flip-front');
    const flipBack = document.getElementById('flip-back');
    const btnPrev = document.getElementById('btn-book-prev');
    const btnNext = document.getElementById('btn-book-next');
    const pageIndicator = document.getElementById('book-page-indicator');
    const catButtons = document.querySelectorAll('.tech-cat-btn');

    let currentRange = '1-9'; // Default range
    let currentFolder = 'DoBeTong'; // Default folder
    let activeImages = []; // List of image indices in the current range
    let currentPageIdx = 0; // Current left page offset index (always even: 0, 2, 4...)

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

    // Helper to generate page content HTML
    function getPageHTML(pageIndex, activeImages, catLabel) {
        // Page 0 is Chapter Cover
        if (pageIndex === 0) {
            return `
                <div class="book-cover-content">
                    <span class="cover-sub">CAS HOMES &amp; DESIGN</span>
                    <h3 class="cover-title">TIÊU CHUẨN THI CÔNG</h3>
                    <div class="cover-divider"></div>
                    <h4 class="cover-chapter">CHƯƠNG: ${catLabel.toUpperCase()}</h4>
                    <p class="cover-desc">Hệ thống quy chuẩn thi công chi tiết được kiểm soát chất lượng nghiêm ngặt bởi CAS.</p>
                    <div class="cover-badge"><i data-lucide="check-check"></i> TIÊU CHUẨN VÀNG</div>
                </div>
            `;
        }
        
        // Image pages (1 to activeImages.length)
        const imgIndex = pageIndex - 1;
        if (imgIndex < activeImages.length) {
            const imgNum = activeImages[imgIndex];
            const imgPath = `TieuChuanEdit/${currentFolder}/${imgNum}.png`;
            return `
                <div class="book-image-page" onclick="if(typeof openImageModal === 'function') openImageModal('${imgPath}', 'Quy chuẩn ${imgNum} - ${catLabel}')">
                    <div class="book-image-wrapper">
                        <img src="${imgPath}" alt="Quy chuẩn ${imgNum}" loading="lazy">
                        <div class="book-zoom-indicator">
                            <i data-lucide="zoom-in"></i> Click để phóng to bản vẽ
                        </div>
                    </div>
                    <div class="book-page-meta">
                        <span class="meta-cat">${catLabel}</span>
                        <span class="meta-num">Quy chuẩn #${imgNum.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            `;
        }
        
        // Final ending page
        return `
            <div class="book-cover-content closing">
                <i data-lucide="check-circle-2" class="closing-icon"></i>
                <h3>HOÀN THÀNH TIÊU CHUẨN</h3>
                <p>CAS cam kết bàn giao chuẩn kỹ thuật 100% cho mọi hạng mục công trình.</p>
                <div class="closing-divider"></div>
                <a href="#estimator" class="btn btn-primary btn-sm btn-estimator-scroll">Xem dự toán chi phí</a>
            </div>
        `;
    }

    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    function updateBook(animate = false, direction = 'next') {
        if (!pageLeft || !pageRight) return;
        
        const catLabel = getCategoryLabel(currentFolder);
        const totalPages = activeImages.length + 2; // cover + images + ending
        const isMobile = isMobileDevice();

        // Disable 3D page flip animation on mobile or if animation is false
        if (animate && pageFlip && !isMobile) {
            // Trigger 3D flip animation
            const flipClass = direction === 'next' ? 'flip-next-animation' : 'flip-prev-animation';
            
            // Set content of the flip layer based on direction
            if (direction === 'next') {
                flipFront.innerHTML = getPageHTML(currentPageIdx - 2 + 1, activeImages, catLabel); // Previous right page content
                flipBack.innerHTML = getPageHTML(currentPageIdx, activeImages, catLabel); // New left page content
            } else {
                flipFront.innerHTML = getPageHTML(currentPageIdx + 2, activeImages, catLabel); // Previous left page content
                flipBack.innerHTML = getPageHTML(currentPageIdx + 1, activeImages, catLabel); // New right page content
            }
            
            pageFlip.classList.add(flipClass);
            
            // Render actual pages content midway of flip
            setTimeout(() => {
                renderPagesContent(catLabel, totalPages, isMobile);
            }, 300);

            setTimeout(() => {
                pageFlip.classList.remove(flipClass);
            }, 600);
        } else {
            renderPagesContent(catLabel, totalPages, isMobile);
        }
    }

    function renderPagesContent(catLabel, totalPages, isMobile) {
        if (isMobile) {
            // Mobile Mode: Single page view
            pageLeft.style.display = 'none';
            pageRight.style.width = '100%';
            pageRight.style.borderRadius = '8px';
            pageRight.innerHTML = getPageHTML(currentPageIdx, activeImages, catLabel);
            
            pageIndicator.textContent = `Trang ${currentPageIdx + 1} / ${totalPages}`;
            
            btnPrev.disabled = currentPageIdx === 0;
            btnNext.disabled = currentPageIdx + 1 >= totalPages;
        } else {
            // Desktop Mode: Double page view
            pageLeft.style.display = 'flex';
            pageRight.style.width = '50%';
            pageRight.style.borderRadius = '0 6px 6px 0';
            
            pageLeft.innerHTML = getPageHTML(currentPageIdx, activeImages, catLabel);
            pageRight.innerHTML = getPageHTML(currentPageIdx + 1, activeImages, catLabel);
            
            const currentDisplayPage = currentPageIdx + 1;
            const nextDisplayPage = Math.min(currentPageIdx + 2, totalPages);
            pageIndicator.textContent = `Trang ${currentDisplayPage}-${nextDisplayPage} / ${totalPages}`;
            
            btnPrev.disabled = currentPageIdx === 0;
            btnNext.disabled = currentPageIdx + 2 >= totalPages;
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add scroll animation to link inside closing page
        const estScrollLink = document.querySelector('.btn-estimator-scroll');
        if (estScrollLink) {
            estScrollLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('estimator');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    function initCategoryBook() {
        activeImages = parseRange(currentRange);
        currentPageIdx = 0;
        updateBook(false);
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            const isMobile = isMobileDevice();
            const step = isMobile ? 1 : 2;
            if (currentPageIdx >= step) {
                currentPageIdx -= step;
                updateBook(true, 'prev');
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const totalPages = activeImages.length + 2;
            const isMobile = isMobileDevice();
            const step = isMobile ? 1 : 2;
            if (currentPageIdx + step < totalPages) {
                currentPageIdx += step;
                updateBook(true, 'next');
            }
        });
    }

    // Recalculate layout on window resize (to handle orientation change etc)
    window.addEventListener('resize', () => {
        const isMobile = isMobileDevice();
        const totalPages = activeImages.length + 2;
        
        // Adjust page index to avoid boundary issues when switching between mobile/desktop
        if (!isMobile && currentPageIdx % 2 !== 0) {
            currentPageIdx = Math.max(0, currentPageIdx - 1);
        }
        updateBook(false);
    });

    // Set up category button click handlers
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFolder = btn.getAttribute('data-folder');
            currentRange = btn.getAttribute('data-range');
            initCategoryBook();
        });
    });

    // Initialize Book
    if (bookContainer) {
        initCategoryBook();
    }

    // 3. Portfolio Tab Switcher with Auto Switch (3 seconds)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    let activeTabIdx = 0;
    const tabSwitchInterval = 3000; // 3 seconds
    let tabAutoSwitchTimer;

    function startTabAutoSwitch() {
        tabAutoSwitchTimer = setInterval(() => {
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
        }
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            switchTab(btn);
            
            // Reset the auto-switch timer when user clicks manually
            clearInterval(tabAutoSwitchTimer);
            startTabAutoSwitch();
        });
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

    // 5. Cost Estimator Calculator Multi-Step Logic
    const steps = document.querySelectorAll('.est-step');
    const stepPanes = document.querySelectorAll('.step-pane');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    
    // Inputs
    const inputArea = document.getElementById('input-area');
    const inputFloors = document.getElementById('input-floors');
    
    // Displays
    const areaValDisplay = document.getElementById('area-val-display');
    const floorsValDisplay = document.getElementById('floors-val-display');
    const estimatedCostOutput = document.getElementById('estimated-cost-output');
    const estDataSummary = document.getElementById('est-data-summary');

    let currentStep = 1;

    // Helper to format currency
    function formatVND(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    // Live update slider labels
    if (inputArea) {
        inputArea.addEventListener('input', (e) => {
            areaValDisplay.textContent = `${e.target.value} m²`;
        });
    }

    if (inputFloors) {
        inputFloors.addEventListener('input', (e) => {
            floorsValDisplay.textContent = `${e.target.value} Tầng`;
        });
    }

    // Move to next step
    function goToStep(stepNumber) {
        currentStep = stepNumber;

        steps.forEach((step, idx) => {
            step.classList.remove('active', 'completed');
            const stepNum = idx + 1;
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });

        stepPanes.forEach((pane) => {
            pane.classList.remove('active');
        });
        const currentPane = document.getElementById(`step-${currentStep}-pane`);
        if (currentPane) {
            currentPane.classList.add('active');
        }
    }

    btnNextSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 2) {
                calculateEstimate();
            }
            if (currentStep < 3) {
                goToStep(currentStep + 1);
            }
        });
    });

    btnPrevSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });

    // Price calculations
    function calculateEstimate() {
        const styleInput = document.querySelector('input[name="est_style"]:checked');
        const pkgInput = document.querySelector('input[name="est_package"]:checked');
        
        if (!styleInput || !pkgInput) return;
        
        const style = styleInput.value;
        const pkg = pkgInput.value;
        const area = parseFloat(inputArea.value);
        const floors = parseFloat(inputFloors.value);

        // Price mapping per square meter based on Style and Gói vật tư
        const prices = {
            modern: { standard: 5500000, premium: 8500000 },
            indochine: { standard: 6500000, premium: 9500000 },
            classic: { standard: 8000000, premium: 12000000 }
        };

        const unitPrice = prices[style][pkg];
        const multiplier = 1.3; // Foundation & roof factor
        
        const totalCost = area * floors * unitPrice * multiplier;

        if (estimatedCostOutput) {
            estimatedCostOutput.textContent = formatVND(totalCost);
        }
        
        const styleText = style === 'modern' ? 'Hiện đại' : style === 'indochine' ? 'Đông Dương' : 'Cổ điển';
        const pkgText = pkg === 'standard' ? 'Tiêu Chuẩn' : 'Cao Cấp Lux';
        if (estDataSummary) {
            estDataSummary.value = `Phong cách: ${styleText}, Gói: ${pkgText}, Diện tích: ${area}m2, Số tầng: ${floors}, Ước tính: ${formatVND(totalCost)}`;
        }
    }

    // 6. Form submissions & Webhook pushing
    const estimatorLeadForm = document.getElementById('estimator-lead-form');
    const estimatorSuccess = document.getElementById('estimator-success');

    if (estimatorLeadForm) {
        estimatorLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('est-name').value;
            const phone = document.getElementById('est-phone').value;
            const summary = estDataSummary ? estDataSummary.value : '';

            // Webhook CRM payloads
            const webhookPayload = {
                event: "estimator_lead",
                timestamp: new Date().toISOString(),
                data: { name, phone, details: summary }
            };
            console.log('Sending Webhook Data to CRM:', webhookPayload);

            estimatorLeadForm.style.display = 'none';
            if (estimatorSuccess) estimatorSuccess.style.display = 'flex';
        });
    }

    const mainContactForm = document.getElementById('main-contact-form');
    const mainFormSuccess = document.getElementById('main-form-success');

    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('m-name').value;
            const phone = document.getElementById('m-phone').value;
            const style = document.getElementById('m-style').value;

            // Webhook CRM payloads
            const webhookPayload = {
                event: "main_consultation_request",
                timestamp: new Date().toISOString(),
                data: { name, phone, favorite_style: style }
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

    document.querySelectorAll('.gallery-img, .image-wrapper img').forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.src, img.alt || 'CAS Homes & Design Project');
        });
    });

    // 8. Video Testimonial Modal Player logic
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('testimonial-video-player');
    const videoCaptionTarget = document.getElementById('video-modal-caption');
    const videoCloseBtn = document.getElementById('video-modal-close');
    const videoPlayButtons = document.querySelectorAll('.video-play-btn');

    // Video URLs mapping
    const videoUrls = [
        "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba20aa6c35b120be74c7e6c06387&profile_id=139&oauth2_token_id=57447761",
        "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdfb1754942b04f76ccb6b3e6488d3f3f01c801&profile_id=139&oauth2_token_id=57447761"
    ];

    videoPlayButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.testimonial-video-card');
            const title = card ? card.querySelector('h4').textContent : '';
            const quote = card ? card.querySelector('p').textContent : '';
            
            if (videoModal && videoPlayer && videoCaptionTarget) {
                videoPlayer.src = videoUrls[index] || videoUrls[0];
                videoCaptionTarget.textContent = `${title} : "${quote}"`;
                videoModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                videoPlayer.play().catch(e => console.log('Video play blocked:', e));
            }
        });
    });

    function closeVideoModal() {
        if (!videoModal || !videoPlayer) return;
        videoPlayer.pause();
        videoPlayer.src = "";
        videoModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (videoCloseBtn) {
        videoCloseBtn.addEventListener('click', closeVideoModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target.id === 'video-modal-close') {
                closeVideoModal();
            }
        });
    }

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
});
