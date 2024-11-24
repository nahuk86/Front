document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:32769/api/Account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Inicio de sesión exitoso!');
            // Redirige al panel o almacena el token
            console.log(data);
        } else {
            alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
