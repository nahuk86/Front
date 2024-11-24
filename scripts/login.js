document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        // Intenta autenticar al usuario
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

            // Guarda el token y el email del usuario en el localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);

            // Registrar el evento de inicio de sesión exitoso
            try {
                await logEvent(email, 'Inicio de sesión', 'Usuario autenticado exitosamente.');
            } catch (logError) {
                console.error('Error al registrar el evento de inicio de sesión:', logError);
            }

            alert('Inicio de sesión exitoso.');
            window.location.href = 'panel.html'; // Redirige al usuario al panel
        } else {
            const errorData = await loginResponse.json(); // Obtén el mensaje de error del backend
            await logEvent(email, 'Fallo de autenticación', errorData.message || 'Credenciales inválidas.');
            alert(errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error durante la autenticación:', error);

        // Registrar el error técnico en la bitácora
        try {
            await logEvent(email || 'Desconocido', 'Error técnico', `Error durante la autenticación: ${error.message}`);
        } catch (logError) {
            console.error('Error al registrar el evento de error técnico:', logError);
        }

        alert('Ocurrió un error al intentar iniciar sesión.');
    }
});

// Función para registrar eventos en la bitácora
async function logEvent(usuario, evento, detalle) {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

    if (!token) {
        console.error('No se puede registrar el evento: Token ausente.');
        return;
    }

    const logEntry = {
        Email: usuario,
        Accion: evento,
        Detalle: detalle,
        Fecha: new Date().toISOString(), // Formato ISO para la fecha
    };

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/registrar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logEntry), // Envia los datos de la bitácora
        });

        if (!response.ok) {
            console.error('Error al registrar el evento en la bitácora:', response.statusText);
        } else {
            console.log('Evento registrado exitosamente:', logEntry);
        }
    } catch (error) {
        console.error('Error técnico al registrar el evento en la bitácora:', error);
    }
}
