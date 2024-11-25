document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

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

        if (!response.ok) throw new Error('Token inválido o expirado');

        document.getElementById('private-content').style.display = 'block';
        initializePanel();
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Generar Reporte
    document.getElementById('generate-report').addEventListener('click', async () => {
        try {
            resultArea.innerHTML = `<p>Cargando registros de la bitácora...</p>`;
            const logs = await fetchLogs();
            displayLogs(logs);
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            resultArea.innerHTML = `<p class="text-danger">Ocurrió un error al intentar generar el reporte.</p>`;
        }
    });

    // Ver escáneres disponibles
    document.getElementById('view-scanners').addEventListener('click', async () => {
        try {
            const scanners = await fetchScanners();
            displayScanners(scanners);
        } catch (error) {
            console.error('Error al obtener los escáneres:', error);
            alert('No se pudieron obtener los escáneres disponibles.');
        }
    });

    // Activar y Desactivar Escáner
    document.getElementById('activate-scanner').addEventListener('click', () => toggleScanner(true));
    document.getElementById('deactivate-scanner').addEventListener('click', () => toggleScanner(false));
}

async function fetchLogs() {
    const token = localStorage.getItem('token');
    const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Error al obtener los logs');
    return response.json();
}

function displayLogs(logs) {
    const resultArea = document.getElementById('result-area');
    if (logs.length === 0) {
        resultArea.innerHTML = `<p>No hay registros en la bitácora.</p>`;
        return;
    }

    const table = document.createElement('table');
    table.className = 'table table-striped';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Email</th>
                <th>Acción</th>
                <th>Detalle</th>
            </tr>
        </thead>
        <tbody>
            ${logs.map(log => `
                <tr>
                    <td>${log.fechaHora ? new Date(log.fechaHora).toLocaleString() : 'Sin fecha'}</td>
                    <td>${log.email || 'Desconocido'}</td>
                    <td>${log.accion || 'Sin acción'}</td>
                    <td>${log.detalle || 'Sin detalle'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    resultArea.innerHTML = '';
    resultArea.appendChild(table);
}

async function fetchScanners() {
    const response = await fetch('https://package-acceptance-service.srv604097.hstgr.cloud/api/scanners', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Error al obtener los escáneres');
    return response.json();
}

function displayScanners(scanners) {
    const scannerStatus = document.getElementById('scanner-status');
    scannerStatus.innerHTML = scanners.map(scanner => `
        <li>
            Escáner ${scanner.id}: <span class="badge ${scanner.active ? 'bg-success' : 'bg-danger'}">
                ${scanner.active ? 'Activo' : 'Inactivo'}
            </span>
        </li>
    `).join('');
}

async function toggleScanner(enable) {
    const scannerId = document.getElementById('scanner-id').value;
    if (!scannerId) {
        alert('Por favor, ingresa un ID de escáner válido.');
        return;
    }

    try {
        const response = await fetch('https://package-acceptance-service.srv604097.hstgr.cloud/api/scanners/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: scannerId, action: enable ? 'activate' : 'deactivate' }),
        });

        if (!response.ok) throw new Error('Error al cambiar el estado del escáner');

        alert(`Escáner ${scannerId} ${enable ? 'activado' : 'desactivado'} exitosamente.`);
        const scanners = await fetchScanners();
        displayScanners(scanners);
    } catch (error) {
        console.error('Error al modificar el estado del escáner:', error);
        alert('No se pudo modificar el estado del escáner. Intenta nuevamente.');
    }
}