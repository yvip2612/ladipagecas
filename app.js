document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Estimator Multi-Step Form Logic
    const steps = document.querySelectorAll('.est-step');
    const stepPanes = document.querySelectorAll('.step-pane');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    
    // Inputs
    const constructionTypeInputs = document.querySelectorAll('input[name="construction_type"]');
    const inputArea = document.getElementById('input-area');
    const inputFloors = document.getElementById('input-floors');
    const floorsContainer = document.getElementById('floors-container');
    
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

    // Dynamic UI adjustments based on construction type
    function handleTypeChange() {
        const selectedType = document.querySelector('input[name="construction_type"]:checked').value;
        if (selectedType === 'apartment') {
            if (floorsContainer) floorsContainer.style.display = 'none';
        } else {
            if (floorsContainer) floorsContainer.style.display = 'block';
        }
    }

    constructionTypeInputs.forEach(input => {
        input.addEventListener('change', handleTypeChange);
    });

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
        const typeInput = document.querySelector('input[name="construction_type"]:checked');
        const pkgInput = document.querySelector('input[name="material_package"]:checked');
        
        if (!typeInput || !pkgInput) return;
        
        const type = typeInput.value;
        const pkg = pkgInput.value;
        const area = parseFloat(inputArea.value);
        const floors = type === 'apartment' ? 1 : parseFloat(inputFloors.value);

        // Price mapping per square meter
        const prices = {
            townhouse: { standard: 5500000, premium: 8500000 },
            villa: { standard: 7500000, premium: 11500000 },
            apartment: { standard: 3500000, premium: 5500000 }
        };

        const unitPrice = prices[type][pkg];
        
        // Construction multiplier (1.3 for foundation, roof; 1.0 for apartments)
        const multiplier = type === 'apartment' ? 1.0 : 1.3;
        
        const totalCost = area * floors * unitPrice * multiplier;

        if (estimatedCostOutput) {
            estimatedCostOutput.textContent = formatVND(totalCost);
        }
        
        // Set dynamic content in hidden input for lead submissions
        const typeText = type === 'townhouse' ? 'Nhà Phố' : type === 'villa' ? 'Biệt Thự' : 'Căn Hộ';
        const pkgText = pkg === 'standard' ? 'Tiêu Chuẩn' : 'Cao Cấp Lux';
        if (estDataSummary) {
            estDataSummary.value = `Loại hình: ${typeText}, Gói: ${pkgText}, Diện tích: ${area}m2, Số tầng: ${floors}, Ước tính: ${formatVND(totalCost)}`;
        }
    }

    // 3. Lead Form Submissions
    const estimatorLeadForm = document.getElementById('estimator-lead-form');
    const estimatorSuccess = document.getElementById('estimator-success');

    if (estimatorLeadForm) {
        estimatorLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('est-name').value;
            const phone = document.getElementById('est-phone').value;
            const summary = estDataSummary ? estDataSummary.value : '';

            console.log('Estimate Lead Submission:', { name, phone, summary });

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
            const service = document.getElementById('m-service').value;

            console.log('Main Contact Submission:', { name, phone, service });

            mainContactForm.style.display = 'none';
            if (mainFormSuccess) mainFormSuccess.style.display = 'flex';
        });
    }

    // 4. Image Lightbox Modal Popup Logic
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

    // Bind click events
    document.querySelectorAll('.portfolio-item img').forEach(img => {
        img.addEventListener('click', () => {
            const overlay = img.parentElement.querySelector('.port-overlay');
            const cat = overlay ? overlay.querySelector('span').textContent : '';
            const title = overlay ? overlay.querySelector('h4').textContent : '';
            openImageModal(img.src, `${cat} - ${title}`);
        });
    });

    document.querySelectorAll('.service-image-box img').forEach(img => {
        img.addEventListener('click', () => {
            const card = img.closest('.service-card');
            const title = card ? card.querySelector('h3').textContent : '';
            const tag = card ? card.querySelector('.service-tagline').textContent : '';
            openImageModal(img.src, `${title}: ${tag}`);
        });
    });

    document.querySelectorAll('.visual-img').forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.src, img.alt || 'CAS Homes & Design Project');
        });
    });

    // Run type check on load
    handleTypeChange();
});
