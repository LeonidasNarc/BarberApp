const formulario = document.getElementById('registroForm');
const listaServicios = document.getElementById('listaServicios');
const modalServicio = document.getElementById('modalServicio');
const btnNuevoServicio = document.getElementById('btnNuevoServicio');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const confirmModal = document.getElementById('confirmModal');
const btnCerrarConfirm = document.getElementById('btnCerrarConfirm');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

let servicios = JSON.parse(localStorage.getItem('servicios')) || [];
let servicioEditandoIndex = -1;
let servicioEliminarIndex = -1;

function mostrarServicios() {
    listaServicios.innerHTML = '';

    if (servicios.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" class="text-center" style="padding: 30px; color: #888;">No hay servicios registrados en el sistema.</td>`;
        listaServicios.appendChild(tr);
        return;
    }

    servicios.forEach((servicio, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <span class="user-name">${servicio.nombre}</span>
                </div>
            </td>
            <td>$${parseFloat(servicio.precio).toFixed(2)}</td>
            <td>${servicio.descripcion}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action" onclick="editarServicio(${index})">Editar</button>
                    <button class="btn-action btn-danger" onclick="eliminarServicio(${index})">Eliminar</button>
                </div>
            </td>
        `;
        listaServicios.appendChild(tr);
    });
}

function eliminarServicio(index) {
    servicioEliminarIndex = index;
    confirmModal.classList.add('active');
}

function cerrarConfirmModal() {
    servicioEliminarIndex = -1;
    confirmModal.classList.remove('active');
}

function editarServicio(index) {
    servicioEditandoIndex = index;
    const servicio = servicios[index];
    
    document.getElementById('nombre').value = servicio.nombre;
    document.getElementById('precio').value = servicio.precio;
    document.getElementById('descripcion').value = servicio.descripcion;
    
    document.querySelector('.modal-header h2').textContent = 'Editar Servicio';
    document.querySelector('.modal-footer button').textContent = 'Actualizar Servicio';
    
    modalServicio.classList.add('active');
}

btnNuevoServicio.addEventListener('click', () => {
    servicioEditandoIndex = -1;
    document.querySelector('.modal-header h2').textContent = 'Registrar Servicio';
    document.querySelector('.modal-footer button').textContent = 'Guardar Servicio';
    formulario.reset();
    modalServicio.classList.add('active');
});

btnCerrarModal.addEventListener('click', () => {
    modalServicio.classList.remove('active');
    formulario.reset();
    servicioEditandoIndex = -1;
});

window.addEventListener('click', (e) => {
    if (e.target === modalServicio) {
        modalServicio.classList.remove('active');
        formulario.reset();
        servicioEditandoIndex = -1;
    }
    if (e.target === confirmModal) {
        cerrarConfirmModal();
    }
});

btnCerrarConfirm.addEventListener('click', cerrarConfirmModal);
btnCancelarEliminar.addEventListener('click', cerrarConfirmModal);
btnConfirmarEliminar.addEventListener('click', () => {
    if (servicioEliminarIndex === -1) {
        return;
    }
    servicios.splice(servicioEliminarIndex, 1);
    localStorage.setItem('servicios', JSON.stringify(servicios));
    cerrarConfirmModal();
    mostrarServicios();
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value;

    const servicioData = {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
    };

    if (servicioEditandoIndex === -1) {
        servicios.push(servicioData);
    } else {
        servicios[servicioEditandoIndex] = servicioData;
    }

    localStorage.setItem('servicios', JSON.stringify(servicios));

    formulario.reset();
    servicioEditandoIndex = -1;
    modalServicio.classList.remove('active');
    mostrarServicios();
});

mostrarServicios();
