// ============================================================
// MÓDULO: Gestión de Citas - feature/citas
// ============================================================

// ------------------------------------------------------------------
// DATOS: clientes de ejemplo (en producción se compartiría con clientes/index.js)
// ------------------------------------------------------------------
let clientes = [
    { nombre: 'Juan Pérez', telefono: '987654321' },
    { nombre: 'Carlos Ruiz', telefono: '912345678' },
    { nombre: 'Miguel Torres', telefono: '945678901' }
];

// ------------------------------------------------------------------
// DATOS: citas almacenadas en memoria
// ------------------------------------------------------------------
let citas = [];

// ------------------------------------------------------------------
// REFERENCIAS AL DOM
// ------------------------------------------------------------------
const formCita       = document.getElementById('formCita');
const clienteSelect  = document.getElementById('clienteSelect');
const servicioSelect = document.getElementById('servicio');
const fechaInput     = document.getElementById('fecha');
const horaInput      = document.getElementById('hora');
const listaCitas     = document.getElementById('listaCitas');
const fechaHoySpan   = document.getElementById('fechaHoy');

/**
 * Al cargar la página:
 * 1. Muestra la fecha de hoy en el encabezado.
 * 2. Pre-rellena el input de fecha con hoy.
 * 3. Carga los clientes en el select.
 * 4. Muestra la lista de citas.
 */
function init() {
    const hoy = obtenerFechaHoy();
    fechaHoySpan.textContent = formatearFechaMostrar(hoy);
    fechaInput.value = hoy;
    cargarClientesEnSelect();
    mostrarCitas('todos');
}

// UTILIDADES DE FECHA
/** Retorna la fecha de hoy en formato YYYY-MM-DD */
function obtenerFechaHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes  = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia  = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
}

/** Convierte YYYY-MM-DD a DD/MM/YYYY para mostrar al usuario */
function formatearFechaMostrar(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
}

// CLIENTES
/** Rellena el <select> de clientes con el arreglo de clientes */
function cargarClientesEnSelect() {
    // Limpiamos opciones previas (excepto el placeholder)
    clienteSelect.innerHTML = '<option value="">-- Selecciona un cliente --</option>';

    for (let i = 0; i < clientes.length; i++) {
        const option = document.createElement('option');
        option.value = clientes[i].nombre;
        option.textContent = clientes[i].nombre + ' (' + clientes[i].telefono + ')';
        clienteSelect.appendChild(option);
    }
}

// REGISTRAR CITA
formCita.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const cliente  = clienteSelect.value;
    const servicio = servicioSelect.value;
    const fecha    = fechaInput.value;
    const hora     = horaInput.value;

    // Validación básica (los inputs ya tienen required, pero verificamos igual)
    if (!cliente || !servicio || !fecha || !hora) {
        alert('Por favor completa todos los campos.');
        return;
    }

    // Creamos el objeto cita
    const nuevaCita = {
        id: Date.now(),        // ID único usando timestamp
        cliente: cliente,
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        estado: 'pendiente'    // Estado inicial siempre pendiente
    };

    // Guardamos la cita en el arreglo
    citas.push(nuevaCita);

    // Limpiamos el formulario (excepto fecha y hora)
    clienteSelect.value  = '';
    servicioSelect.value = '';

    // Actualizamos la vista con el filtro activo actual
    const filtroActivo = document.querySelector('.filtro-btn.active').dataset.filtro;
    mostrarCitas(filtroActivo);

    alert('Cita registrada correctamente.');
});

// MOSTRAR CITAS
/**
 * Renderiza las citas del DÍA DE HOY filtradas por estado.
 * @param {string} filtro - 'todos' | 'pendiente' | 'atendido' | 'cancelado'
 */
function mostrarCitas(filtro) {
    const hoy = obtenerFechaHoy();

    // Filtramos solo las citas de hoy
    let citasHoy = citas.filter(function (cita) {
        return cita.fecha === hoy;
    });

    // Aplicamos filtro de estado si no es 'todos'
    if (filtro !== 'todos') {
        citasHoy = citasHoy.filter(function (cita) {
            return cita.estado === filtro;
        });
    }

    // Limpiamos la lista
    listaCitas.innerHTML = '';

    if (citasHoy.length === 0) {
        listaCitas.innerHTML = '<p class="empty-msg">No hay citas para mostrar.</p>';
        return;
    }

    // Ordenamos por hora
    citasHoy.sort(function (a, b) {
        return a.hora.localeCompare(b.hora);
    });

    // Creamos una tarjeta por cada cita
    for (let i = 0; i < citasHoy.length; i++) {
        const cita = citasHoy[i];
        const tarjeta = crearTarjetaCita(cita);
        listaCitas.appendChild(tarjeta);
    }
}

// TARJETA DE CITA
/**
 * Crea y retorna el elemento HTML de una tarjeta de cita.
 * @param {object} cita - Objeto con los datos de la cita
 * @returns {HTMLElement}
 */
function crearTarjetaCita(cita) {
    const div = document.createElement('div');
    div.classList.add('cita-card');
    div.dataset.id = cita.id;

    // Agregamos clase según estado para el color del badge
    div.classList.add('estado-' + cita.estado);

    div.innerHTML = `
        <div class="cita-info">
            <div class="cita-hora">${cita.hora}</div>
            <div class="cita-detalle">
                <span class="cita-cliente">${cita.cliente}</span>
                <span class="cita-servicio">${cita.servicio}</span>
            </div>
            <span class="estado-badge estado-${cita.estado}">${capitalizarPrimera(cita.estado)}</span>
        </div>
        <div class="cita-acciones">
            <button class="btn-eliminar" onclick="eliminarCita(${cita.id})">Eliminar</button>
        </div>
    `;

    return div;
}

function capitalizarPrimera(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ELIMINAR CITA
/**
 * Elimina una cita del arreglo por su ID y actualiza la vista.
 * @param {number} id - ID único de la cita
 */
function eliminarCita(id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta cita?');
    if (!confirmacion) return;

    citas = citas.filter(function (cita) {
        return cita.id !== id;
    });

    const filtroActivo = document.querySelector('.filtro-btn.active').dataset.filtro;
    mostrarCitas(filtroActivo);
}


// Obtenemos todos los botones de filtro
const filtrosBtns = document.querySelectorAll('.filtro-btn');

filtrosBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        filtrosBtns.forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        mostrarCitas(btn.dataset.filtro);
    });
});

init();