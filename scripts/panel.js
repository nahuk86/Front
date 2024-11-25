document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token desde localStorage

    // Verifica si el token no existe
    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token en el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Verifica si el token es inválido o expirado
        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si la validación es exitosa, muestra el panel
        console.log('Token válido. Mostrando panel.');
        document.getElementById('panel-content').style.display = 'block';
        initializePanel(); // Inicializa las funcionalidades del panel
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpia el token si es inválido
        window.location.href = 'login.html';
    }
});

// Función para inicializar las funcionalidades del panel
function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Simula la carga de funcionalidades
    setTimeout(() => {
        resultArea.innerHTML = `<p>Funcionalidades cargadas exitosamente.</p>`;
    }, 1000); // Simula una carga de 1 segundo
}
