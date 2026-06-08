export function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);
    if(input && errorSpan) {
        input.parentElement.parentElement.classList.add('invalid');
        errorSpan.textContent = message;
    }
}

export function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);
    if(input && errorSpan) {
        input.parentElement.parentElement.classList.remove('invalid');
        errorSpan.textContent = '';
    }
}

export function checkRequired(input, id, name) {
    if (!input.value.trim()) {
        showError(id, `El campo ${name} es obligatorio.`);
        return false;
    }
    clearError(id);
    return true;
}

export function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}
