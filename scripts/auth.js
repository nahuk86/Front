document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token && window.location.pathname.includes('panel.html')) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
    }
});
