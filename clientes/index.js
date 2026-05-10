// Arreglo temporal para almacenar los clientes. 
let clientes = [];

// Obtenemos las referencias a los elementos del HTML que vamos a utilizar
const formulario = document.getElementById('registroForm');
const listaClientes = document.getElementById('listaClientes');

// Escuchamos el evento 'submit'
formulario.addEventListener('submit', function (evento) {
    // Evitamos que la página se recargue automáticamente al enviar el formulario
    evento.preventDefault();

    // Obtenemos los elementos de los inputs usando sus IDs
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');

    // Obtenemos el valor de texto que el usuario escribió
    const nombre = nombreInput.value;
    const telefono = telefonoInput.value;

    // Creamos un objeto cliente con los datos ingresados
    const nuevoCliente = {
        nombre: nombre,
        telefono: telefono
    };

    // Agregamos el nuevo cliente 
    clientes.push(nuevoCliente);

    // Limpiamos los campos del formulario 
    nombreInput.value = '';
    telefonoInput.value = '';

    // Actualizar la lista
    mostrarClientes();
});

// Función para mostrar los clientes en el HTML
function mostrarClientes() {
    // Limpiamos la lista actual en el HTML para no duplicar datos al agregar uno nuevo
    listaClientes.innerHTML = '';

    // Recorremos el arreglo de clientes
    for (let i = 0; i < clientes.length; i++) {
        // Obtenemos el cliente actual del ciclo
        let cliente = clientes[i];

        // Creamos un nuevo elemento de lista (<li>)
        let li = document.createElement('li');

        // Le asignamos el texto que mostrará
        li.textContent = cliente.nombre + ' - ' + cliente.telefono;

        // Agregamos el elemento <li> a la lista
        listaClientes.appendChild(li);
    }
}
