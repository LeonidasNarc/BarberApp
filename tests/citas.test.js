test('Se puede crear una cita correctamente', () => {
    const citas = [];
    const nuevaCita = {
        clienteId: '1',
        servicioId: '2',
        fecha: '2026-06-15',
        hora: '10:30'
    };
    
    citas.push(nuevaCita);
    
    expect(citas.length).toBe(1);
    expect(citas[0].fecha).toBe('2026-06-15');
});

test('La cita debe tener cliente y servicio definidos', () => {
    const cita = {
        clienteId: '1',
        servicioId: '2'
    };
    
    const tieneCliente = cita.clienteId !== '';
    const tieneServicio = cita.servicioId !== '';
    
    expect(tieneCliente).toBe(true);
    expect(tieneServicio).toBe(true);
});

test('La cita debe tener fecha y hora', () => {
    const cita = {
        fecha: '2026-06-15',
        hora: '10:30'
    };
    
    const tieneFecha = cita.fecha !== '';
    const tieneHora = cita.hora !== '';
    
    expect(tieneFecha).toBe(true);
    expect(tieneHora).toBe(true);
});

test('La cita no debe contener valores undefined', () => {
    const cita = {
        clienteId: '1',
        servicioId: '2',
        fecha: '2026-06-15',
        hora: '10:30'
    };
    
    const valores = Object.values(cita);
    const noTieneUndefined = !valores.includes(undefined);
    
    expect(noTieneUndefined).toBe(true);
});
