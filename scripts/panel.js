document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Token inválido o expirado.');

        console.log('Token válido. Inicializando panel.');
        initializePanel(); // Inicializa el panel si el token es válido
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

// Función para inicializar el panel
function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Configura los botones y funcionalidades del panel
    document.getElementById('view-scanners').addEventListener('click', () => {
        updateResultArea('Mostrando escáneres disponibles...');
    });

    document.getElementById('activate-scanner').addEventListener('click', () => {
        updateResultArea('Escáner activado exitosamente.');
    });

    document.getElementById('deactivate-scanner').addEventListener('click', () => {
        updateResultArea('Escáner desactivado exitosamente.');
    });

    document.getElementById('generate-report').addEventListener('click', async () => {
        try {
            const logs = await fetchLogs();
            displayLogs(logs);
        } catch (error) {
            console.error('Error al generar reporte:', error);
            alert('Error al generar el reporte.');
        }
    });
}

// Función para actualizar el área de resultados
function updateResultArea(message) {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `<p>${message}</p>`;
}

// Función para obtener logs
async function fetchLogs() {
    const token = localStorage.getItem('token');
    const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Error al obtener logs.');

    return response.json();
}

// Función para mostrar logs
function displayLogs(logs) {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = '';

    if (!logs.length) {
        resultArea.innerHTML = '<p>No hay registros disponibles.</p>';
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
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(log.Fecha).toLocaleString()}</td>
            <td>${log.Email || 'Desconocido'}</td>
            <td>${log.Accion || 'Sin evento'}</td>
            <td>${log.Detalle || 'Sin detalle'}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    resultArea.appendChild(table);
}
