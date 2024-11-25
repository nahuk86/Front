import { logEvent } from './log.js';

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            await logEvent(email, 'Registro', 'Registro exitoso.');
            alert('Registro exitoso. Por favor, inicia sesión.');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            await logEvent(email, 'Registro', `Error en registro: ${errorData.message || 'Desconocido'}`);
            alert(errorData.message || 'Error al registrarse.');
        }
    } catch (error) {
        console.error('Error:', error);
        await logEvent(email, 'Registro', 'Error de red durante el registro.');
        alert('Error de red. Intenta nuevamente.');
    }
});
