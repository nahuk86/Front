document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado

    const loadingScreen = document.getElementById('loading-screen');
    const privateContent = document.getElementById('private-content');

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token con el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Token JWT
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si la validación es exitosa, muestra el contenido
        console.log('Acceso autorizado a la página privada.');
        loadingScreen.style.display = 'none'; // Oculta la pantalla de carga
        privateContent.style.display = 'block'; // Muestra el contenido principal
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpia el token si es inválido
        window.location.href = 'login.html';
    }
});
