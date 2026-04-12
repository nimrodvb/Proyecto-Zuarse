// VARIABLES GLOBALES
const SECRET_KEY = 'zuarse_secret_2024'; // Necesario para crear contraseñas de empleados
let productoEditando = null;
let productosCargados = [];
let clienteEditando = null;
let pedidoVisualizando = null;
let categoriaEditando = null;
let categoriasCargadas = [];
let proveedorEditando = null;
let compraEditando = null;
let empleadoEditando = null;
let pedidoActualId = null;
let pedidoActualData = null;
// ================================================================================== DETALLE TEMPORAL DE LA COMPRA =================================================================
let detalleCompraActual = [];



// FUNCIONES DE SESIÓN
function cerrarSesionAdmin() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('sesion_zuarse');
        sessionStorage.removeItem('sesion_zuarse');
        window.location.href = 'login.html';
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos primero
    try { configurarEventos(); } catch(e) { console.error('configurarEventos:', e); }
    try { cargarProductos(); } catch(e) { console.error('cargarProductos:', e); }
    try { cargarInventario(); } catch(e) { console.error('cargarInventario:', e); }
    try { cargarClientes(); } catch(e) { console.error('cargarClientes:', e); }
    try { cargarCategorias(); } catch(e) { console.error('cargarCategorias:', e); }
    try { cargarProveedores(); } catch(e) { console.error('cargarProveedores:', e); }
    try { cargarCompras(); } catch(e) { console.error('cargarCompras:', e); }
    try { cargarPedidos(); } catch(e) { console.error('cargarPedidos:', e); }
    try { cargarNotificaciones(); } catch(e) { console.error('cargarNotificaciones:', e); }
    try { mostrarResumenNotificaciones(); } catch(e) { console.error('mostrarResumenNotificaciones:', e); }
    try { cargarDashboard(); } catch(e) { console.error('cargarDashboard:', e); }
    try { cargarEquipo(); } catch(e) { console.error('cargarEquipo:', e); }
    

    const btnX = document.querySelector('.close-modal');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnGuardarEstado = document.getElementById('btn-guardar-estado');
    const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
    const btnEnviarEmail = document.getElementById('btn-enviar-email');

if (btnEnviarEmail) {
    btnEnviarEmail.addEventListener('click', enviarPedidoPorEmail);
}

if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener('click', descargarPedidoPDF);
}

    if (btnX) btnX.addEventListener('click', cerrarModalPedido);
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalPedido);
    if (btnGuardarEstado) btnGuardarEstado.addEventListener('click', actualizarEstadoPedido);
    try {
    const selectCategoriaCompra = document.getElementById('compra-categoria-select');

    if (selectCategoriaCompra) {
        selectCategoriaCompra.addEventListener('change', filtrarProductosCompra);
    }

} catch (e) {
    console.error('evento categoria compra:', e);
}


// ================================================================================== EVENTO CAMBIO DE PRODUCTO EN COMPRAS =================================================================
try {
    const selectProductoCompra = document.getElementById('compra-producto-select');

    if (selectProductoCompra) {
        selectProductoCompra.addEventListener('change', cargarPrecioProductoCompra);
    }

} catch (e) {
    console.error('evento producto compra:', e);
}

});

// ============================================================================================================ CONFIGURAR EVENTOS ========================================================
function configurarEventos() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', cambiarTab);
    });

    // Productos
    const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
    const cancelarProducto = document.getElementById('cancelar-producto');
    const formularioProducto = document.getElementById('formulario-producto');
    if (btnNuevoProducto) btnNuevoProducto.addEventListener('click', mostrarFormProducto);
    if (cancelarProducto) cancelarProducto.addEventListener('click', ocultarFormProducto);
    if (formularioProducto) formularioProducto.addEventListener('submit', guardarProducto);
    const filtroProdNombre = document.getElementById('filtro-producto-nombre');
    const filtroProdCategoria = document.getElementById('filtro-producto-categoria');
    if (filtroProdNombre) filtroProdNombre.addEventListener('input', cargarProductos);
    if (filtroProdCategoria) filtroProdCategoria.addEventListener('input', cargarProductos);
    // Filtro de inventario por categoría
    const filtroInventarioCat = document.getElementById('filtro-inventario-categoria');
    if (filtroInventarioCat) filtroInventarioCat.addEventListener('change', cargarInventario);

    // Clientes
    const btnNuevoCliente = document.getElementById('btn-nuevo-cliente');
    const cancelarCliente = document.getElementById('cancelar-cliente');
    const formularioCliente = document.getElementById('formulario-cliente');
    if (btnNuevoCliente) btnNuevoCliente.addEventListener('click', mostrarFormCliente);
    if (cancelarCliente) cancelarCliente.addEventListener('click', ocultarFormCliente);
    if (formularioCliente) formularioCliente.addEventListener('submit', guardarCliente);
    const filtroCliente = document.getElementById('filtro-cliente-nombre');
    if (filtroCliente) filtroCliente.addEventListener('input', cargarClientes);

    // Categorías
    const btnNuevaCategoria = document.getElementById('btn-nueva-categoria');
    const cancelarCategoria = document.getElementById('cancelar-categoria');
    const formularioCategoria = document.getElementById('formulario-categoria');
    if (btnNuevaCategoria) btnNuevaCategoria.addEventListener('click', mostrarFormCategoria);
    if (cancelarCategoria) cancelarCategoria.addEventListener('click', ocultarFormCategoria);
    if (formularioCategoria) formularioCategoria.addEventListener('submit', guardarCategoria);
    const filtroCategoria = document.getElementById('filtro-categoria-nombre');
    if (filtroCategoria) filtroCategoria.addEventListener('input', cargarCategorias);

    // Notificaciones
        
    // Proveedores
    const btnNuevoProveedor = document.getElementById('btn-nuevo-proveedor');
    const cancelarProveedor = document.getElementById('cancelar-proveedor');
    const formularioProveedor = document.getElementById('formulario-proveedor');
    if (btnNuevoProveedor) btnNuevoProveedor.addEventListener('click', mostrarFormProveedor);
    if (cancelarProveedor) cancelarProveedor.addEventListener('click', ocultarFormProveedor);
    if (formularioProveedor) formularioProveedor.addEventListener('submit', guardarProveedor);
    const filtroProveedorNombre = document.getElementById('filtro-proveedor-nombre');
    if (filtroProveedorNombre) filtroProveedorNombre.addEventListener('input', cargarProveedores);

    // Compras
    const btnNuevaCompra = document.getElementById('btn-nueva-compra');
    const cancelarCompra = document.getElementById('cancelar-compra');
    const formularioCompra = document.getElementById('formulario-compra');
    const selectCatCompra = document.getElementById('compra-categoria-select');
    const btnAddProdCompra = document.getElementById('btn-add-prod-compra');
    if (btnNuevaCompra) btnNuevaCompra.addEventListener('click', mostrarFormCompra);
    if (cancelarCompra) cancelarCompra.addEventListener('click', ocultarFormCompra);
    if (formularioCompra) formularioCompra.addEventListener('submit', guardarCompra);
    if (selectCatCompra) selectCatCompra.addEventListener('change', filtrarProductosCompra);
    if (btnAddProdCompra) btnAddProdCompra.addEventListener('click', agregarProductoACompra);
    const filtroCompraProveedor = document.getElementById('filtro-compra-proveedor');
    if (filtroCompraProveedor) filtroCompraProveedor.addEventListener('input', cargarCompras);

    // Pedidos
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroPedidoProducto = document.getElementById('filtro-pedido-producto');
    const filtroPedidoCategoria = document.getElementById('filtro-pedido-categoria');

    if (filtroEstado) {
        filtroEstado.addEventListener('change', cargarPedidos);
    }
    if (filtroPedidoProducto) filtroPedidoProducto.addEventListener('input', cargarPedidos);
    if (filtroPedidoCategoria) filtroPedidoCategoria.addEventListener('input', cargarPedidos);
    
    const closeModal = document.querySelector('.close-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnGuardarEstado = document.getElementById('btn-guardar-estado');
    
    if (closeModal) closeModal.addEventListener('click', cerrarModalPedido);
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalPedido);
    if (btnGuardarEstado) btnGuardarEstado.addEventListener('click', guardarEstadoPedido);

    // Equipo (Empleados)
    const btnNuevoEmpleado = document.getElementById('btn-nuevo-empleado');
    const cancelarEmpleado = document.getElementById('cancelar-empleado');
    const formularioEmpleado = document.getElementById('formulario-empleado');
    if (btnNuevoEmpleado) btnNuevoEmpleado.addEventListener('click', mostrarFormEmpleado);
    if (cancelarEmpleado) cancelarEmpleado.addEventListener('click', ocultarFormEmpleado);
    if (formularioEmpleado) formularioEmpleado.addEventListener('submit', guardarEmpleado);

    const filtroInventarioCategoria = document.getElementById('filtro-inventario-categoria');

if (filtroInventarioCategoria) {
    filtroInventarioCategoria.addEventListener('change', cargarInventario);
}
}

// ==================== NAVEGACIÓN DE TABS ====================
function cambiarTab(e) {
    const tabBtn = e.currentTarget;
    const tabNombre = tabBtn.dataset.tab;

    // Remover active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Agregar active al seleccionado
    tabBtn.classList.add('active');
    document.getElementById(tabNombre).classList.add('active');
}

// =============================================================================================================== PRODUCTOS ===============================================================================
function mostrarFormProducto() {
    productoEditando = null;
    document.getElementById('formulario-producto').reset();
    document.getElementById('form-producto').style.display = 'block';
    document.querySelector('#form-producto h3').textContent = 'Nuevo Producto';
}

function ocultarFormProducto() {
    document.getElementById('form-producto').style.display = 'none';
    document.getElementById('formulario-producto').reset();
    productoEditando = null;
}

//---------------------------------------------------------------------------------------------GUARDAR PRODUCTO---------------------------------------------------------------------------


