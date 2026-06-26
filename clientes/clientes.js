const formulario = document.getElementById('registroForm');
const listaClientes = document.getElementById('listaClientes');
const modalCliente = document.getElementById('modalCliente');
const btnNuevoCliente = document.getElementById('btnNuevoCliente');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const confirmModal = document.getElementById('confirmModal');
const btnCerrarConfirm = document.getElementById('btnCerrarConfirm');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const alertModal = document.getElementById('alertModal');
const btnCerrarAlert = document.getElementById('btnCerrarAlert');
const btnAceptarAlert = document.getElementById('btnAceptarAlert');
const alertMessage = document.getElementById('alertMessage');
const searchInput = document.getElementById('searchClientes');

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let clienteEditandoIndex = -1;
let clienteEliminarIndex = -1;

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

    clientesAMostrar.forEach((cliente, index) => {
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
    clienteEliminarIndex = index;
    confirmModal.classList.add('active');
}

function cerrarConfirmModal() {
    clienteEliminarIndex = -1;
    confirmModal.classList.remove('active');
}

function mostrarAlertModal(mensaje) {
    alertMessage.textContent = mensaje;
    alertModal.classList.add('active');
}

function cerrarAlertModal() {
    alertModal.classList.remove('active');
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
    if (e.target === confirmModal) {
        cerrarConfirmModal();
    }
    if (e.target === alertModal) {
        cerrarAlertModal();
    }
});

btnCerrarConfirm.addEventListener('click', cerrarConfirmModal);
btnCancelarEliminar.addEventListener('click', cerrarConfirmModal);
btnConfirmarEliminar.addEventListener('click', () => {
    if (clienteEliminarIndex === -1) {
        return;
    }
    clientes.splice(clienteEliminarIndex, 1);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    cerrarConfirmModal();
    mostrarClientes(searchInput ? searchInput.value : '');
});

btnCerrarAlert.addEventListener('click', cerrarAlertModal);
btnAceptarAlert.addEventListener('click', cerrarAlertModal);

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
    const existeDNI = clientes.some(cliente => cliente.dni.toLowerCase() === dni.toLowerCase());
    if (existeDNI) {
        mostrarAlertModal('Ya existe un cliente registrado con este DNI');
        return;
    }

    const existeTelefono = clientes.some(cliente => cliente.telefono === telefono);
    if (existeTelefono) {
        mostrarAlertModal('Ya existe un cliente registrado con este número telefónico');
        return;
    }

    clientes.push(clienteData);
} else {
    const existeTelefono = clientes.some((cliente, index) =>
        index !== clienteEditandoIndex && cliente.telefono === telefono
    );

    if (existeTelefono) {
        mostrarAlertModal('Ya existe un cliente registrado con este número telefónico');
        return;
    }

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
