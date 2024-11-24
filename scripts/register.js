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
            alert('Registro exitoso. Por favor, inicia sesión.');
            window.location.href = 'login.html'; // Redirige a la pantalla de login
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al registrarse.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de red. Intenta nuevamente.');
    }
});