// Función para guardar o actualizar un producto en la base de datos
async function guardarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById('prod-nombre').value.trim();
    const descripcion = document.getElementById('prod-descripcion').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const imagen = document.getElementById('prod-imagen').value.trim() || 'images/default.png';
    const stock = parseInt(document.getElementById('prod-stock').value) || 0;
    const categoriaId = parseInt(document.getElementById('prod-categoria').value);

    if (!nombre) {
        alert('El nombre del producto es obligatorio');
        return;
    }

    if (isNaN(precio)) {
        alert('Debes ingresar un precio válido');
        return;
    }

    if (isNaN(categoriaId)) {
        alert('Debes seleccionar una categoría');
        return;
    }

    try {
        let respuesta;
        const esEdicion = !!productoEditando;

        if (esEdicion) {
            respuesta = await fetch(`/api/productos/${productoEditando.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    imagen,
                    stock,
                    categoriaId
                })
            });
        } else {
            respuesta = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    imagen,
                    stock,
                    categoriaId
                })
            });
        }

        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudo guardar el producto');
        }

        ocultarFormProducto();
        cargarProductos();
        cargarInventario();
        cargarDashboard()

        alert(esEdicion ? 'Producto actualizado correctamente' : 'Producto guardado correctamente');

    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert(error.message || 'Error al guardar el producto');
    }
}



//--------------------------------------------------------------------------------------------- CARGAR PRODUCTO ---------------------------------------------------------------------------

// Función para cargar los productos desde la base de datos
async function cargarProductos() {
    // Obtiene referencias a los elementos del DOM
    const tbody = document.getElementById('tbody-productos');
    const sinProductos = document.getElementById('sin-productos');
    const filtroNombreInput = document.getElementById('filtro-producto-nombre');
    const filtroCategoriaInput = document.getElementById('filtro-producto-categoria');

    // Obtiene los valores de los filtros
    const filtroNombre = filtroNombreInput ? filtroNombreInput.value.toLowerCase().trim() : '';
    const filtroCategoria = filtroCategoriaInput ? filtroCategoriaInput.value.toLowerCase().trim() : '';

    // Si no existe el tbody, termina
    if (!tbody) return;

    // Limpia la tabla antes de volver a llenarla
    tbody.innerHTML = '';

    try {
        // Hace la petición al backend para obtener los productos
        const respuesta = await fetch('/api/productos');

        // Convierte la respuesta a JSON
        const data = await respuesta.json();

        // Valida si la respuesta fue exitosa
        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los productos');
        }

        // Convierte los datos al formato que usa el frontend
        const productos = (data.productos || []).map(p => ({
            id: p.ID,
            nombre: p.NOMBRE,
            descripcion: p.DESCRIPCION,
            precio: parseFloat(p.PRECIO) || 0,
            stock: p.STOCK || 0,
            imagen: p.URL_IMAGEN,
            categoriaId: p.ID_CATEGORIA,
            categoria: p.CATEGORIA
        }));

        productosCargados = productos;

        // Aplica filtros por nombre y categoría
        const productosFiltrados = productos.filter(p => {
            const coincideNombre = p.nombre.toLowerCase().includes(filtroNombre);
            const coincideCategoria = (p.categoria || '').toLowerCase().includes(filtroCategoria);
            return coincideNombre && coincideCategoria;
        });

        // Si no hay productos filtrados, muestra mensaje
        if (productosFiltrados.length === 0) {
            if (sinProductos) {
                sinProductos.style.display = 'block';
                sinProductos.textContent =
                    productos.length === 0
                        ? 'No hay productos aún. ¡Crea uno nuevo!'
                        : 'No se encontraron productos con esos criterios.';
            }
            return;
        }

        // Si hay productos, oculta el mensaje vacío
        if (sinProductos) sinProductos.style.display = 'none';

        // Recorre los productos y los agrega a la tabla
        productosFiltrados.forEach(producto => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>#${producto.id}</td>
                <td>${escapeHtml(producto.nombre)}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.stock}</td>
                <td>${escapeHtml(producto.categoria || '-')}</td>
                <td>
                    <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        // Muestra error en consola
        console.error('Error al cargar productos:', error);

        // Limpia la tabla por seguridad
        tbody.innerHTML = '';

        // Muestra mensaje de error
        if (sinProductos) {
            sinProductos.style.display = 'block';
            sinProductos.textContent = 'Error al cargar los productos desde la base de datos.';
        }
    }
}




//---------------------------------------------------------------------------------------------EDITAR PRODUCTO---------------------------------------------------------------------------


// Función para preparar la edición de un producto
function editarProducto(id) {
    const producto = productosCargados.find(p => p.id === id);

    if (!producto) {
        alert('No se encontró el producto a editar');
        return;
    }

    productoEditando = producto;

    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-descripcion').value = producto.descripcion || '';
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen || '';
    document.getElementById('prod-stock').value = producto.stock;
    document.getElementById('prod-categoria').value = producto.categoriaId;

    const titulo = document.querySelector('#form-producto h3');
    if (titulo) titulo.textContent = 'Editar Producto';

    const cont = document.getElementById('form-producto');
    if (cont) cont.style.display = 'block';
}




//--------------------------------------------------------------------------------------------- ELIMINAR PRODUCTO ---------------------------------------------------------------------------


// Función para eliminar un producto desde la base de datos
async function eliminarProducto(id) {
    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
        // Hace la petición al backend para eliminar el producto
        const respuesta = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });

        // Convierte la respuesta a JSON
        const data = await respuesta.json();

        // Si hubo error, lanza excepción
        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudo eliminar el producto');
        }

        // Recarga la tabla de productos
        cargarProductos();

        // Recarga el inventario por si depende de los productos
        cargarInventario();

        // Muestra mensaje de éxito
        alert('Producto eliminado correctamente');

    } catch (error) {
        // Muestra el error en consola
        console.error('Error al eliminar producto:', error);

        // Muestra mensaje al usuario
        alert(error.message || 'Error al eliminar el producto');
    }
}






// ================================================================================================================ INVENTARIO ==============================================================
/**
 * Módulo de Inventario.
 * Proporciona una vista de solo lectura del stock de los productos.
 * Permite filtrar por categoría y ordena los productos por la cantidad de stock más baja primero.
 */


const filtroCat = document.getElementById('filtro-inventario-categoria');

async function cargarInventario() {
    const tbodyInventario = document.getElementById('tbody-inventario');
    const sinInventario = document.getElementById('sin-inventario');
    const filtroCategoria = document.getElementById('filtro-inventario-categoria');

    try {
        const categoriaSeleccionada = filtroCategoria ? filtroCategoria.value : '';

        let url = 'http://localhost:3000/api/inventario';

        if (categoriaSeleccionada) {
            url += `?categoria=${categoriaSeleccionada}`;
        }

        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (!data.ok) {
            tbodyInventario.innerHTML = `
                <tr>
                    <td colspan="3">Error al cargar inventario.</td>
                </tr>
            `;
            sinInventario.style.display = 'none';
            return;
        }

        const inventario = data.inventario;

        if (!inventario || inventario.length === 0) {
            tbodyInventario.innerHTML = '';
            sinInventario.style.display = 'block';
            return;
        }

        sinInventario.style.display = 'none';

        tbodyInventario.innerHTML = inventario.map(p => `
            <tr>
                <td>${p.NOMBRE}</td>
                <td>${p.CATEGORIA}</td>
                <td style=" font-weight: bold;
                color: ${p.STOCK <= 10 ? 'red' : p.STOCK <= 20 ? 'orange' : 'green'} ">
                ${p.STOCK}
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al cargar inventario:', error);
    }
}



// ================================================================================================================ INVENTARIO ==============================================================





// ================================================================================================================= CLIENTES =====================================================================================                                                      local


// -------------------------------------------------------------------------------------------------- MOSTRAR CLIENTE------------------------------------------------------------------------------------------
function mostrarFormCliente() {
    // Limpia el cliente en edición
    clienteEditando = null;

    // Limpia el formulario
    document.getElementById('formulario-cliente').reset();

    // Muestra el formulario
    document.getElementById('form-cliente').style.display = 'block';

    // Cambia el título
    document.querySelector('#form-cliente h3').textContent = 'Nuevo Cliente';
}

// Función para ocultar el formulario de cliente
function ocultarFormCliente() {
    // Oculta el formulario
    document.getElementById('form-cliente').style.display = 'none';

    // Limpia los campos
    document.getElementById('formulario-cliente').reset();

    // Limpia el modo edición
    clienteEditando = null;
}



// ---------------------------------------------------------------------------------------------------- GUARDAR CLIENTE--------------------------------------------------------------------------------------
async function guardarCliente(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();

    // Crea un objeto con los datos del formulario
    const cliente = {
        nombre: document.getElementById('cli-nombre').value,
        correo: document.getElementById('cli-email').value,
        telefono: document.getElementById('cli-telefono').value,
        direccion: document.getElementById('cli-direccion').value,
        ciudad: document.getElementById('cli-ciudad').value,
        estado: document.getElementById('cli-estado').value
    };

    try {
        // Variable para guardar la respuesta del backend
        let respuesta;

        // Muestra en consola qué ID se va a usar para guardar
        console.log("clienteEditando:", clienteEditando);
        console.log("datos enviados:", cliente);

        // Si existe un ID en clienteEditando, entonces se actualiza
        if (clienteEditando) {
            respuesta = await fetch(`/api/clientes/${clienteEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        } else {
            // Si no existe ID, se crea un cliente nuevo
            respuesta = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }

        // Convierte la respuesta a JSON
        const resultado = await respuesta.json();

        // Muestra la respuesta del backend en consola
        console.log("respuesta backend:", resultado);

        // Si el backend devolvió error, lo muestra
        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al guardar cliente');
            return;
        }

        // Limpia la variable de edición
        clienteEditando = null;

        // Limpia el formulario
        document.getElementById('formulario-cliente').reset();

        // Recarga la tabla
        await cargarClientes();

        // Oculta el formulario
        ocultarFormCliente();

        // Devuelve el título original
        document.querySelector('#form-cliente h3').textContent = 'Formulario de Cliente';

        // Mensaje de éxito
        alert('Cliente guardado exitosamente');

    } catch (error) {
        // Muestra error real en consola
        console.error('Error al guardar cliente:', error);
        alert('Error al guardar cliente');
    }
}


// -------------------------------------------------------------------------------------------- CARGAR CLIENTES EN TABLA --------------------------------------------------------------------------------
async function cargarClientes() {
    const tbody = document.getElementById('tbody-clientes');
    const sinClientes = document.getElementById('sin-clientes');
    const filtroInput = document.getElementById('filtro-cliente-nombre');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    try {
        // Pide al backend la lista de clientes
        const respuesta = await fetch('/api/clientes');
        const clientes = await respuesta.json();

        // Filtra por nombre si hay texto en el buscador
        const clientesFiltrados = clientes.filter(c =>
            c.NOMBRE.toLowerCase().includes(filtro)
        );

        // Si no hay resultados, muestra mensaje
        if (clientesFiltrados.length === 0) {
            sinClientes.style.display = 'block';
            sinClientes.textContent = clientes.length === 0
                ? 'No hay clientes aún. ¡Agrega uno nuevo!'
                : 'No se encontraron clientes con ese nombre.';
            return;
        }

        sinClientes.style.display = 'none';

        // Recorre los clientes y arma las filas de la tabla
        clientesFiltrados.forEach(cliente => {

        console.log(cliente);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${cliente.ID}</td>
                <td>${cliente.NOMBRE}</td>
                <td>${cliente.CORREO || '-'}</td>
                <td>${cliente.TELEFONO || '-'}</td>
                <td>${cliente.DIRECCION || '-'}</td>
                <td>${cliente.CIUDAD || '-'}</td>
                <td><span class="estado-${cliente.ESTADO}">${cliente.ESTADO || '-'}</span></td>
                <td>
                    <button class="btn-editar" onclick="editarCliente(${cliente.ID})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarCliente(${cliente.ID})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar clientes:', error);
        sinClientes.style.display = 'block';
        sinClientes.textContent = 'Error al cargar clientes desde la base de datos.';
    }
}



// ----------------------------------------------------------------------------------------- LLENAR EL FORMULARIO DE CLIENTE -----------------------------------------------------------------------------
async function editarCliente(id) {
    try {
        // Pide al backend los datos del cliente
        const respuesta = await fetch(`/api/clientes/${id}`);
        const cliente = await respuesta.json();

        if (!cliente || cliente.ok === false) return;

        // Guarda el ID del cliente en edición
        clienteEditando = cliente.ID;

        // Llena el formulario con los datos actuales
        document.getElementById('cli-nombre').value = cliente.NOMBRE || '';
        document.getElementById('cli-email').value = cliente.CORREO || '';
        document.getElementById('cli-telefono').value = cliente.TELEFONO || '';
        document.getElementById('cli-direccion').value = cliente.DIRECCION || '';
        document.getElementById('cli-ciudad').value = cliente.CIUDAD || '';
        document.getElementById('cli-estado').value = cliente.ESTADO || 'activo';

        // Muestra el formulario en modo edición
        document.querySelector('#form-cliente h3').textContent = 'Editar Cliente';
        document.getElementById('form-cliente').style.display = 'block';

    } catch (error) {
        console.error('Error al cargar cliente para editar:', error);
        alert('Error al cargar cliente');
    }
}




// --------------------------------------------------------------------------------------------- ELIMINAR CLIENTE -----------------------------------------------------------------------------------------
async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

    try {
        // Envía la solicitud de eliminación al backend
        const respuesta = await fetch(`/api/clientes/${id}`, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al eliminar cliente');
            return;
        }

        // Recarga la tabla luego de eliminar
        cargarClientes();

    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar cliente');
    }
}




// ================================================================================================== CATEGORÍAS ============================================================================================
function mostrarFormCategoria() {
    categoriaEditando = null;
    const form = document.getElementById('formulario-categoria');
    if (form) form.reset();
    const cont = document.getElementById('form-categoria');
    if (cont) cont.style.display = 'block';
    const titulo = document.querySelector('#form-categoria h3');
    if (titulo) titulo.textContent = 'Nueva Categoría';
}

function ocultarFormCategoria() {
    const cont = document.getElementById('form-categoria');
    if (cont) cont.style.display = 'none';
    const form = document.getElementById('formulario-categoria');
    if (form) form.reset();
    categoriaEditando = null;
}


//------------------------------------------------------------------------------------------------ GUARDAR O ACTUALIZAR CATEGORIA ----------------------------------------------------------------------------------------



// Función para guardar una categoría
// Función para guardar o actualizar una categoría
async function guardarCategoria(e) {
    e.preventDefault();

    const nombre = document.getElementById('cat-nombre').value.trim();
    const descripcion = document.getElementById('cat-descripcion').value.trim();

    if (!nombre) {
        alert('El nombre de la categoría es obligatorio');
        return;
    }

    try {
        let respuesta;
        let data;

        // Guarda si estamos editando para usarlo después en el mensaje
        const esEdicion = !!categoriaEditando;

        if (esEdicion) {
            respuesta = await fetch(`/api/categorias/${categoriaEditando.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion
                })
            });
        } else {
            respuesta = await fetch('/api/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion
                })
            });
        }

        data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudo guardar la categoría');
        }

        ocultarFormCategoria();
        cargarCategorias();

        alert(esEdicion ? 'Categoría actualizada correctamente' : 'Categoría guardada exitosamente');

    } catch (error) {
        console.error('Error al guardar categoría:', error);
        alert(error.message || 'Error al guardar la categoría');
    }
}




