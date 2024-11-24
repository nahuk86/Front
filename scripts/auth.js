document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

    // Si ya hay un token, NO redirigir automáticamente desde index.html
    if (window.location.pathname.includes('index.html') && token) {
        console.log('Usuario autenticado, pero no redirigiendo desde index.html.');
        return;
    }

    // Si estás en otra página protegida y no tienes token, redirige al login
    if (!token && (window.location.pathname.includes('panel.html') || window.location.pathname.includes('private.html'))) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
    }
});
