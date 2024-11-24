document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Verifica si hay un token almacenado

    // Si no hay token, redirige al login inmediatamente
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Si el token no es válido, redirige al login
            throw new Error('Token inválido o expirado');
        }

        // Si el token es válido, muestra el contenido
        document.getElementById('private-content').style.display = 'block';
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Elimina el token inválido
        window.location.href = 'login.html';
    }
});