//------------------------------------------------------------------------------------------------ CARGAR CATEGORIAS ----------------------------------------------------------------------------------------


// Función para cargar las categorías desde la base de datos
async function cargarCategorias() {
    // Obtiene referencias a los elementos del DOM
    const tbody = document.getElementById('tbody-categorias');
    const sinCategorias = document.getElementById('sin-categorias');
    const prodSelect = document.getElementById('prod-categoria');
    const filtroInventarioSelect = document.getElementById('filtro-inventario-categoria');
    const filtroInput = document.getElementById('filtro-categoria-nombre');

    // Obtiene el texto del filtro de búsqueda
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    // Si no existe el tbody, no continúa
    if (!tbody) return;

    // Limpia el contenido actual de la tabla
    tbody.innerHTML = '';

    try {
        // Hace una petición al backend para obtener las categorías
        const respuesta = await fetch('/api/categorias');

        // Convierte la respuesta a JSON
        const data = await respuesta.json();

        // Si el backend respondió con error, lanza excepción
        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar las categorías');
        }

        // Convierte la data del backend al formato que usa tu frontend
        // SQL Server devuelve columnas en mayúscula: ID, NOMBRE, DESCRIPCION
        const categorias = (data.categorias || []).map(c => ({
            id: c.ID,
            nombre: c.NOMBRE,
            descripcion: c.DESCRIPCION
        }));

        categoriasCargadas = categorias;

        // Actualizar select de categorías en formulario de producto

        if (prodSelect) {
    if (categorias.length === 0) {
        prodSelect.innerHTML = '<option value="">-- Ninguna --</option>';
    } else {
        prodSelect.innerHTML =
            '<option value="">-- Selecciona categoría --</option>' +
            categorias.map(c => `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`).join('');
    }
}



        // Actualizar select del filtro de inventario
        if (filtroInventarioSelect) {
            const valorActual = filtroInventarioSelect.value;

            if (categorias.length === 0) {
                filtroInventarioSelect.innerHTML = '<option value="">Todas las categorías</option>';
            } else {
                filtroInventarioSelect.innerHTML =
                    '<option value="">Todas las categorías</option>' +
                    categorias.map(c => `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`).join('');
            }

            // Intenta conservar el valor seleccionado previamente
            if (valorActual) {
                filtroInventarioSelect.value = valorActual;
            }
        }

        // Aplica el filtro por nombre
        const categoriasFiltradas = categorias.filter(c =>
            c.nombre.toLowerCase().includes(filtro)
        );

        // Si no hay resultados, muestra mensaje
        if (categoriasFiltradas.length === 0) {
            if (sinCategorias) {
                sinCategorias.style.display = 'block';
                sinCategorias.textContent =
                    categorias.length === 0
                        ? 'No hay categorías aún. ¡Crea una nueva!'
                        : 'No se encontraron categorías con ese nombre.';
            }
            return;
        }

        // Si sí hay categorías, oculta el mensaje vacío
        if (sinCategorias) sinCategorias.style.display = 'none';

        // Recorre las categorías filtradas y las agrega a la tabla
        categoriasFiltradas.forEach(c => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>#${c.id}</td>
                <td>${escapeHtml(c.nombre)}</td>
                <td>${escapeHtml(c.descripcion || '-')}</td>
                <td>
                    <button class="btn-editar" onclick="editarCategoria(${c.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarCategoria(${c.id})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        // Muestra el error en consola
        console.error('Error al cargar categorías:', error);

        // Limpia la tabla por seguridad
        tbody.innerHTML = '';

        // Muestra mensaje de error
        if (sinCategorias) {
            sinCategorias.style.display = 'block';
            sinCategorias.textContent = 'Error al cargar las categorías desde la base de datos.';
        }
    }
}



//------------------------------------------------------------------------------------------------ EDITAR CATEGORIA ----------------------------------------------------------------------------------------


function editarCategoria(id) {
    const cat = categoriasCargadas.find(c => c.id === id);

    if (!cat) {
        alert('No se encontró la categoría a editar');
        return;
    }

    categoriaEditando = cat;

    document.getElementById('cat-nombre').value = cat.nombre;
    document.getElementById('cat-descripcion').value = cat.descripcion || '';

    const titulo = document.querySelector('#form-categoria h3');
    if (titulo) titulo.textContent = 'Editar Categoría';

    const cont = document.getElementById('form-categoria');
    if (cont) cont.style.display = 'block';
}



//------------------------------------------------------------------------------------------------ ELIMINAR CATEGORIA ----------------------------------------------------------------------------------------


// Función para eliminar una categoría desde la base de datos
async function eliminarCategoria(id) {
    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    try {
        // Hace la petición al backend para eliminar la categoría
        const respuesta = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE'
        });

        // Convierte la respuesta a JSON
        const data = await respuesta.json();

        // Si hubo error, lanza excepción
        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudo eliminar la categoría');
        }

        // Recarga la tabla desde la base de datos
        cargarCategorias();

        // Muestra mensaje de éxito
        alert('Categoría eliminada correctamente');

    } catch (error) {
        // Muestra el error en consola
        console.error('Error al eliminar categoría:', error);

        // Muestra mensaje al usuario
        alert(error.message || 'Error al eliminar la categoría');
    }
}




function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
}




// =================================================================================================== NOTIFICACIONES =======================================================================================



