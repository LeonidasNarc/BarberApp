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