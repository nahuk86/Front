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
        startLongPolling(); // Inicia la lógica de long polling
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Escáneres
    document.getElementById('activate-scanner').addEventListener('click', () => toggleScanner(true));
    document.getElementById('deactivate-scanner').addEventListener('click', () => toggleScanner(false));
}

// Long Polling: Actualiza los logs periódicamente
async function startLongPolling() {
    const token = localStorage.getItem('token');

    try {
        while (true) {
            const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Error al obtener datos de la API.');

            const logs = await response.json();
            console.log('Respuesta recibida:', logs);

            updateLogs(logs); // Actualiza los logs en el frontend

            // Espera 5 segundos antes de realizar otra solicitud
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Error durante el long polling:', error);
    }
}

// Actualiza los logs en el frontend
function updateLogs(logs) {
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
                <th>Usuario</th>
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

// Cambiar el estado del escáner (activar/desactivar)
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
    } catch (error) {
        console.error('Error al modificar el estado del escáner:', error);
        alert('No se pudo modificar el estado del escáner. Intenta nuevamente.');
    }
}
