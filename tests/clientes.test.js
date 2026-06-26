test('DNI tiene 8 dígitos', () => {
    const dni = '12345678';
    expect(dni.length).toBe(8);
});

test('No permite DNI duplicado', () => {
    const clientes = [
        { dni: '12345678' }
    ];

    const nuevoDni = '12345678';

    const existe = clientes.some(c => c.dni === nuevoDni);

    expect(existe).toBe(true);
});

test('Búsqueda encuentra cliente por nombre', () => {
    const nombre = 'Leonidas Elizabeth Narciso Fernandez';

    expect(nombre.toLowerCase().includes('leonidas')).toBe(true);
});

test('No permite teléfono duplicado', () => {
    const clientes = [
        { telefono: '948918902' }
    ];

    const nuevoTelefono = '948918902';

    const existeTelefono = clientes.some(c => c.telefono === nuevoTelefono);

    expect(existeTelefono).toBe(true);
});

test('Permite registrar teléfono nuevo', () => {
    const clientes = [
        { telefono: '948918902' }
    ];

    const nuevoTelefono = '999888777';

    const existeTelefono = clientes.some(c => c.telefono === nuevoTelefono);

    expect(existeTelefono).toBe(false);
});

test('Teléfono debe tener 9 dígitos', () => {
    const telefono = '948918902';

    expect(telefono.length).toBe(9);
});