const formulario = document.getElementById('registroForm');
const listaCitas = document.getElementById('listaCitas');
const modalCita = document.getElementById('modalCita');
const btnNuevaCita = document.getElementById('btnNuevaCita');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const confirmModal = document.getElementById('confirmModal');
const btnCerrarConfirm = document.getElementById('btnCerrarConfirm');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const alertModal = document.getElementById('alertModal');
const btnCerrarAlert = document.getElementById('btnCerrarAlert');
const btnAceptarAlert = document.getElementById('btnAceptarAlert');
const alertMessage = document.getElementById('alertMessage');
const searchInput = document.getElementById('searchCitas');

const selectCliente = document.getElementById('clienteId');
const selectServicio = document.getElementById('servicioId');

let citas = JSON.parse(localStorage.getItem('citas')) || [];
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let servicios = JSON.parse(localStorage.getItem('servicios')) || [];

let citaEliminarIndex = -1;
let citaEditandoIndex = -1;

function cargarSelects() {
    selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
    clientes.forEach((cliente, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${cliente.nombres} ${cliente.apellidos} - DNI: ${cliente.dni}`;
        selectCliente.appendChild(option);
    });

    selectServicio.innerHTML = '<option value="">Seleccione un servicio</option>';
    servicios.forEach((servicio, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${servicio.nombre} - $${parseFloat(servicio.precio).toFixed(2)}`;
        selectServicio.appendChild(option);
    });
}

function mostrarCitas(filterTerm = '') {
    listaCitas.innerHTML = '';
    const termino = filterTerm.trim().toLowerCase();
    
    const citasAMostrar = citas.map((cita, index) => {
        const cliente = clientes[cita.clienteId] || { nombres: 'Cliente', apellidos: 'Eliminado', dni: '---' };
        const servicio = servicios[cita.servicioId] || { nombre: 'Servicio Eliminado' };
        return {
            ...cita,
            originalIndex: index,
            clienteNombre: `${cliente.nombres} ${cliente.apellidos}`,
            clienteDni: cliente.dni,
            servicioNombre: servicio.nombre
        };
    }).filter(cita => {
        if (!termino) return true;
        return cita.clienteNombre.toLowerCase().includes(termino) || 
               cita.servicioNombre.toLowerCase().includes(termino);
    });

    if (citasAMostrar.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" class="text-center" style="padding: 30px; color: #888;">No hay citas registradas en el sistema.</td>`;
        listaCitas.appendChild(tr);
        return;
    }

    citasAMostrar.forEach(cita => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <span class="user-name">${cita.clienteNombre}</span>
                    <span class="user-dni">DNI: ${cita.clienteDni}</span>
                </div>
            </td>
            <td>${cita.servicioNombre}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action" onclick="editarCita(${cita.originalIndex})">Editar</button>
                    <button class="btn-action btn-danger" onclick="eliminarCita(${cita.originalIndex})">Eliminar</button>
                </div>
            </td>
        `;
        listaCitas.appendChild(tr);
    });
}

function editarCita(index) {
    citaEditandoIndex = index;
    const cita = citas[index];
    
    document.getElementById('clienteId').value = cita.clienteId;
    document.getElementById('servicioId').value = cita.servicioId;
    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('hora').value = cita.hora;
    
    document.querySelector('.modal-header h2').textContent = 'Editar Cita';
    document.querySelector('.modal-footer button').textContent = 'Actualizar Cita';
    
    modalCita.classList.add('active');
}

function eliminarCita(index) {
    citaEliminarIndex = index;
    confirmModal.classList.add('active');
}

function cerrarConfirmModal() {
    citaEliminarIndex = -1;
    confirmModal.classList.remove('active');
}

function mostrarAlertModal(mensaje) {
    alertMessage.textContent = mensaje;
    alertModal.classList.add('active');
}

function cerrarAlertModal() {
    alertModal.classList.remove('active');
}

btnNuevaCita.addEventListener('click', () => {
    if (clientes.length === 0) {
        mostrarAlertModal('Debe registrar al menos un cliente antes de crear una cita.');
        return;
    }
    if (servicios.length === 0) {
        mostrarAlertModal('Debe registrar al menos un servicio antes de crear una cita.');
        return;
    }
    
    citaEditandoIndex = -1;
    document.querySelector('.modal-header h2').textContent = 'Registrar Cita';
    document.querySelector('.modal-footer button').textContent = 'Guardar Cita';
    formulario.reset();
    modalCita.classList.add('active');
});

btnCerrarModal.addEventListener('click', () => {
    modalCita.classList.remove('active');
    formulario.reset();
    citaEditandoIndex = -1;
});

window.addEventListener('click', (e) => {
    if (e.target === modalCita) {
        modalCita.classList.remove('active');
        formulario.reset();
        citaEditandoIndex = -1;
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
    if (citaEliminarIndex === -1) {
        return;
    }
    citas.splice(citaEliminarIndex, 1);
    localStorage.setItem('citas', JSON.stringify(citas));
    cerrarConfirmModal();
    mostrarCitas(searchInput ? searchInput.value : '');
});

btnCerrarAlert.addEventListener('click', cerrarAlertModal);
btnAceptarAlert.addEventListener('click', cerrarAlertModal);

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    
    const clienteId = document.getElementById('clienteId').value;
    const servicioId = document.getElementById('servicioId').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const citaData = {
        clienteId: clienteId,
        servicioId: servicioId,
        fecha: fecha,
        hora: hora
    };

    if (citaEditandoIndex === -1) {
        citas.push(citaData);
    } else {
        citas[citaEditandoIndex] = citaData;
    }

    localStorage.setItem('citas', JSON.stringify(citas));

    formulario.reset();
    citaEditandoIndex = -1;
    modalCita.classList.remove('active');
    mostrarCitas(searchInput ? searchInput.value : '');
});

if (searchInput) {
    searchInput.addEventListener('input', () => {
        mostrarCitas(searchInput.value);
    });
}

cargarSelects();
mostrarCitas(searchInput ? searchInput.value : '');

window.addEventListener('storage', function(e) {
    if (e.key === 'clientes') {
        clientes = JSON.parse(e.newValue) || [];
        cargarSelects();
        mostrarCitas(searchInput ? searchInput.value : '');
    }
    if (e.key === 'servicios') {
        servicios = JSON.parse(e.newValue) || [];
        cargarSelects();
        mostrarCitas(searchInput ? searchInput.value : '');
    }
});
