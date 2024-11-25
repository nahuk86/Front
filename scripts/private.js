document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Token inválido o expirado.');

        console.log('Redirigiendo al panel.');
        window.location.href = 'panel.html'; // Redirige al panel
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});
