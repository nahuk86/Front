import { logEvent } from './utils/log.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const loginResponse = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            const token = loginData.token;

            // Guardar token y email en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);

            // Registrar inicio de sesión exitoso
            await logEvent(email, 'Inicio de sesión', 'Usuario autenticado exitosamente.');

            alert('Inicio de sesión exitoso.');
            window.location.href = 'panel.html'; // Redirige al panel
        } else {
            // Manejo de errores y registro en bitácora
            await logEvent(email, 'Fallo de autenticación', 'Credenciales inválidas.');
            alert('Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        await logEvent(email || 'Desconocido', 'Error técnico', `Error durante la autenticación: ${error.message}`);
        alert('Ocurrió un error al intentar iniciar sesión.');
    }
});
