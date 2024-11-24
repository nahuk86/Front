document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirige al login
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Muestra el contenido si el token es válido
        document.getElementById('private-content').style.display = 'block';
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Elimina el token inválido
        window.location.href = 'login.html';
    }
});

// Lógica para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    alert('Has cerrado sesión.');
    window.location.href = 'login.html'; // Redirige al login
});
