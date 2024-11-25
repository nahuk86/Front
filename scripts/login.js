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

            // Guarda el token en el localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);

            // Redirige al usuario al panel
            window.location.href = 'panel.html'; 
        } else {
            // Maneja el error de inicio de sesión
            const errorData = await loginResponse.json(); // Obtiene los detalles del error del servidor
            alert(errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.'); 
        }
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        alert('Ocurrió un error al intentar iniciar sesión.');
    }
});