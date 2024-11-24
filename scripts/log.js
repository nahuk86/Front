// utils/log.js

// Función para registrar eventos en la bitácora
export async function logEvent(email, accion, detalle) {
    const token = localStorage.getItem('token'); // Obtén el token desde localStorage

    const logEntry = {
        Email: email,        // Correo del usuario autenticado
        Accion: accion,      // Acción registrada (Ej: "Inicio de sesión")
        Detalle: detalle,    // Detalles adicionales del evento
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
            console.log('Evento registrado en la bitácora.');
        } else {
            console.error('Error al registrar el evento en la bitácora:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar el log:', error);
    }
}
