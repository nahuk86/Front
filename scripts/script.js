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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        console.log('Token válido. Mostrando el panel.');
        document.getElementById('private-content').style.display = 'block';

        // Inicializar funcionalidades del panel
        initializePanel();
    } catch (error) {
        console.error('Error de autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

// Función para inicializar las funcionalidades del panel
function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Botón Generar Reporte
    document.getElementById('generate-report').addEventListener('click', async () => {
        try {
            updateResultArea('Cargando registros de la bitácora...');
            const logs = await fetchLogs(); // Llama a la función para obtener los logs
            displayLogs(logs); // Muestra los logs en la tabla
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            alert('Ocurrió un error al intentar generar el reporte.');
        }
    });

    function updateResultArea(message) {
        resultArea.innerHTML = `<p>${message}</p>`;
    }
}

// Función para obtener los logs
async function fetchLogs() {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al obtener los logs:', errorData);
            alert('No se pudieron obtener los registros: ' + (errorData.message || 'Error desconocido.'));
            return [];
        }

        return response.json(); // Devuelve los datos de los logs
    } catch (error) {
        console.error('Error de red al obtener los logs:', error);
        alert('Error de red. Intenta nuevamente.');
        return [];
    }
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
            <th>Acción</th>
            <th>Detalle</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    logs.forEach((log) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.Fecha ? new Date(log.Fecha).toLocaleString() : 'Sin fecha'}</td>
            <td>${log.Email || 'Desconocido'}</td>
            <td>${log.Accion || 'Sin acción'}</td>
            <td>${log.Detalle || 'Sin detalle'}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    resultArea.appendChild(table); // Agrega la tabla al área de resultados
}
