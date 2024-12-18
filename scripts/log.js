// utils/log.js

export async function logEvent(email, accion, detalle) {
    const token = localStorage.getItem('token'); // Obtén el token desde localStorage

    if (!email || !accion || !detalle) {
        console.error('Error: Parámetros inválidos para registrar el evento.');
        return;
    }

    if (!token) {
        console.error('Error: No se encontró un token en el almacenamiento local.');
        return;
    }

    const logEntry = {
        Email: email,
        Accion: accion,
        Detalle: detalle,
        Fecha: new Date().toISOString(), // Fecha actual en formato ISO
    };

    try {
        const response = await fetch('https://mdw-back-ops20241124110904.azurewebsites.net/api/Bitacora/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Token JWT para autenticación
            },
            body: JSON.stringify(logEntry),
        });

        if (response.ok) {
            console.log('Evento registrado en la bitácora:', logEntry);
        } else {
            const errorResponse = await response.json();
            console.error('Error al registrar el evento en la bitácora:', errorResponse.message || response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar el log:', error);
    }
}
