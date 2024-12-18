import { logEvent } from './log.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Guarda el token
            await logEvent(email, 'Inicio de Sesión', 'Inicio de sesión exitoso.');
            alert('Inicio de sesión exitoso.');
            window.location.href = 'panel.html'; // Redirige al panel
        } else {
            const errorData = await response.json();
            await logEvent(email, 'Inicio de Sesión', `Error en inicio de sesión: ${errorData.message || 'Desconocido'}`);
            alert(errorData.message || 'Correo o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        await logEvent(email, 'Inicio de Sesión', 'Error de red durante el inicio de sesión.');
        alert('Error de red. Intenta nuevamente.');
    }
});
