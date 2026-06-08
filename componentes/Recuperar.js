import { showError, clearError } from './Validacion.js';

export function setupRecover(switchView) {
    const recoverForm = document.getElementById('recover-form');
    const btnBackLogin = document.getElementById('btn-back-login');

    btnBackLogin.addEventListener('click', () => {
        switchView('login-view');
    });

    recoverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('rec-email');
        if (email.value.trim() === '') {
            showError('rec-email', 'El correo es obligatorio.');
            return;
        }
        clearError('rec-email');
        
        const btn = recoverForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        // Simulate sending email to backend
        setTimeout(() => {
            document.getElementById('recover-success-msg').classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Enviar enlace';
            recoverForm.reset();
        }, 1500);
    });
}
