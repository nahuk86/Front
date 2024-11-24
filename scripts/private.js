// Verifica si el usuario está autenticado
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = 'login.html'; // Redirige a la pantalla de login
    }
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});