async function cargarNotificaciones() {
    const tbody = document.getElementById('tbody-notificaciones');
    const sinNotificaciones = document.getElementById('sin-notificaciones');

    if (!tbody) return;

    tbody.innerHTML = '';

    try {
        const respuesta = await fetch('http://localhost:3000/api/notificaciones');
        const data = await respuesta.json();

        if (!data.ok) {
            sinNotificaciones.style.display = 'block';
            sinNotificaciones.textContent = 'Error al cargar notificaciones.';
            return;
        }

        const notificaciones = data.notificaciones || [];

        if (notificaciones.length === 0) {
            sinNotificaciones.style.display = 'block';
            sinNotificaciones.textContent = 'No hay notificaciones de pedidos. Los pedidos aparecerán aquí.';
            return;
        }

        sinNotificaciones.style.display = 'none';

        notificaciones.forEach(p => {
            const productos = p.DESCRIPCION
                ? p.DESCRIPCION.split('|').map(x => x.trim()).join(', ')
                : 'Sin productos';

            const cantidad = p.DESCRIPCION
                ? p.DESCRIPCION.split('|').length
                : 0;

            const fila = document.createElement('tr');

           fila.innerHTML = `
    <td><strong>${p.CLIENTE}</strong></td>
    <td>${formatearFechaNotificacion(p.FECHA)}</td>
    <td>#PED-${p.ID}</td>
    <td>${productos}</td>
    <td>
        <span style="
            background:${(p.ESTADO || '').toLowerCase() === 'pendiente' ? '#f0ad4e' : '#5bc0de'};
            color:white;
            padding:5px 10px;
            border-radius:20px;
            font-weight:bold;
            display:inline-block;
            min-width:100px;
            text-align:center;
        ">
            ${p.ESTADO}
        </span>
    </td>
    <td>
        <span style="
            background:#6c7ae0;
            color:white;
            padding:5px 10px;
            border-radius:20px;
            font-weight:bold;
            display:inline-block;
            min-width:32px;
            text-align:center;
        ">
            ${cantidad}
        </span>
    </td>
    <td><strong>₡${parseFloat(p.TOTAL).toFixed(2)}</strong></td>
`;

            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        sinNotificaciones.style.display = 'block';
        sinNotificaciones.textContent = 'Error al cargar notificaciones.';
    }
}

function formatearFechaNotificacion(fecha) {
    if (!fecha) return '-';

    const f = new Date(fecha);
    if (isNaN(f.getTime())) return fecha;

    return f.toLocaleDateString('es-CR');
}


async function mostrarResumenNotificaciones() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/notificaciones');
        const data = await respuesta.json();

        if (!data.ok) return;

        const notificaciones = data.notificaciones || [];

        const pendientes = notificaciones.filter(p =>
            (p.ESTADO || '').toLowerCase() === 'pendiente'
        ).length;

        const procesando = notificaciones.filter(p =>
            (p.ESTADO || '').toLowerCase() === 'procesando'
        ).length;

        if (pendientes === 0 && procesando === 0) return;

        alert(
            `📦 Resumen de pedidos\n\n` +
            `Pendientes: ${pendientes}\n` +
            `Procesando: ${procesando}`
        );

    } catch (error) {
        console.error('Error al mostrar resumen de notificaciones:', error);
    }
}



// ==================================================================================================== PROVEEDORES ======================================================================

// Variable global para saber si estamos editando
//let proveedorEditando = null;

// -----------------------------------------------------------------------------------------------------
// MOSTRAR FORMULARIO
// -----------------------------------------------------------------------------------------------------
function mostrarFormProveedor() {
    proveedorEditando = null;

    document.getElementById('formulario-proveedor').reset();
    document.getElementById('form-proveedor').style.display = 'block';

    document.querySelector('#form-proveedor h3').textContent = 'Nuevo Proveedor';
}

// -----------------------------------------------------------------------------------------------------
// OCULTAR FORMULARIO
// -----------------------------------------------------------------------------------------------------
function ocultarFormProveedor() {
    document.getElementById('form-proveedor').style.display = 'none';
    document.getElementById('formulario-proveedor').reset();
    proveedorEditando = null;
}

// -----------------------------------------------------------------------------------------------------
// GUARDAR PROVEEDOR (CREAR O EDITAR)
// -----------------------------------------------------------------------------------------------------
async function guardarProveedor(e) {
    e.preventDefault();

    const nombre = document.getElementById('prov-nombre').value.trim();
    const direccion = document.getElementById('prov-direccion').value.trim();
    const telefono = document.getElementById('prov-telefono').value.trim();

    if (!nombre) {
        alert('El nombre del proveedor es obligatorio');
        return;
    }

    try {
        let respuesta;
        let resultado;

        // ================= EDITAR =================
        if (proveedorEditando) {

            respuesta = await fetch(`http://localhost:3000/api/proveedores/${proveedorEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    direccion,
                    telefono
                })
            });

            resultado = await respuesta.json();
        }

        // ================= CREAR =================
        else {
            respuesta = await fetch('http://localhost:3000/api/proveedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    direccion,
                    telefono
                })
            });

            resultado = await respuesta.json();
        }

        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al guardar proveedor');
            return;
        }

        ocultarFormProveedor();
        cargarProveedores();
        alert(resultado.mensaje || 'Proveedor guardado correctamente');

    } catch (error) {
        console.error("Error guardando proveedor:", error);
        alert("Error en servidor");
    }
}

// -----------------------------------------------------------------------------------------------------
// CARGAR PROVEEDORES DESDE SQL SERVER
// -----------------------------------------------------------------------------------------------------
async function cargarProveedores() {

    const tbody = document.getElementById('tbody-proveedores');
    const sinProveedores = document.getElementById('sin-proveedores');
    const filtroInput = document.getElementById('filtro-proveedor-nombre');

    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    try {
        const res = await fetch('http://localhost:3000/api/proveedores');
        const data = await res.json();

        if (!data.ok || !data.proveedores || data.proveedores.length === 0) {
            sinProveedores.style.display = 'block';
            sinProveedores.textContent = 'No hay proveedores aún. ¡Crea uno nuevo!';
            return;
        }

        let proveedores = data.proveedores;

        // FILTRO POR NOMBRE
        proveedores = proveedores.filter(p =>
            (p.NOMBRE || '').toLowerCase().includes(filtro)
        );

        if (proveedores.length === 0) {
            sinProveedores.style.display = 'block';
            sinProveedores.textContent = 'No se encontraron proveedores con ese nombre.';
            return;
        }

        sinProveedores.style.display = 'none';

        proveedores.forEach(prov => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>#${prov.ID}</td>
                <td><strong>${escapeHtml(prov.NOMBRE || '')}</strong></td>
                <td>${escapeHtml(prov.DIRECCION || '') || '-'}</td>
                <td>${escapeHtml(prov.TELEFONO || '') || '-'}</td>
                <td>${prov.FECHA ? String(prov.FECHA).split('T')[0].split('-').reverse().join('/') : ''}</td>
                <td>
                    <button class="btn-editar" onclick="editarProveedor(${prov.ID})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarProveedor(${prov.ID})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error cargando proveedores:", error);
        sinProveedores.style.display = 'block';
    }
}

// -----------------------------------------------------------------------------------------------------
// EDITAR PROVEEDOR
// -----------------------------------------------------------------------------------------------------
async function editarProveedor(id) {

    try {
        const res = await fetch(`http://localhost:3000/api/proveedores/${id}`);
        const prov = await res.json();

        if (!prov) return;

        proveedorEditando = id;

        document.getElementById('prov-nombre').value = prov.NOMBRE;
        document.getElementById('prov-direccion').value = prov.DIRECCION || '';
        document.getElementById('prov-telefono').value = prov.TELEFONO || '';

        document.querySelector('#form-proveedor h3').textContent = 'Editar Proveedor';
        document.getElementById('form-proveedor').style.display = 'block';

    } catch (error) {
        console.error("Error cargando proveedor:", error);
    }
}

// -----------------------------------------------------------------------------------------------------
// ELIMINAR PROVEEDOR
// -----------------------------------------------------------------------------------------------------
async function eliminarProveedor(id) {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
        const res = await fetch(`http://localhost:3000/api/proveedores/${id}`, {
            method: 'DELETE'
        });

        const resultado = await res.json();

        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al eliminar');
            return;
        }

        cargarProveedores();
        alert('Proveedor eliminado correctamente');

    } catch (error) {
        console.error("Error eliminando proveedor:", error);
    }
}



// ====================================================================================================== COMPRAS =========================================================================



// --------------------------------------------------------------------------------------- MOSTRAR FORMULARIO DE COMPRA --------------------------------------------------------------------
async function mostrarFormCompra() {
    // 🔹 Reiniciar variable de edición
    compraEditando = null;

    // 🔹 Resetear formulario
    const form = document.getElementById('formulario-compra');
    if (form) form.reset();

    // 🔹 Limpiar campos calculados
    const campoProductos = document.getElementById('compra-productos');
    const campoTotal = document.getElementById('compra-total');

    if (campoProductos) campoProductos.value = '';
    if (campoTotal) campoTotal.value = '';

        // 🔹 Reiniciar arreglo temporal de productos de la compra
    detalleCompraActual = [];

    // 🔹 Cargar proveedores desde el backend
    try {
        const response = await fetch('/api/proveedores');
        const data = await response.json();

        const selectProveedor = document.getElementById('compra-proveedor');

        if (selectProveedor) {
            selectProveedor.innerHTML = '<option value="">-- Selecciona proveedor --</option>';

            if (data.ok && Array.isArray(data.proveedores)) {
                data.proveedores.forEach(proveedor => {
                    const option = document.createElement('option');

                    // 🔹 value = ID del proveedor
                    option.value = proveedor.ID;

                    // 🔹 texto visible = nombre del proveedor
                    option.textContent = proveedor.NOMBRE;

                    selectProveedor.appendChild(option);
                });
            }
        }

    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        alert('No se pudieron cargar los proveedores');
    }

    // 🔹 Cargar categorías desde el backend
    await cargarCategoriasCompra();

    // 🔹 Cargar productos iniciales
    await filtrarProductosCompra();

    // 🔹 Poner la fecha actual por defecto
    const dateInput = document.getElementById('compra-fecha');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // 🔹 Mostrar el contenedor del formulario
    const cont = document.getElementById('form-compra');
    if (cont) cont.style.display = 'block';

    // 🔹 Cambiar el título
    const titulo = document.querySelector('#form-compra h3');
    if (titulo) titulo.textContent = 'Registrar Compra';
}

