document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Obtiene el token desde localStorage

    // Verifica si el token no existe
    if (!token) {
        alert('No estás autenticado. Redirigiendo al inicio de sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Valida el token en el backend
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Account/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Verifica si el token es inválido o expirado
        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        // Si la validación es exitosa, muestra el panel
        console.log('Token válido. Mostrando panel.');
        document.getElementById('private-content').style.display = 'block';
        initializePanel(); // Inicializa las funcionalidades del panel
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpia el token si es inválido
        window.location.href = 'login.html';
    }
});

// Función para inicializar las funcionalidades del panel
function initializePanel() {
    const resultArea = document.getElementById('result-area');

    // Botón: Ver Escáneres Disponibles
    document.getElementById('view-scanners').addEventListener('click', async () => {
        try {
            updateResultArea('Cargando lista de escáneres...');
            const scanners = await fetchScanners();
            displayScanners(scanners);
        } catch (error) {
            console.error('Error al obtener la lista de escáneres:', error);
            updateResultArea('Error al cargar la lista de escáneres.');
        }
    });

    // Botón: Activar Escáner
    document.getElementById('activate-scanner').addEventListener('click', async () => {
        try {
            const scannerId = prompt('Ingrese el ID del escáner que desea activar:');
            if (scannerId) {
                await updateScannerStatus(scannerId, true);
                updateResultArea(`Escáner ${scannerId} activado exitosamente.`);
            }
        } catch (error) {
            console.error('Error al activar el escáner:', error);
            updateResultArea('Error al activar el escáner.');
        }
    });

    // Botón: Desactivar Escáner
    document.getElementById('deactivate-scanner').addEventListener('click', async () => {
        try {
            const scannerId = prompt('Ingrese el ID del escáner que desea desactivar:');
            if (scannerId) {
                await updateScannerStatus(scannerId, false);
                updateResultArea(`Escáner ${scannerId} desactivado exitosamente.`);
            }
        } catch (error) {
            console.error('Error al desactivar el escáner:', error);
            updateResultArea('Error al desactivar el escáner.');
        }
    });

    // Actualiza el área de resultados
    function updateResultArea(message) {
        resultArea.innerHTML = `<p>${message}</p>`;
    }

    // Función para obtener los escáneres disponibles
    async function fetchScanners() {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Scanners', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener los escáneres.');
        }

        return response.json();
    }

    // Función para mostrar los escáneres
    function displayScanners(scanners) {
        if (!scanners || scanners.length === 0) {
            updateResultArea('No hay escáneres disponibles.');
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Estado</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        scanners.forEach((scanner) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${scanner.id}</td>
                <td>${scanner.active ? 'Activo' : 'Inactivo'}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        resultArea.innerHTML = '';
        resultArea.appendChild(table);
    }

    // Función para actualizar el estado de un escáner
    async function updateScannerStatus(scannerId, isActive) {
        const response = await fetch(`https://mdw-back-ops20241124110904.azurewebsites.net/api/Scanners/${scannerId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: isActive }),
        });

        if (!response.ok) {
            throw new Error('No se pudo actualizar el estado del escáner.');
        }
    }
}
