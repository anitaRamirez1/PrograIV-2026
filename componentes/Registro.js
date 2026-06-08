import { showError, clearError, checkRequired } from './Validacion.js';

export function setupRegister(switchView) {
    const registerForm = document.getElementById('register-form');
    const btnCancelRegister = document.getElementById('btn-cancel-register');
    const btnContinueDashboard = document.getElementById('btn-continue-dashboard');
    
    const validationModal = document.getElementById('validation-modal');
    const validationLoading = document.getElementById('validation-loading');
    const validationSuccess = document.getElementById('validation-success');

    const regNombres = document.getElementById('reg-nombres');
    const regApellidos = document.getElementById('reg-apellidos');

    const regEmail = document.getElementById('reg-email');
    const regPassword = document.getElementById('reg-password');
    const regConfirmPassword = document.getElementById('reg-confirm-password');
    const regTerms = document.getElementById('reg-terms');

    // Navigation events
    btnCancelRegister.addEventListener('click', () => {
        switchView('login-view');
    });

    btnContinueDashboard.addEventListener('click', () => {
        validationModal.classList.add('hidden');
        switchView('dashboard-view');
    });

    // Real-time validations
    const validatePasswordComplexity = () => {
        const val = regPassword.value;
        const strengthContainer = document.querySelector('.password-strength');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (!val) {
            strengthContainer.classList.remove('active');
            showError('reg-password', 'La contraseña es obligatoria.');
            return false;
        }

        strengthContainer.classList.add('active');

        let score = 0;
        let errors = [];

        if (val.length >= 8) score += 1;
        else errors.push("Mín. 8 caracteres.");

        if (/[A-Z]/.test(val)) score += 1;
        else errors.push("Mayúscula.");

        if (/[a-z]/.test(val)) score += 1;
        else errors.push("Minúscula.");

        if (/[0-9]/.test(val)) score += 1;
        else errors.push("Número.");

        if (/[^A-Za-z0-9]/.test(val)) score += 1;
        else errors.push("Carácter especial.");

        // UI Updates for strength
        if (score <= 2) {
            strengthBar.style.width = '33%';
            strengthBar.style.backgroundColor = '#f44336';
            strengthText.textContent = 'Débil';
            strengthText.style.color = '#f44336';
        } else if (score <= 4) {
            strengthBar.style.width = '66%';
            strengthBar.style.backgroundColor = '#ff9800';
            strengthText.textContent = 'Media';
            strengthText.style.color = '#ff9800';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#4caf50';
            strengthText.textContent = 'Fuerte';
            strengthText.style.color = '#4caf50';
        }

        if (score < 5) {
            showError('reg-password', 'Requisitos faltantes: ' + errors.join(' '));
            return false;
        }

        clearError('reg-password');
        return true;
    };

    const validateConfirmPassword = () => {
        if (!regConfirmPassword.value) {
            showError('reg-confirm-password', 'Confirma tu contraseña.');
            return false;
        }
        if (regPassword.value !== regConfirmPassword.value) {
            showError('reg-confirm-password', 'Las contraseñas no coinciden.');
            return false;
        }
        clearError('reg-confirm-password');
        return true;
    };

    // Attach real-time input listeners

    regPassword.addEventListener('input', () => {
        validatePasswordComplexity();
        if (regConfirmPassword.value) validateConfirmPassword();
    });
    regConfirmPassword.addEventListener('input', validateConfirmPassword);
    
    const validateEmail = () => {
        const emailVal = regEmail.value.trim();
        if (!emailVal) {
            showError('reg-email', 'El correo institucional es obligatorio.');
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ugb\.edu\.sv$/i;
        if (!emailRegex.test(emailVal)) {
            showError('reg-email', 'Debe ser un correo institucional válido.');
            return false;
        }
        clearError('reg-email');
        return true;
    };

    regNombres.addEventListener('input', () => checkRequired(regNombres, 'reg-nombres', 'Nombres'));
    regApellidos.addEventListener('input', () => checkRequired(regApellidos, 'reg-apellidos', 'Apellidos'));
    regEmail.addEventListener('input', validateEmail);
    regTerms.addEventListener('change', () => {
        if (!regTerms.checked) {
            showError('reg-terms', 'Debes aceptar los términos y condiciones.');
        } else {
            clearError('reg-terms');
        }
    });

    // Form Submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Force evaluation of all fields
        const v1 = checkRequired(regNombres, 'reg-nombres', 'Nombres');
        const v2 = checkRequired(regApellidos, 'reg-apellidos', 'Apellidos');
        const v4 = validateEmail();
        const v5 = validatePasswordComplexity();
        const v6 = validateConfirmPassword();
        let v7 = true;
        if (!regTerms.checked) {
            showError('reg-terms', 'Debes aceptar los términos y condiciones.');
            alertify.warning('Para continuar, debes aceptar los términos y condiciones.');
            v7 = false;
        }

        if (v1 && v2 && v4 && v5 && v6 && v7) {
            // UI Feedback
            validationModal.classList.remove('hidden');
            validationLoading.classList.remove('hidden');
            validationSuccess.classList.add('hidden');

            // Call PHP backend
            const formData = new FormData();
            formData.append('nombres', regNombres.value.trim());
            formData.append('apellidos', regApellidos.value.trim());
            formData.append('email', regEmail.value.trim());
            formData.append('password', regPassword.value);

            fetch('api/register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                validationLoading.classList.add('hidden');
                
                if (data.success) {
                    alertify.success('Cuenta creada exitosamente');
                    validationSuccess.classList.remove('hidden');
                } else {
                    // Show error and close modal
                    validationModal.classList.add('hidden');
                    alertify.error('Error: ' + data.message);
                }
            })
            .catch(error => {
                validationLoading.classList.add('hidden');
                validationModal.classList.add('hidden');
                alertify.error('Error de conexión al servidor.');
                console.error(error);
            });
        }
    });
}
