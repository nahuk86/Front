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

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        document.getElementById('private-content').style.display = 'block';
        initializePanel();
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

function initializePanel() {
    const resultArea = document.getElementById('result-area');
    const scannerStatus = document.getElementById('scanner-status');

    // Ver escáneres disponibles
    document.getElementById('view-scanners').addEventListener('click', async () => {
        try {
            resultArea.innerHTML = `<p>Cargando escáneres disponibles...</p>`;
            const scanners = await fetchScanners();
            scannerStatus.innerHTML = scanners.map(scanner => `
                <li>
                    Escáner ${scanner.id}: <span class="badge ${scanner.active ? 'bg-success' : 'bg-danger'}">
                        ${scanner.active ? 'Activo' : 'Inactivo'}
                    </span>
                </li>
            `).join('');
        } catch (error) {
            console.error('Error al obtener los escáneres:', error);
            resultArea.innerHTML = `<p>Error al cargar los escáneres.</p>`;
        }
    });

    // Activar escáner
    document.getElementById('activate-scanner').addEventListener('click', async () => {
        const scannerId = document.getElementById('scanner-id').value;
        if (!scannerId) {
            alert('Por favor, ingresa un ID de escáner.');
            return;
        }
        await toggleScanner(scannerId, true);
    });

    // Desactivar escáner
    document.getElementById('deactivate-scanner').addEventListener('click', async () => {
        const scannerId = document.getElementById('scanner-id').value;
        if (!scannerId) {
            alert('Por favor, ingresa un ID de escáner.');
            return;
        }
        await toggleScanner(scannerId, false);
    });

    // Generar reporte de logs
    document.getElementById('generate-report').addEventListener('click', async () => {
        try {
            resultArea.innerHTML = `<p>Cargando registros de la bitácora...</p>`;
            const logs = await fetchLogs();
            displayLogs(logs);
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            resultArea.innerHTML = `<p>Error al cargar los registros.</p>`;
        }
    });
}

// Funciones auxiliares
async function fetchScanners() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/Scanners', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener escáneres');
    return response.json();
}

async function toggleScanner(scannerId, enable) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/Scanners/${scannerId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: enable }),
    });

    if (response.ok) {
        alert(`Escáner ${scannerId} ${enable ? 'activado' : 'desactivado'} exitosamente.`);
        document.getElementById('view-scanners').click();
    } else {
        alert(`Error al ${enable ? 'activar' : 'desactivar'} el escáner.`);
    }
}

async function fetchLogs() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/Logs', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener logs');
    return response.json();
}

function displayLogs(logs) {
    const resultArea = document.getElementById('result-area');
    if (logs.length === 0) {
        resultArea.innerHTML = '<p>No hay registros en la bitácora.</p>';
        return;
    }
    const table = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Detalle</th>
                </tr>
            </thead>
            <tbody>
                ${logs.map(log => `
                    <tr>
                        <td>${new Date(log.fecha).toLocaleString()}</td>
                        <td>${log.usuario || 'Desconocido'}</td>
                        <td>${log.accion || 'N/A'}</td>
                        <td>${log.detalle || 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    resultArea.innerHTML = table;
}
