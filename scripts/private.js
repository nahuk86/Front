document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Verifica si hay un token almacenado

    // Si no hay token, redirige al inicio con un mensaje
    if (!token) {
        alert('Esta es una página privada. Por favor, inicia sesión primero.');
        window.location.href = 'index.html'; // Redirige a la página principal
        return;
    }

    try {
        // Valida el token con el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Si la validación falla, redirige al inicio
        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si el token es válido, muestra el contenido del panel
        document.getElementById('private-content').style.display = 'block';
    } catch (error) {
        console.error('Error de autenticación:', error);
        localStorage.removeItem('token'); // Limpia el token si es inválido
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = 'index.html'; // Redirige al inicio
    }
});
