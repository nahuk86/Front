document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Verifica si hay un token

    if (token) {
        // Intenta validar el token antes de redirigir
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
                }
            })
            .catch((error) => {
                console.error('Error al validar el token:', error);
            });
    }
});