// --------------------------------------------------------------------------------------- OCULTAR FORMULARIO DE COMPRA ---------------------------------------------------------------------------------------
function ocultarFormCompra() {
    // 🔹 Ocultar contenedor del formulario
    const cont = document.getElementById('form-compra');
    if (cont) cont.style.display = 'none';

    // 🔹 Resetear formulario
    const form = document.getElementById('formulario-compra');
    if (form) form.reset();

    // 🔹 Limpiar variable de edición
    compraEditando = null;
}


// --------------------------------------------------------------------------------------- GUARDAR COMPRA EN BD ---------------------------------------------------------------------------------------
// ================================================================================== GUARDAR COMPRA EN BD Y ENVIAR DETALLE =================================================================
async function guardarCompra(e) {
    e.preventDefault(); // 🔹 Evita que el formulario recargue la página

    // 🔹 Obtener valores del formulario
    const proveedor = document.getElementById('compra-proveedor').value;
    const idFactura = document.getElementById('compra-id-factura').value.trim();
    const fecha = document.getElementById('compra-fecha').value;
    const productosTexto = document.getElementById('compra-productos').value.trim();
    const total = parseFloat(document.getElementById('compra-total').value || 0);

    // 🔹 Validar que haya productos agregados
    if (!productosTexto || total <= 0 || detalleCompraActual.length === 0) {
        alert('Debes agregar al menos un producto a la compra.');
        return;
    }

    // 🔹 Validar campos obligatorios
    if (!proveedor || !idFactura || !fecha) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }

    try {
        // 🔹 Enviar datos al backend
        const response = await fetch('/api/compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                factura: idFactura,                  // FACTURA_ELECTRONICA
                proveedor: proveedor,                // ID_PROVEEDOR
                fecha: fecha,                        // FECHA
                descripcion: productosTexto,         // DESCRIPCION
                total: total,                        // TOTAL
                productos: detalleCompraActual       // 🔥 detalle real para aumentar stock
            })
        });

        const data = await response.json();

        // 🔹 Validar respuesta del servidor
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'Error al guardar la compra');
        }

        // 🔹 Limpiar arreglo temporal
        detalleCompraActual = [];

        // 🔹 Limpiar formulario
        ocultarFormCompra();

        // 🔹 Recargar lista
        cargarCompras();

        // 🔹 Recargar Dashboard
        cargarDashboard()

        // 🔹 Recargar inventario para ver el stock actualizado
        try { cargarInventario(); } catch (e) { console.error('cargarInventario:', e); }

        // 🔹 Mensaje de éxito
        alert('Compra registrada correctamente y stock actualizado');
        cargarProductos();

    } catch (error) {
        console.error('Error al guardar compra:', error);
        alert('Error al guardar la compra');
    }
}



// --------------------------------------------------------------------------------------- CARGAR COMPRAS DESDE BD ---------------------------------------------------------------------------------------
async function cargarCompras() {
    // 🔹 Referencias del HTML
    const tbody = document.getElementById('tbody-compras');
    const sinCompras = document.getElementById('sin-compras');
    const filtroInput = document.getElementById('filtro-compra-proveedor');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    // 🔹 Si no existe la tabla, salir
    if (!tbody) return;

    // 🔹 Limpiar contenido actual
    tbody.innerHTML = '';

    try {
        // 🔹 Pedir compras al backend
        const response = await fetch('/api/compras');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar las compras');
        }

        // 🔹 Obtener arreglo de compras
        let compras = data.compras || [];

        // 🔹 Filtrar por nombre del proveedor si el usuario escribió algo
        if (filtro) {
            compras = compras.filter(c =>
                (c.PROVEEDOR || '').toLowerCase().includes(filtro)
            );
        }

        // 🔹 Si no hay compras, mostrar mensaje
        if (compras.length === 0) {
            if (sinCompras) {
                sinCompras.style.display = 'block';
                sinCompras.textContent = 'No hay compras registradas.';
            }
            return;
        }

        // 🔹 Ocultar mensaje vacío
        if (sinCompras) sinCompras.style.display = 'none';

        // 🔹 Recorrer compras y dibujar filas
        compras.forEach(c => {
            const row = document.createElement('tr');
            row.className = 'compra-row';

            row.innerHTML = `
                <td>
                #${c.ID} <br>
                <small>${c.FACTURA_ELECTRONICA || ''}</small>
                </td>
                <td>${c.PROVEEDOR || 'Sin proveedor'}</td>
                <td>${c.FECHA ? new Date(c.FECHA).toLocaleDateString() : ''}</td>
                <td>${c.DESCRIPCION || ''}</td>
                <td>₡${parseFloat(c.TOTAL || 0).toFixed(2)}</td>
                <td>
                    
                    <button class="btn-eliminar" onclick="eliminarCompra(${c.ID})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar compras:', error);

        if (sinCompras) {
            sinCompras.style.display = 'block';
            sinCompras.textContent = 'Error al cargar compras.';
        }
    }
}


// ================================================================================== ELIMINAR COMPRA SOLO DE LA BASE DE DATOS =================================================================
async function eliminarCompra(id) {
    // 🔹 Confirmar eliminación
    if (!confirm('¿Estás seguro de que deseas eliminar esta compra? Esta acción solo borrará el registro de la compra y no modificará el stock.')) {
        return;
    }

    try {
        // 🔹 Enviar petición DELETE al backend
        const response = await fetch(`/api/compras/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudo eliminar la compra');
        }

        // 🔹 Recargar tabla de compras
        cargarCompras();

        // 🔹 Mensaje de éxito
        alert('Compra eliminada correctamente');

    } catch (error) {
        console.error('Error al eliminar compra:', error);
        alert('Error al eliminar la compra');
    }
}

// ================================================================================== CARGAR PRODUCTOS DE COMPRA SEGÚN LA CATEGORÍA =================================================================
async function filtrarProductosCompra() {
    // 🔹 Obtener los selects
    const selectCategoria = document.getElementById('compra-categoria-select');
    const selectProducto = document.getElementById('compra-producto-select');

    // 🔹 Si no existen, salir
    if (!selectCategoria || !selectProducto) return;

    // 🔹 Obtener la categoría elegida
    const idCategoria = selectCategoria.value;

    // 🔹 Limpiar el select de productos
    selectProducto.innerHTML = '<option value="">-- Selecciona producto --</option>';

        // 🔹 Limpiar el precio unitario cuando cambia la categoría
    const inputPrecio = document.getElementById('compra-item-precio');
    if (inputPrecio) inputPrecio.value = '';

    try {
        // 🔹 Pedir productos al backend
        const response = await fetch('/api/productos');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los productos');
        }

        // 🔹 Obtener lista de productos
        let productos = data.productos || [];

        // 🔹 Si hay categoría seleccionada, filtrar por ID_CATEGORIA
        if (idCategoria) {
            productos = productos.filter(producto =>
                String(producto.ID_CATEGORIA) === String(idCategoria)
            );
        }

        // 🔹 Agregar productos al select
        productos.forEach(producto => {
            const option = document.createElement('option');

            // 🔹 Guardar el ID del producto
            option.value = producto.ID;

            // 🔹 Mostrar nombre
            option.textContent = producto.NOMBRE;

            selectProducto.appendChild(option);
        });

    } catch (error) {
        console.error('Error al filtrar productos de compra:', error);
    }
}

// ================================================================================== AGREGAR PRODUCTO A LA COMPRA =================================================================
function agregarProductoACompra() {
    // 🔹 Obtener elementos del formulario
    const prodSelect = document.getElementById('compra-producto-select');
    const itemCantidadInput = document.getElementById('compra-item-cantidad');
    const itemPrecioInput = document.getElementById('compra-item-precio');

    // 🔹 Obtener el ID del producto seleccionado
    const prodId = prodSelect.value;

    // 🔹 Obtener el NOMBRE visible del producto seleccionado
    const prodNombre = prodSelect.options[prodSelect.selectedIndex]?.text || '';

    // 🔹 Obtener cantidad y precio
    const cantidad = parseInt(itemCantidadInput.value);
    const precio = parseFloat(itemPrecioInput.value);

    // 🔹 Validar producto
    if (!prodId) {
        alert('Por favor, selecciona un producto.');
        return;
    }

    // 🔹 Validar cantidad
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida.');
        itemCantidadInput.focus();
        return;
    }

    // 🔹 Validar precio
    if (isNaN(precio) || precio < 0) {
        alert('Por favor, ingresa un precio unitario válido.');
        itemPrecioInput.focus();
        return;
    }

    // 🔹 Calcular subtotal
    const subtotal = cantidad * precio;

    // 🔹 Guardar también el detalle real en memoria para luego enviarlo al backend
    detalleCompraActual.push({
        idProducto: parseInt(prodId),
        nombre: prodNombre,
        cantidad: cantidad,
        precio: precio,
        subtotal: subtotal
    });

    // 🔹 Crear línea de texto visible para el textarea
    const itemTexto = `${cantidad} - ${prodNombre} - ₡${precio.toFixed(2)} - ₡${subtotal.toFixed(2)}`;

    // 🔹 Obtener textarea donde se listan los productos agregados
    const productosTextarea = document.getElementById('compra-productos');

    // 🔹 Agregar nueva línea al listado visible
    productosTextarea.value += (productosTextarea.value ? '\n' : '') + itemTexto;

    // 🔹 Obtener input del total general
    const totalCompraInput = document.getElementById('compra-total');

    // 🔹 Sumar subtotal al total actual
    totalCompraInput.value = ((parseFloat(totalCompraInput.value) || 0) + subtotal).toFixed(2);

    // 🔹 Limpiar campos para seguir agregando productos
    prodSelect.value = '';
    itemCantidadInput.value = '1';
    itemPrecioInput.value = '';
}



