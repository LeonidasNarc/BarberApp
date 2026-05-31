let clientes = [];

const formulario = document.getElementById('registroForm');
const listaClientes = document.getElementById('listaClientes');


formulario.addEventListener('submit', function (evento) {

    evento.preventDefault();
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const nombre = nombreInput.value;
    const telefono = telefonoInput.value;

    const nuevoCliente = {
        nombre: nombre,
        telefono: telefono
    };


    clientes.push(nuevoCliente);

    nombreInput.value = '';
    telefonoInput.value = '';

    mostrarClientes();
});

function mostrarClientes() {

    listaClientes.innerHTML = '';

    for (let i = 0; i < clientes.length; i++) {

        let cliente = clientes[i];
        let li = document.createElement('li');
        li.textContent = cliente.nombre + ' - ' + cliente.telefono;
        listaClientes.appendChild(li);
    }
}
