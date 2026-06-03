const formulario = document.getElementById('registroForm');
const listaClientes = document.getElementById('listaClientes');
const modalCliente = document.getElementById('modalCliente');
const btnNuevoCliente = document.getElementById('btnNuevoCliente');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const searchInput = document.getElementById('searchClientes');

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let clienteEditandoIndex = -1;

function mostrarClientes(filterTerm = '') {
    listaClientes.innerHTML = '';
    const termino = filterTerm.trim().toLowerCase();
    const clientesAMostrar = termino
        ? clientes.filter(cliente => {
            const nombreCompleto = `${cliente.nombres} ${cliente.apellidos}`.toLowerCase();
            const dni = cliente.dni.toLowerCase();
            return nombreCompleto.includes(termino) || dni.includes(termino);
        })
        : clientes;

    if (clientesAMostrar.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" class="text-center" style="padding: 30px; color: #888;">No hay clientes registrados en el sistema.</td>`;
        listaClientes.appendChild(tr);
        return;
    }

    clientes.forEach((cliente, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <span class="user-name">${cliente.nombres} ${cliente.apellidos}</span>
                    <span class="user-dni">DNI: ${cliente.dni}</span>
                </div>
            </td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-action btn-danger" onclick="eliminarCliente(${index})">Eliminar</button>
                </div>
            </td>
        `;
        listaClientes.appendChild(tr);
    });
}

function eliminarCliente(index) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        mostrarClientes();
    }
}

function editarCliente(index) {
    clienteEditandoIndex = index;
    const cliente = clientes[index];
    
    document.getElementById('nombres').value = cliente.nombres;
    document.getElementById('apellidos').value = cliente.apellidos;
    document.getElementById('dni').value = cliente.dni;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('email').value = cliente.email;
    
    document.querySelector('.modal-header h2').textContent = 'Editar Cliente';
    document.querySelector('.modal-footer button').textContent = 'Actualizar Cliente';
    
    modalCliente.classList.add('active');
}

btnNuevoCliente.addEventListener('click', () => {
    clienteEditandoIndex = -1;
    document.querySelector('.modal-header h2').textContent = 'Registrar Cliente';
    document.querySelector('.modal-footer button').textContent = 'Guardar Cliente';
    formulario.reset();
    modalCliente.classList.add('active');
});

btnCerrarModal.addEventListener('click', () => {
    modalCliente.classList.remove('active');
    formulario.reset();
    clienteEditandoIndex = -1;
});

window.addEventListener('click', (e) => {
    if (e.target === modalCliente) {
        modalCliente.classList.remove('active');
        formulario.reset();
        clienteEditandoIndex = -1;
    }
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;

    const clienteData = {
        nombres: nombres,
        apellidos: apellidos,
        dni: dni,
        telefono: telefono,
        email: email
    };

    if (clienteEditandoIndex === -1) {
        clientes.push(clienteData);
    } else {
        clientes[clienteEditandoIndex] = clienteData;
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));

    formulario.reset();
    clienteEditandoIndex = -1;
    modalCliente.classList.remove('active');
    mostrarClientes(searchInput ? searchInput.value : '');
});

if (searchInput) {
    searchInput.addEventListener('input', () => {
        mostrarClientes(searchInput.value);
    });
}

mostrarClientes(searchInput ? searchInput.value : '');