// ================================================================================== CARGAR PROVEEDORES EN EL SELECT DE COMPRAS =================================================================
async function cargarProveedoresCompra() {
    // 🔹 Obtener el select de proveedores
    const selectProveedor = document.getElementById('compra-proveedor');

    // 🔹 Si no existe, salir
    if (!selectProveedor) return;

    // 🔹 Dejar solo la opción por defecto
    selectProveedor.innerHTML = '<option value="">-- Selecciona proveedor --</option>';

    try {
        // 🔹 Pedir proveedores al backend
        const response = await fetch('/api/proveedores');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los proveedores');
        }

        // 🔹 Recorrer proveedores y agregarlos al select
        data.proveedores.forEach(proveedor => {
            const option = document.createElement('option');

            // 🔹 Guardar el ID como value
            option.value = proveedor.ID;

            // 🔹 Mostrar el nombre del proveedor
            option.textContent = proveedor.NOMBRE;

            selectProveedor.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar proveedores de compra:', error);
    }
}


// ================================================================================== CARGAR CATEGORÍAS EN EL SELECT DE COMPRAS =================================================================
async function cargarCategoriasCompra() {
    // 🔹 Obtener el select de categorías
    const selectCategoria = document.getElementById('compra-categoria-select');

    // 🔹 Si no existe, salir
    if (!selectCategoria) return;

    // 🔹 Dejar solo la opción por defecto
    selectCategoria.innerHTML = '<option value="">-- Todas --</option>';

    try {
        // 🔹 Pedir categorías al backend
        const response = await fetch('/api/categorias');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar las categorías');
        }

        // 🔹 Recorrer categorías y agregarlas al select
        data.categorias.forEach(categoria => {
            const option = document.createElement('option');

            // 🔹 Guardar el ID de la categoría
            option.value = categoria.ID;

            // 🔹 Mostrar el nombre
            option.textContent = categoria.NOMBRE;

            selectCategoria.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar categorías de compra:', error);
    }
}



// ================================================================================== CARGAR PRECIO UNITARIO DEL PRODUCTO SELECCIONADO =================================================================
async function cargarPrecioProductoCompra() {
    // 🔹 Obtener el select del producto
    const selectProducto = document.getElementById('compra-producto-select');

    // 🔹 Obtener el input del precio unitario
    const inputPrecio = document.getElementById('compra-item-precio');

    // 🔹 Si no existen, salir
    if (!selectProducto || !inputPrecio) return;

    // 🔹 Obtener el ID del producto seleccionado
    const idProducto = selectProducto.value;

    // 🔹 Si no hay producto seleccionado, limpiar precio y salir
    if (!idProducto) {
        inputPrecio.value = '';
        return;
    }

    try {
        // 🔹 Pedir productos al backend
        const response = await fetch('/api/productos');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los productos');
        }

        // 🔹 Obtener arreglo de productos
        const productos = data.productos || [];

        // 🔹 Buscar el producto seleccionado por ID
        const productoSeleccionado = productos.find(producto =>
            String(producto.ID) === String(idProducto)
        );

        // 🔹 Si se encontró, poner su precio en el input
        if (productoSeleccionado) {
            inputPrecio.value = parseFloat(productoSeleccionado.PRECIO || 0).toFixed(2);
        } else {
            inputPrecio.value = '';
        }

    } catch (error) {
        console.error('Error al cargar precio del producto:', error);
        inputPrecio.value = '';
    }
}





// ======================================================================================================== PEDIDOS ======================================================================


async function cargarPedidos() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/pedidos');
        const data = await respuesta.json();

        const tbody = document.getElementById('tbody-pedidos');
        const sinPedidos = document.getElementById('sin-pedidos');
        const filtroEstado = document.getElementById('filtro-estado');
        const estadoSeleccionado = filtroEstado ? filtroEstado.value : '';

        tbody.innerHTML = '';

        if (!data.ok || data.pedidos.length === 0) {
            sinPedidos.style.display = 'block';
            return;
        }

        const pedidosFiltrados = data.pedidos.filter(pedido => {
            if (!estadoSeleccionado) return true;
            return pedido.ESTADO.toLowerCase() === estadoSeleccionado.toLowerCase();
        });

        if (pedidosFiltrados.length === 0) {
            sinPedidos.style.display = 'block';
            return;
        }

        sinPedidos.style.display = 'none';

        pedidosFiltrados.forEach(pedido => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>PED-${pedido.ID}</td>
                <td>${pedido.CLIENTE}</td>
                <td>${new Date(pedido.FECHA).toLocaleDateString()}</td>
                <td>$${parseFloat(pedido.TOTAL).toFixed(2)}</td>
                <td>${pedido.TIPO_PAGO}</td>
                <td>
                    <span class="estado-badge ${pedido.ESTADO.toLowerCase()}">
                        ${pedido.ESTADO.toUpperCase()}
                    </span>
                </td>
                <td>
                <button onclick="verPedido(${pedido.ID}, \`${pedido.CLIENTE}\`, \`${pedido.FECHA}\`, ${pedido.TOTAL}, \`${pedido.TIPO_PAGO}\`, \`${pedido.ESTADO}\`, \`${pedido.DESCRIPCION}\`, \`${pedido.CORREO}\`)" class="btn-ver">Ver</button> 
                <button onclick="eliminarPedido(${pedido.ID})" class="btn-eliminar">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('❌ Error cargando pedidos:', error);
    }
}



function verPedido(id, cliente, fecha, total, tipoPago, estado, descripcion, correo) {
    pedidoActualId = id;
    pedidoActualData = {
    id,
    cliente,
    fecha,
    total,
    tipoPago,
    estado,
    descripcion,
    correo
};
    const modal = document.getElementById('modal-pedido');
    const contenido = document.getElementById('detalles-pedido-content');
    const selectEstado = document.getElementById('nuevo-estado');

    const items = descripcion.split('|').map(item => item.trim());

    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `<div class="item-detalle-pedido">${item}</div>`;
    });

    contenido.innerHTML = `
        <p><strong>ID Pedido:</strong> PED-${id}</p>
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Fecha:</strong> ${new Date(fecha).toLocaleString()}</p>
        <p><strong>Estado Actual:</strong> <span class="estado-badge ${estado.toLowerCase()}">${estado.toUpperCase()}</span></p>
        <p><strong>Tipo de Pago:</strong> ${tipoPago}</p>
        <hr>
        <h4>Items:</h4>
        ${itemsHTML}
        <hr>
        <p><strong>Total:</strong> $${parseFloat(total).toFixed(2)}</p>
    `;

    selectEstado.value = estado.toLowerCase();

    modal.style.display = 'flex';
}





function cerrarModalPedido() {
    document.getElementById('modal-pedido').style.display = 'none';
    pedidoActualId = null;
}

async function actualizarEstadoPedido() {
    const nuevoEstado = document.getElementById('nuevo-estado').value;

    if (!pedidoActualId) {
        alert('No se encontró el pedido seleccionado');
        return;
    }

    if (!nuevoEstado) {
        alert('Selecciona un estado');
        return;
    }

    try {
        const respuesta = await fetch(`http://localhost:3000/api/pedidos/${pedidoActualId}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.mensaje || 'Error al actualizar estado');
            return;
        }

        alert('✅ Estado actualizado correctamente');
        cargarNotificaciones();
        mostrarResumenNotificaciones();
        cerrarModalPedido();
        cargarPedidos();

    } catch (error) {
        console.error('❌ Error actualizando estado:', error);
        alert('Error al actualizar estado del pedido');
    }
}



async function eliminarPedido(id) {
    const confirmar = confirm('¿Seguro que deseas eliminar este pedido?');

    if (!confirmar) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/pedidos/${id}`, {
            method: 'DELETE'
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.mensaje || 'Error al eliminar');
            return;
        }

        alert('✅ Pedido eliminado correctamente');

        // 🔥 Recargar tabla
        cargarPedidos();

    } catch (error) {
        console.error('❌ Error eliminando:', error);
        alert('Error al eliminar pedido');
    }
}

// ====================================================================================================== PDF Y EMAIL ====================================================================
function descargarPedidoPDF() {
    if (!pedidoActualData) {
        alert('No hay ningún pedido seleccionado');
        return;
    }

    generarPDF(pedidoActualData);
}


