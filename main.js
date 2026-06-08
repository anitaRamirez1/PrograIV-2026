import { setupLogin } from './componentes/InicioSesion.js';
import { setupRegister } from './componentes/Registro.js';
import { setupRecover } from './componentes/Recuperar.js';

document.addEventListener('DOMContentLoaded', () => {
    // Global Navigation / View Switcher logic
    const views = document.querySelectorAll('.view');
    
    function switchView(viewId) {
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        
        // Reset forms when switching to keep it clean
        if (viewId === 'login-view') {
            document.getElementById('login-form').reset();
        }
        if (viewId === 'register-view') {
            document.getElementById('register-form').reset();
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('.input-group.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelector('.password-strength').classList.remove('active');
        }
        if (viewId === 'recover-view') {
            document.getElementById('recover-form').reset();
            document.getElementById('recover-success-msg').classList.add('hidden');
        }
    }

    // Initialize components connections
    setupLogin(switchView);
    setupRegister(switchView);
    setupRecover(switchView);
});
