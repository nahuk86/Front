document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (token) {
        // Valida el token, pero no redirige automáticamente
        fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    // Si el token es válido, redirige al panel
                    window.location.href = 'panel.html';
                } else {
                    console.log('Token inválido o expirado.');
                    localStorage.removeItem('token'); // Limpia el token si no es válido
                }
            })
            .catch((error) => {
                console.error('Error al validar el token:', error);
                localStorage.removeItem('token'); // Limpia el token en caso de error
            });
    }
});
