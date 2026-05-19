// tests/citas.test.js
// Prueba de integración: registro de una nueva cita
// Lógica extraída de citas/index.js para poder testearla
let citas = [];

function registrarCita(cliente, servicio, fecha, hora) {
    // Validación: todos los campos son obligatorios
    if (!cliente || !servicio || !fecha || !hora) {
        return { exito: false, mensaje: 'Todos los campos son obligatorios.' };
    }

    const nuevaCita = {
        id: Date.now(),
        cliente: cliente,
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        estado: 'pendiente'
    };

    citas.push(nuevaCita);

    return { exito: true, cita: nuevaCita };
}

function obtenerCitasDelDia(fecha) {
    return citas.filter(function (cita) {
        return cita.fecha === fecha;
    });
}

// PRUEBAS
// Limpiamos el arreglo antes de cada prueba
beforeEach(() => {
    citas = [];
});

// PRUEBA 1: Registrar una cita correctamente
test('Debe registrar una nueva cita con todos los datos', () => {
    const resultado = registrarCita('Juan Pérez', 'Corte de cabello', '2026-05-18', '10:00');

    expect(resultado.exito).toBe(true);
    expect(resultado.cita.cliente).toBe('Juan Pérez');
    expect(resultado.cita.servicio).toBe('Corte de cabello');
    expect(resultado.cita.fecha).toBe('2026-05-18');
    expect(resultado.cita.hora).toBe('10:00');
    expect(resultado.cita.estado).toBe('pendiente');
});

// PRUEBA 2: La cita queda guardada en el arreglo
test('La cita registrada debe aparecer en la lista del día', () => {
    registrarCita('Juan Pérez', 'Corte de cabello', '2026-05-18', '10:00');

    const citasHoy = obtenerCitasDelDia('2026-05-18');

    expect(citasHoy.length).toBe(1);
    expect(citasHoy[0].cliente).toBe('Juan Pérez');
});

// PRUEBA 3: No debe registrar una cita con campos vacíos
test('No debe registrar una cita si faltan datos', () => {
    const resultado = registrarCita('', 'Corte de cabello', '2026-05-18', '10:00');

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe('Todos los campos son obligatorios.');
    expect(citas.length).toBe(0);
});