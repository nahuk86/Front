document.addEventListener('DOMContentLoaded', function () {
    const resultArea = document.getElementById('result-area');

    // Botón Ver Escáneres Disponibles
    document.getElementById('view-scanners').addEventListener('click', function () {
        // Simulación de la acción
        updateResultArea('Mostrando escáneres disponibles...');
    });

    // Botón Activar Escáner
    document.getElementById('activate-scanner').addEventListener('click', function () {
        // Simulación de la acción
        updateResultArea('Escáner activado exitosamente.');
        updateScannerStatus(1, 'Activo');
    });

    // Botón Desactivar Escáner
    document.getElementById('deactivate-scanner').addEventListener('click', function () {
        // Simulación de la acción
        updateResultArea('Escáner desactivado exitosamente.');
        updateScannerStatus(1, 'Inactivo');
    });

    // Botón Generar Reporte
    document.getElementById('generate-report').addEventListener('click', function () {
        // Simulación de la acción
        updateResultArea('Generando reporte...');
    });

    // Botón Solicitar Envío de Notificaciones
    document.getElementById('send-notifications').addEventListener('click', function () {
        // Simulación de la acción
        updateResultArea('Envío de notificaciones solicitado.');
    });

    function updateResultArea(message) {
        resultArea.innerHTML = `<p>${message}</p>`;
    }

    function updateScannerStatus(scannerId, status) {
        const badge = document.querySelector(`#scanner-status li:nth-child(${scannerId}) .badge`);
        badge.textContent = status;
        badge.className = `badge ${status === 'Activo' ? 'bg-success' : 'bg-danger'}`;
    }
});


