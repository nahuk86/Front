function logout() {
    localStorage.removeItem('token');
    alert('Has cerrado sesión.');
    window.location.href = 'login.html'; // Redirige al login
}
