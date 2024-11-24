document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Verifica si hay un token

    if (token) {
        // Valida el token con el backend
        fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Usuario autenticado'); // Para confirmar la autenticación
                } else {
                    console.log('Token inválido, limpiando token.');
                    localStorage.removeItem('token'); // Elimina el token si es inválido
                }
            })
            .catch((error) => {
                console.error('Error al validar el token:', error);
                localStorage.removeItem('token'); // Elimina el token si hay un error
            });
    }
});
