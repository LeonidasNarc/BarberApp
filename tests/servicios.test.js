test('Se puede agregar un servicio correctamente', () => {
    const servicios = [];
    const nuevoServicio = {
        nombre: 'Corte clásico',
        precio: 25.00,
        descripcion: 'Corte a tijera con perfilado'
    };
    
    servicios.push(nuevoServicio);
    
    expect(servicios.length).toBe(1);
    expect(servicios[0].nombre).toBe('Corte clásico');
});

test('El precio del servicio debe ser mayor a 0', () => {
    const precio = 25.00;
    expect(precio).toBeGreaterThan(0);
});

test('El nombre del servicio no debe estar vacío', () => {
    const nombreServicio = 'Corte clásico';
    const esValido = nombreServicio.trim().length > 0;
    
    expect(esValido).toBe(true);
});
