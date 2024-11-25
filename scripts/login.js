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

            // Guarda el token y el email en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);

            // Registrar el evento de inicio de sesión exitoso en la bitácora
            await logEvent(email, 'Inicio de sesión', 'Usuario autenticado exitosamente.');

            alert('Inicio de sesión exitoso.');
            window.location.href = 'panel.html'; // Redirige al usuario al panel
        } else {
            // Registrar el intento fallido en la bitácora
            await logEvent(email, 'Fallo de autenticación', 'Credenciales inválidas.');

            alert('Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error durante la autenticación:', error);

        // Registrar el error técnico en la bitácora
        await logEvent(email || 'Desconocido', 'Error técnico', `Error durante la autenticación: ${error.message}`);

        alert('Ocurrió un error al intentar iniciar sesión.');
    }
});
