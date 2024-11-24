document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token con el backend
        const response = await fetch('https://localhost:32781/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token JWT
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si la validación es exitosa, muestra el contenido
        document.getElementById('private-content').style.display = 'block';
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpia el token si es inválido
        window.location.href = 'login.html';
    }
});

// Lógica para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    alert('Has cerrado sesión.');
    window.location.href = 'login.html'; // Redirige al login
});
