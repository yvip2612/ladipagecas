document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Interactive Technical Standards Slideshow (57 pages)
    const slidesTrack = document.getElementById('tech-slides-track');
    const thumbnailsTrack = document.getElementById('tech-thumbnails-track');
    const prevBtn = document.getElementById('tech-prev-btn');
    const nextBtn = document.getElementById('tech-next-btn');
    const currentIdxDisplay = document.getElementById('tech-current-index');
    
    const totalSlides = 57;
    let activeTechSlideIdx = 0;

    if (slidesTrack && thumbnailsTrack) {
        // Generate Slides & Thumbnails
        for (let i = 1; i <= totalSlides; i++) {
            const imgPath = `TieuChuanEdit/${i}.png`;

            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'tech-slide';
            const slideImg = document.createElement('img');
            slideImg.src = imgPath;
            slideImg.alt = `Quy chuẩn thi công ${i}`;
            slideImg.loading = 'lazy';
            
            // Allow fullscreen preview on click via the existing lightbox modal
            slideImg.addEventListener('click', () => {
                if (typeof openImageModal === 'function') {
                    openImageModal(slideImg.src, slideImg.alt);
                }
            });
            
            slide.appendChild(slideImg);
            slidesTrack.appendChild(slide);

            // Create thumbnail element
            const thumb = document.createElement('div');
            thumb.className = `tech-thumbnail ${i === 1 ? 'active' : ''}`;
            const thumbImg = document.createElement('img');
            thumbImg.src = imgPath;
            thumbImg.alt = `Quy chuẩn ${i} Thumbnail`;
            thumbImg.loading = 'lazy';
            
            thumb.appendChild(thumbImg);
            thumb.addEventListener('click', () => {
                goToTechSlide(i - 1);
            });
            
            thumbnailsTrack.appendChild(thumb);
        }

        function updateTechSlider() {
            // Translate track wrapper
            slidesTrack.style.transform = `translateX(-${activeTechSlideIdx * 100}%)`;

            // Update page indicator counter
            if (currentIdxDisplay) {
                currentIdxDisplay.textContent = activeTechSlideIdx + 1;
            }

            // Sync thumbnail highlight and scroll into view
            const thumbs = thumbnailsTrack.querySelectorAll('.tech-thumbnail');
            thumbs.forEach((t, idx) => {
                if (idx === activeTechSlideIdx) {
                    t.classList.add('active');
                    t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    t.classList.remove('active');
                }
            });
        }

        function goToTechSlide(index) {
            activeTechSlideIdx = index;
            updateTechSlider();
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                activeTechSlideIdx = (activeTechSlideIdx - 1 + totalSlides) % totalSlides;
                updateTechSlider();
            });

            nextBtn.addEventListener('click', () => {
                activeTechSlideIdx = (activeTechSlideIdx + 1) % totalSlides;
                updateTechSlider();
            });
        }
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
