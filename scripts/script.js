document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token con el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Token JWT
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Inicializa las funcionalidades del panel
        console.log('Acceso autorizado al panel.');
        initializePanel();

    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpia el token si es inválido
        window.location.href = 'login.html';
    }
});

// Función para inicializar las funcionalidades del panel
function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Botón Ver Escáneres Disponibles
    document.getElementById('view-scanners').addEventListener('click', function () {
        updateResultArea('Mostrando escáneres disponibles...');
    });

    // Botón Activar Escáner
    document.getElementById('activate-scanner').addEventListener('click', function () {
        updateResultArea('Escáner activado exitosamente.');
        updateScannerStatus(1, 'Activo');
    });

    // Botón Desactivar Escáner
    document.getElementById('deactivate-scanner').addEventListener('click', function () {
        updateResultArea('Escáner desactivado exitosamente.');
        updateScannerStatus(1, 'Inactivo');
    });

    // Botón Generar Reporte
    document.getElementById('generate-report').addEventListener('click', async function () {
        try {
            const logs = await fetchLogs(); // Llama a la función para obtener los logs
            displayLogs(logs); // Muestra los logs en la tabla
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            alert('Ocurrió un error al intentar generar el reporte.');
        }
    });

    // Actualiza el área de resultados
    function updateResultArea(message) {
        resultArea.innerHTML = `<p>${message}</p>`;
    }

    function updateScannerStatus(scannerId, status) {
        const badge = document.querySelector(`#scanner-status li:nth-child(${scannerId}) .badge`);
        badge.textContent = status;
        badge.className = `badge ${status === 'Activo' ? 'bg-success' : 'bg-danger'}`;
    }
}

// Función para obtener los logs
async function fetchLogs() {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

    const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los logs.');
    }

    return response.json(); // Devuelve los datos de los logs
}

// Función para mostrar los logs en la tabla
function displayLogs(logs) {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = ''; // Limpia el área de resultados

    if (logs.length === 0) {
        resultArea.innerHTML = '<p>No hay registros en la bitácora.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th>Detalle</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    logs.forEach((log) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Sin fecha'}</td>
            <td>${log.user || 'Desconocido'}</td>
            <td>${log.action || 'Sin evento'}</td>
            <td>${log.description || 'Sin detalle'}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    resultArea.appendChild(table); // Agrega la tabla al área de resultados
}
