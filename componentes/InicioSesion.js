import { setupPasswordToggles } from './Validacion.js';

export function setupLogin(switchView) {
    const loginForm = document.getElementById('login-form');
    const linkForgotPassword = document.getElementById('link-forgot-password');
    const linkCreateAccount = document.getElementById('link-create-account');
    const btnLogout = document.getElementById('btn-logout');

    // Initialize UI elements like password toggles
    setupPasswordToggles();

    // Event listeners for navigation
    linkForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('recover-view');
    });

    linkCreateAccount.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('register-view');
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            switchView('login-view');
        });
    }

    // Submit listener
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        
        if (email && pass) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', pass);

            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alertify.success('Bienvenido de nuevo');
                    switchView('dashboard-view');
                } else {
                    alertify.error('Error: ' + data.message);
                }
            })
            .catch(error => {
                alertify.error('Error de conexión al servidor.');
                console.error(error);
            });
        }
    });
}
