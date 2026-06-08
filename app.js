document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Click "Nhận Báo Giá Phong Cách Này" button behavior
    const styleQuoteButtons = document.querySelectorAll('.btn-quote-style');
    const mainStyleSelect = document.getElementById('m-style');

    styleQuoteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedStyle = btn.getAttribute('data-style');
            
            // Set the value in dropdown
            if (mainStyleSelect) {
                mainStyleSelect.value = selectedStyle;
            }

            // Scroll smoothly to contact form
            const contactSection = document.getElementById('contact-form-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Estimator Multi-Step Form Logic
    const steps = document.querySelectorAll('.est-step');
    const stepPanes = document.querySelectorAll('.step-pane');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    
    // Inputs
    const styleInputs = document.querySelectorAll('input[name="est_style"]');
    const packageInputs = document.querySelectorAll('input[name="est_package"]');
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

        // Update step headers
        steps.forEach((step, idx) => {
            step.classList.remove('active', 'completed');
            const stepNum = idx + 1;
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step panes
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

    // Calculation Formula
    function calculateEstimate() {
        const styleInput = document.querySelector('input[name="est_style"]:checked');
        const pkgInput = document.querySelector('input[name="est_package"]:checked');
        
        if (!styleInput || !pkgInput) return;
        
        const style = styleInput.value;
        const pkg = pkgInput.value;
        const area = parseFloat(inputArea.value);
        const floors = parseFloat(inputFloors.value);

        // Price mapping per square meter based on Style and Package
        const prices = {
            modern: { standard: 5500000, premium: 8500000 },
            indochine: { standard: 6500000, premium: 9500000 },
            classic: { standard: 8000000, premium: 12000000 }
        };

        const unitPrice = prices[style][pkg];
        
        // Construction coefficient (1.3 to account for foundation, columns, roofing, etc.)
        const multiplier = 1.3;
        
        const totalCost = area * floors * unitPrice * multiplier;

        if (estimatedCostOutput) {
            estimatedCostOutput.textContent = formatVND(totalCost);
        }
        
        // Set dynamic content in hidden input for lead submissions
        const styleText = style === 'modern' ? 'Hiện đại' : style === 'indochine' ? 'Đông Dương' : 'Cổ điển';
        const pkgText = pkg === 'standard' ? 'Tiêu Chuẩn' : 'Cao Cấp Lux';
        if (estDataSummary) {
            estDataSummary.value = `Phong cách: ${styleText}, Gói: ${pkgText}, Diện tích: ${area}m2, Số tầng: ${floors}, Ước tính: ${formatVND(totalCost)}`;
        }
    }

    // 4. Lead Form Submissions & Webhook Simulations
    const estimatorLeadForm = document.getElementById('estimator-lead-form');
    const estimatorSuccess = document.getElementById('estimator-success');

    if (estimatorLeadForm) {
        estimatorLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('est-name').value;
            const phone = document.getElementById('est-phone').value;
            const summary = estDataSummary ? estDataSummary.value : '';

            // Webhook payload simulation (automating lead pushes to sheets/CRM)
            const webhookPayload = {
                event: "estimator_lead",
                timestamp: new Date().toISOString(),
                data: { name, phone, details: summary }
            };
            console.log('Sending webhook data to CRM/Google Sheets:', webhookPayload);

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

            // Webhook payload simulation
            const webhookPayload = {
                event: "main_consultation_request",
                timestamp: new Date().toISOString(),
                data: { name, phone, favorite_style: style }
            };
            console.log('Sending webhook data to CRM/Google Sheets:', webhookPayload);

            mainContactForm.style.display = 'none';
            if (mainFormSuccess) mainFormSuccess.style.display = 'flex';
        });
    }

    // 5. Image Lightbox Modal Popup Logic
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

    // Bind click events to elements
    document.querySelectorAll('.portfolio-item img').forEach(img => {
        img.addEventListener('click', () => {
            const overlay = img.parentElement.querySelector('.port-overlay');
            const cat = overlay ? overlay.querySelector('span').textContent : '';
            const title = overlay ? overlay.querySelector('h4').textContent : '';
            openImageModal(img.src, `${cat} - ${title}`);
        });
    });

    document.querySelectorAll('.style-card-image img').forEach(img => {
        img.addEventListener('click', () => {
            const card = img.closest('.style-card-box');
            const label = card ? card.querySelector('.style-label-tag').textContent : '';
            const desc = card ? card.querySelector('h3').textContent : '';
            openImageModal(img.src, `${label} (${desc})`);
        });
    });

    document.querySelectorAll('.visual-img').forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.src, img.alt || 'Hiện trạng thi công hoàn thiện của CAS');
        });
    });
});
