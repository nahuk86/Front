document.addEventListener('DOMContentLoaded', function () {
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
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión nuevamente.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const logs = await response.json();
                displayLogs(logs); // Muestra los registros obtenidos
            } else {
                const errorData = await response.json();
                alert(`Error al generar el reporte: ${errorData.message || 'Error desconocido.'}`);
            }
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            alert('Ocurrió un error al intentar generar el reporte.');
        }
    });

    // Funciones auxiliares
    function updateResultArea(message) {
        resultArea.innerHTML = `<p>${message}</p>`;
    }

    function updateScannerStatus(scannerId, status) {
        const badge = document.querySelector(`#scanner-status li:nth-child(${scannerId}) .badge`);
        badge.textContent = status;
        badge.className = `badge ${status === 'Activo' ? 'bg-success' : 'bg-danger'}`;
    }

    function displayLogs(logs) {
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
});