function generarPDF(pedido) {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.backgroundColor = '#fff';
    element.style.color = '#333';
    
    let itemsHTML = '';

    const items = pedido.descripcion.split('|').map(item => item.trim());

    items.forEach(item => {
        const partes = item.split(' - ');
        const nombre = partes[0] || item;
        const precioTexto = partes[1] || '$0.00';

        itemsHTML += `
            <tr style="color: #333;">
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${nombre}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${precioTexto}</td>
            </tr>
        `;
    });
    
    element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; margin: 0;">ZUARSE</h1>
            <p style="color: #666; margin: 5px 0;">Tienda Online</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Comprobante de Pedido</h2>
        
        <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <p><strong>ID Pedido:</strong> PED-${pedido.id}</p>
            <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-ES')} ${new Date(pedido.fecha).toLocaleTimeString('es-ES')}</p>
            <p><strong>Estado:</strong> ${(pedido.estado || 'pendiente').charAt(0).toUpperCase() + (pedido.estado || 'pendiente').slice(1)}</p>
            <p><strong>Tipo de Pago:</strong> ${pedido.tipoPago || pedido.tipo_pago || 'No especificado'}</p>
        </div>
        
        <h3 style="color: #333; margin-top: 25px;">Información del Cliente</h3>
        <p><strong>Nombre:</strong> ${pedido.cliente || pedido.cliente_nombre || 'Cliente'}</p>
        
        <h3 style="color: #333; margin-top: 25px;">Detalles de la Compra</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #667eea; color: white;">
                    <th style="padding: 12px; text-align: left;">Producto</th>
                    <th style="padding: 12px; text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background: #e8eaf6; border-radius: 5px;">
            <h3 style="margin: 0; color: #667eea;">Total: $${parseFloat(pedido.total).toFixed(2)}</h3>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Gracias por tu compra en ZUARSE. Este documento es tu comprobante de pedido.</p>
            <p>Generado el: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>
    `;
    
    const options = {
        margin: 10,
        filename: `pedido-${pedido.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(options).from(element).save();
}



async function enviarPedidoPorEmail() {
    if (!pedidoActualData) {
        alert('No hay pedido seleccionado');
        return;
    }

    try {
        // Crear HTML igual que el PDF
        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.backgroundColor = '#fff';
        element.style.color = '#333';

        const items = pedidoActualData.descripcion.split('|').map(item => item.trim());

        let itemsHTML = '';
        items.forEach(item => {
            const partes = item.split(' - ');
            const nombre = partes[0] || item;
            const precioTexto = partes[1] || '$0.00';

            itemsHTML += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${nombre}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${precioTexto}</td>
                </tr>
            `;
        });

        element.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0;">ZUARSE</h1>
                <p style="color: #666; margin: 5px 0;">Tienda Online</p>
            </div>
            
            <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Comprobante de Pedido</h2>
            
            <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                <p><strong>ID Pedido:</strong> PED-${pedidoActualData.id}</p>
                <p><strong>Fecha:</strong> ${new Date(pedidoActualData.fecha).toLocaleString('es-ES')}</p>
                <p><strong>Estado:</strong> ${pedidoActualData.estado}</p>
                <p><strong>Tipo de Pago:</strong> ${pedidoActualData.tipoPago}</p>
            </div>
            
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${pedidoActualData.cliente}</p>
            
            <h3>Detalles de la Compra</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #667eea; color: white;">
                        <th style="padding: 12px; text-align: left;">Producto</th>
                        <th style="padding: 12px; text-align: right;">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8eaf6; border-radius: 5px;">
                <h3>Total: $${parseFloat(pedidoActualData.total).toFixed(2)}</h3>
            </div>
        `;

        // Convertir a PDF en base64
        const opt = {
            margin: 10,
            filename: `pedido-${pedidoActualData.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');

        const reader = new FileReader();

        reader.readAsDataURL(pdfBlob);

        reader.onloadend = async function () {
            const base64data = reader.result.split(',')[1];

            const emailDestino = pedidoActualData.correo;

if (!emailDestino) {
    alert('El cliente no tiene correo registrado');
    return;
}

            const respuesta = await fetch('http://localhost:3000/api/pedidos/enviar-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: emailDestino,
                    subject: `Pedido PED-${pedidoActualData.id}`,
                    html: `<p>Adjunto encontrarás tu comprobante de pedido.</p>`,
                    pdfBase64: base64data,
                    fileName: `pedido-${pedidoActualData.id}.pdf`
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.mensaje || 'Error al enviar el correo');
                return;
            }

            alert('📧 Correo enviado correctamente');
        };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        alert('Error al enviar el correo');
    }
}



// ==================================================================================================== DASHBOARD & MÉTRICAS =============================================================
// ================================================================================== CARGAR DASHBOARD =================================================================
// ================================================================================== CARGAR DASHBOARD =================================================================
async function cargarDashboard() {
    // 🔹 Referencias de las cards
    const elIngresos = document.getElementById('dash-total-ingresos');
    const elPedidos = document.getElementById('dash-total-pedidos');
    const elProductos = document.getElementById('dash-total-productos');
    const elClientes = document.getElementById('dash-total-clientes');

    try {
        // 🔹 Pedir pedidos al backend
        const responsePedidos = await fetch('/api/pedidos');
        const dataPedidos = await responsePedidos.json();

        // 🔹 Preparar arreglo de pedidos según la estructura del backend
        let pedidos = [];

        if (Array.isArray(dataPedidos)) {
            pedidos = dataPedidos;
        } else if (dataPedidos.ok && Array.isArray(dataPedidos.pedidos)) {
            pedidos = dataPedidos.pedidos;
        }

        // 🔹 Obtener todas las fechas válidas desde SQL
        const fechasPedidos = pedidos
            .map(pedido => obtenerClaveFechaSQL(pedido.FECHA || pedido.fecha))
            .filter(Boolean)
            .sort();

        // 🔹 Si no hay pedidos válidos, dejar en 0
        let clavesUltimos7Dias = [];

        if (fechasPedidos.length > 0) {
            // 🔹 Tomar como base la fecha más reciente en la BD
            const ultimaFecha = fechasPedidos[fechasPedidos.length - 1];
            const [anio, mes, dia] = ultimaFecha.split('-').map(Number);
            const fechaBase = new Date(anio, mes - 1, dia);

            // 🔹 Generar las 7 claves exactas que usa la gráfica
            for (let i = 6; i >= 0; i--) {
                const fecha = new Date(
                    fechaBase.getFullYear(),
                    fechaBase.getMonth(),
                    fechaBase.getDate() - i
                );

                const key = fecha.getFullYear() + '-' +
                    String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
                    String(fecha.getDate()).padStart(2, '0');

                clavesUltimos7Dias.push(key);
            }
        }

        // 🔹 Filtrar pedidos de esos mismos 7 días e ignorar cancelados
        const pedidosUltimos7Dias = pedidos.filter(pedido => {
            const estado = (pedido.ESTADO || pedido.estado || '').toLowerCase();
            if (estado === 'cancelado') return false;

            const key = obtenerClaveFechaSQL(pedido.FECHA || pedido.fecha);
            if (!key) return false;

            return clavesUltimos7Dias.includes(key);
        });

        // 🔹 Calcular ingresos de los mismos 7 días de la gráfica
        const totalIngresos7Dias = pedidosUltimos7Dias.reduce((sum, pedido) => {
            return sum + parseFloat(pedido.TOTAL || pedido.total || 0);
        }, 0);

        // 🔹 Total de pedidos de esos mismos 7 días
        const totalPedidos7Dias = pedidosUltimos7Dias.length;

        // 🔹 Actualizar cards
        if (elIngresos) elIngresos.textContent = `₡${totalIngresos7Dias.toFixed(2)}`;
        if (elPedidos) elPedidos.textContent = totalPedidos7Dias;

    } catch (error) {
        console.error('Error al cargar pedidos en dashboard:', error);

        if (elIngresos) elIngresos.textContent = '₡0.00';
        if (elPedidos) elPedidos.textContent = '0';
    }

    try {
        // 🔹 Pedir productos al backend
        const responseProductos = await fetch('/api/productos');
        const dataProductos = await responseProductos.json();

        let productos = [];

        if (Array.isArray(dataProductos)) {
            productos = dataProductos;
        } else if (dataProductos.ok && Array.isArray(dataProductos.productos)) {
            productos = dataProductos.productos;
        }

        // 🔹 Actualizar total de productos
        if (elProductos) elProductos.textContent = productos.length;

    } catch (error) {
        console.error('Error al cargar productos en dashboard:', error);
        if (elProductos) elProductos.textContent = '0';
    }

    try {
        // 🔹 Pedir clientes al backend
        const responseClientes = await fetch('/api/clientes');
        const dataClientes = await responseClientes.json();

        let clientes = [];

        if (Array.isArray(dataClientes)) {
            clientes = dataClientes;
        } else if (dataClientes.ok && Array.isArray(dataClientes.clientes)) {
            clientes = dataClientes.clientes;
        }

        // 🔹 Actualizar total de clientes
        if (elClientes) elClientes.textContent = clientes.length;

    } catch (error) {
        console.error('Error al cargar clientes en dashboard:', error);
        if (elClientes) elClientes.textContent = '0';
    }

    // 🔹 Cargar tabla de stock bajo
    cargarAlertaStockBajoDashboard();

    // 🔹 Cargar gráfico de ventas
    cargarGraficoVentasDashboard();
}


// ---------------------------------------------------------------------- CARGAR ALERTA DE STOCK BAJO EN DASHBOARD --------------------------------------------------
async function cargarAlertaStockBajoDashboard() {
    // 🔹 Obtener tbody donde se van a pintar los productos con bajo stock
    const tbodyBajoStock = document.getElementById('tbody-dash-bajo-stock');

    // 🔹 Si no existe, salir
    if (!tbodyBajoStock) return;

    // 🔹 Limpiar contenido actual
    tbodyBajoStock.innerHTML = '';

    try {
        // 🔹 Pedir productos al backend
        const response = await fetch('/api/productos');
        const data = await response.json();

        // 🔹 Validar respuesta
        if (!response.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los productos para el dashboard');
        }

        // 🔹 Obtener arreglo de productos
        const productos = data.productos || [];

        // 🔹 Filtrar solo productos con stock menor o igual a 20
        const productosBajoStock = productos
            .filter(p => parseInt(p.STOCK || 0) <= 20)
            .sort((a, b) => parseInt(a.STOCK || 0) - parseInt(b.STOCK || 0));

        // 🔹 Si no hay productos con stock bajo, mostrar mensaje
        if (productosBajoStock.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="2">No hay productos con stock bajo.</td>
            `;
            tbodyBajoStock.appendChild(row);
            return;
        }

        // 🔹 Recorrer productos con stock bajo y agregarlos a la tabla
        productosBajoStock.forEach(producto => {
            const row = document.createElement('tr');

            // 🔹 Determinar clase visual según stock
            const stock = parseInt(producto.STOCK || 0);
            const stockClass = stock === 0
                ? 'stock-agotado'
                : (stock <= 10 ? 'stock-bajo' : 'stock-medio');

            row.innerHTML = `
                <td>${escapeHtml(producto.NOMBRE || '')}</td>
                <td><span class="stock-badge ${stockClass}">${stock}</span></td>
            `;

            tbodyBajoStock.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar alerta de stock bajo:', error);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2">Error al cargar stock bajo.</td>
        `;
        tbodyBajoStock.appendChild(row);
    }
}



// ================================================================================== CARGAR GRÁFICO DE VENTAS ÚLTIMOS 7 DÍAS DESDE BD =================================================================
async function cargarGraficoVentasDashboard() {
    // 🔹 Obtener contenedor del gráfico
    const container = document.getElementById('grafico-ventas-container');

    // 🔹 Si no existe, salir
    if (!container) return;

    // 🔹 Limpiar contenido
    container.innerHTML = '';

    try {
        // 🔹 Pedir pedidos al backend
        const response = await fetch('/api/pedidos');
        const data = await response.json();

        // 🔹 Preparar arreglo según la estructura del backend
        let pedidos = [];

        if (Array.isArray(data)) {
            pedidos = data;
        } else if (data.ok && Array.isArray(data.pedidos)) {
            pedidos = data.pedidos;
        }

        // 🔹 Obtener todas las claves de fecha reales desde SQL
        const fechasPedidos = pedidos
            .map(pedido => obtenerClaveFechaSQL(pedido.FECHA || pedido.fecha))
            .filter(Boolean)
            .sort();

        // 🔹 Si no hay pedidos con fecha válida, mostrar gráfico vacío de últimos 7 días desde hoy
        let fechaBase;
        if (fechasPedidos.length > 0) {
            // 🔹 Usar como referencia la fecha más reciente que venga de SQL
            const ultimaFecha = fechasPedidos[fechasPedidos.length - 1];
            const [anio, mes, dia] = ultimaFecha.split('-').map(Number);
            fechaBase = new Date(anio, mes - 1, dia);
        } else {
            fechaBase = new Date();
        }

        // 🔹 Estructura para guardar ventas por día
        const ventasPorDia = {};
        const dias = [];

        // 🔹 Generar 7 días tomando como última barra la fecha más reciente de SQL
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(
                fechaBase.getFullYear(),
                fechaBase.getMonth(),
                fechaBase.getDate() - i
            );

            const key = fecha.getFullYear() + '-' +
                String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
                String(fecha.getDate()).padStart(2, '0');

            const label = fecha.toLocaleDateString('es-CR', {
                day: 'numeric',
                month: 'numeric'
            });

            ventasPorDia[key] = 0;
            dias.push({ key, label });
        }

        // 🔹 Sumar pedidos por fecha exacta de SQL
        pedidos.forEach(pedido => {
            const estado = (pedido.ESTADO || pedido.estado || '').toLowerCase();
            if (estado === 'cancelado') return;

            const key = obtenerClaveFechaSQL(pedido.FECHA || pedido.fecha);
            if (!key) return;

            if (ventasPorDia[key] !== undefined) {
                ventasPorDia[key] += parseFloat(pedido.TOTAL || pedido.total || 0);
            }
        });

        // 🔹 Calcular máximo para escalar
        const maxVenta = Math.max(...Object.values(ventasPorDia), 100);

        // 🔹 Construir HTML
        let html = '<div class="chart-bars">';

        dias.forEach(dia => {
            const total = ventasPorDia[dia.key];
            const altura = Math.max((total / maxVenta) * 100, 2);

            html += `
                <div class="chart-bar-group">
                    <div 
                        class="chart-bar" 
                        style="height: ${altura}%"
                        title="₡${total.toFixed(2)}">
                    </div>
                    <div class="chart-label">${dia.label}</div>
                </div>
            `;
        });

        html += '</div>';

        // 🔹 Pintar gráfico
        container.innerHTML = html;

    } catch (error) {
        console.error('Error al cargar gráfico de ventas:', error);
        container.innerHTML = '<p>Error al cargar gráfico de ventas.</p>';
    }
}

// ================================================================================== OBTENER CLAVE DE FECHA DESDE SQL/BACKEND SIN CORRER DÍAS =================================================================
function obtenerClaveFechaSQL(fechaValor) {
    // 🔹 Validar que exista
    if (!fechaValor) return null;

    // 🔹 Convertir a texto
    const texto = String(fechaValor).trim();

    // 🔹 Si viene como YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss..., tomar solo la fecha
    const soloFecha = texto.split('T')[0].split(' ')[0];

    // 🔹 Validar formato básico YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) return null;

    return soloFecha;
}





// ========================================================================================================= EQUIPO (EMPLEADOS) ===========================================================



// MUESTRA EL FORMULARIO PARA CREAR UN NUEVO EMPLEADO
// ---------------------------------------------------------------------------------------------------------
function mostrarFormEmpleado() {
    // Como es nuevo, limpiamos el ID de edición
    empleadoEditando = null;

    // Limpiamos todo el formulario
    document.getElementById('formulario-empleado').reset();

    // Al crear un nuevo empleado, la contraseña sí es obligatoria
    document.getElementById('emp-password').required = true;

    // Cambiamos el título del formulario
    document.querySelector('#form-empleado h3').textContent = 'Nuevo Empleado';

    // Mostramos el formulario
    document.getElementById('form-empleado').style.display = 'block';
}

// ---------------------------------------------------------------------------------------------------------
// OCULTA EL FORMULARIO Y LIMPIA SU ESTADO
// ---------------------------------------------------------------------------------------------------------
function ocultarFormEmpleado() {
    // Oculta el formulario
    document.getElementById('form-empleado').style.display = 'none';

    // Limpia los campos
    document.getElementById('formulario-empleado').reset();

    // Resetea el ID de edición
    empleadoEditando = null;

    // Dejamos la contraseña como obligatoria por defecto
    // para cuando el usuario vuelva a crear uno nuevo
    document.getElementById('emp-password').required = true;

    // Restauramos el título original
    document.querySelector('#form-empleado h3').textContent = 'Formulario de Empleado';
}

// ---------------------------------------------------------------------------------------------------------
// GUARDA EMPLEADO
// - Si empleadoEditando es null => CREA
// - Si empleadoEditando tiene ID => EDITA
// ---------------------------------------------------------------------------------------------------------
async function guardarEmpleado(e) {
    e.preventDefault();

    // Tomamos el nombre de usuario escrito
    const usuario = document.getElementById('emp-usuario').value.trim();

    // Tomamos la contraseña escrita (puede venir vacía al editar)
    const password = document.getElementById('emp-password').value;

    // Validación básica
    if (!usuario) {
        alert('El nombre de usuario es obligatorio');
        return;
    }

    // Si estamos creando uno nuevo, la contraseña sí es obligatoria
    if (!empleadoEditando && !password) {
        alert('La contraseña es obligatoria para nuevos empleados');
        return;
    }

    try {
        let respuesta;
        let resultado;

        // ==============================================================================================
        // EDITAR EMPLEADO EXISTENTE
        // ==============================================================================================
        if (empleadoEditando) {

            // Armamos el objeto que se enviará al backend
            const datosActualizar = {
                nombre: usuario
            };

            // Solo enviamos contraseña si el usuario escribió una nueva
            if (password) {
                datosActualizar.contrasena = btoa(password + SECRET_KEY);
            }

            // Enviar actualización al backend
            respuesta = await fetch(`http://localhost:3000/api/empleados/${empleadoEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizar)
            });

            resultado = await respuesta.json();
        }

        // ==============================================================================================
        // CREAR NUEVO EMPLEADO
        // ==============================================================================================
        else {
            respuesta = await fetch('http://localhost:3000/api/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: usuario,
                    contrasena: btoa(password + SECRET_KEY)
                })
            });

            resultado = await respuesta.json();
        }

        // Si el backend devuelve error
        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al guardar empleado');
            return;
        }

        // Si todo salió bien:
        // 1. ocultamos formulario
        // 2. recargamos tabla
        // 3. mostramos mensaje
        ocultarFormEmpleado();
        cargarEquipo();
        alert(resultado.mensaje || 'Empleado guardado correctamente');

    } catch (error) {
        console.error('Error guardando empleado:', error);
        alert('Error al guardar empleado');
    }
}

