document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const submitButton = event.target.querySelector('button[type="submit"]');

    // Validaciones del formulario
    if (!name || !email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    // Deshabilitar el botón para evitar múltiples envíos
    submitButton.disabled = true;

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Registro exitoso. Por favor, inicia sesión.');
            window.location.href = 'login.html'; // Redirige a la pantalla de login
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al registrarse.');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red. Intenta nuevamente.');
    } finally {
        // Habilitar el botón de nuevo
        submitButton.disabled = false;
    }
});

// Función para validar correos electrónicos
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
