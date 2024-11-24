document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.Token); // Almacena el token
            alert('Autenticación exitosa.');
            window.location.href = 'panel.html'; // Redirige al panel
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Correo o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de red. Intenta nuevamente.');
    }
});