// ---------------------------------------------------------------------------------------------------------
// CARGAR EQUIPO DESDE SQL SERVER
// Lee la tabla USUARIOS desde el backend y pinta la tabla.
// Solo muestra el nombre del empleado y los botones.
// ---------------------------------------------------------------------------------------------------------
async function cargarEquipo() {

    const tbody = document.getElementById('tbody-equipo');
    const sinEquipo = document.getElementById('sin-equipo');

    // Limpiar tabla antes de volver a cargar
    tbody.innerHTML = '';

    try {
        const res = await fetch('http://localhost:3000/api/empleados');
        const data = await res.json();

        // Si no hay empleados o vino algo incorrecto
        if (!data.ok || !data.empleados || data.empleados.length === 0) {
            sinEquipo.style.display = 'block';
            return;
        }

        // Si sí hay empleados, ocultamos el mensaje vacío
        sinEquipo.style.display = 'none';

        // Recorremos cada empleado que viene desde SQL Server
        data.empleados.forEach(emp => {

            const row = document.createElement('tr');

            // IMPORTANTE:
            // emp.ID viene de SQL Server
            // emp.NOMBRE viene de SQL Server
            row.innerHTML = `
                <td>${escapeHtml(emp.NOMBRE)}</td>
                <td>
                    <button 
                        class="btn-editar" 
                        onclick="editarEmpleado(${emp.ID}, '${String(emp.NOMBRE).replace(/'/g, "\\'")}')">
                        Editar
                    </button>

                    <button 
                        class="btn-eliminar" 
                        onclick="eliminarEmpleado(${emp.ID})">
                        Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error cargando empleados:", error);
        sinEquipo.style.display = 'block';
    }
}

// ---------------------------------------------------------------------------------------------------------
// EDITAR EMPLEADO
// Abre el formulario y carga el nombre del empleado seleccionado.
// La contraseña se deja en blanco para que solo se cambie si el admin escribe una nueva.
// ---------------------------------------------------------------------------------------------------------
function editarEmpleado(id, nombre) {
    // Guardamos el ID del empleado que se va a editar
    empleadoEditando = id;

    // Cargamos el nombre en el input
    document.getElementById('emp-usuario').value = nombre;

    // Dejamos la contraseña vacía
    document.getElementById('emp-password').value = '';

    // Al editar, la contraseña NO es obligatoria
    document.getElementById('emp-password').required = false;

    // Cambiamos el título del formulario
    document.querySelector('#form-empleado h3').textContent = 'Editar Empleado';

    // Mostramos el formulario
    document.getElementById('form-empleado').style.display = 'block';
}

// ---------------------------------------------------------------------------------------------------------
// ELIMINAR EMPLEADO
// Borra un empleado de la tabla USUARIOS usando su ID.
// ---------------------------------------------------------------------------------------------------------
async function eliminarEmpleado(id) {
    // Confirmación antes de borrar
    if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/empleados/${id}`, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {
            alert(resultado.mensaje || 'Error al eliminar empleado');
            return;
        }

        // Recargar tabla después de borrar
        cargarEquipo();
        alert(resultado.mensaje || 'Empleado eliminado correctamente');

    } catch (error) {
        console.error('Error eliminando empleado:', error);
        alert('Error al eliminar empleado');
    }
}

// ---------------------------------------------------------------------------------------------------------
// EVENTOS DEL MÓDULO DE EMPLEADOS
// Conectan botones y formulario.
// Esto debe ejecutarse cuando ya existe el DOM.
// ---------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    // Botón "Nuevo Empleado"
    const btnNuevoEmpleado = document.getElementById('btn-nuevo-empleado');
    if (btnNuevoEmpleado) {
        btnNuevoEmpleado.addEventListener('click', mostrarFormEmpleado);
    }

    // Botón "Cancelar"
    const btnCancelarEmpleado = document.getElementById('cancelar-empleado');
    if (btnCancelarEmpleado) {
        btnCancelarEmpleado.addEventListener('click', ocultarFormEmpleado);
    }

    // Submit del formulario
    const formularioEmpleado = document.getElementById('formulario-empleado');
    if (formularioEmpleado) {
        formularioEmpleado.addEventListener('submit', guardarEmpleado);
    }

});
