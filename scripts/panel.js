document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Verifica el token almacenado

    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Validar el token en el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Token inválido o expirado');

        // Si el token es válido, mostrar el panel
        document.getElementById('private-content').style.display = 'block';
        initializePanel();
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Elimina el token si es inválido
        window.location.href = 'login.html';
    }
});

function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Botón para generar reporte
    document.getElementById('generate-report').addEventListener('click', async () => {
        try {
            resultArea.innerHTML = `<p>Cargando registros de la bitácora...</p>`;
            const logs = await fetchLogs(); // Obtener los logs
            displayLogs(logs); // Mostrar logs en el frontend
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            resultArea.innerHTML = `<p class="text-danger">Ocurrió un error al intentar generar el reporte.</p>`;
        }
    });

    // Botones para activar y desactivar escáneres
    document.getElementById('activate-scanner').addEventListener('click', () => toggleScanner(true));
    document.getElementById('deactivate-scanner').addEventListener('click', () => toggleScanner(false));
}

async function fetchLogs() {
    const token = localStorage.getItem('token'); // Recupera el token
    const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Error al obtener los logs');
    return response.json(); // Devuelve los datos en formato JSON
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
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalle</th>
            </tr>
        </thead>
        <tbody>
            ${logs.map(log => `
                <tr>
                    <td>${log.fechaHora ? formatDate(log.fechaHora) : 'Sin fecha'}</td>
                    <td>${log.email || 'Desconocido'}</td>
                    <td>${log.accion || 'Sin acción'}</td>
                    <td>${log.detalle || 'Sin detalle'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    resultArea.innerHTML = ''; // Limpia el área de resultados
    resultArea.appendChild(table); // Agrega la tabla al área
}

async function toggleScanner(enable) {
    const scannerId = document.getElementById('scanner-id').value; // ID del escáner ingresado
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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}
