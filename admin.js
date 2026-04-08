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
    try { cargarDashboard(); } catch(e) { console.error('cargarDashboard:', e); }
    try { cargarEquipo(); } catch(e) { console.error('cargarEquipo:', e); }

    const btnX = document.querySelector('.close-modal');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnGuardarEstado = document.getElementById('btn-guardar-estado');

    if (btnX) btnX.addEventListener('click', cerrarModalPedido);
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalPedido);
    if (btnGuardarEstado) btnGuardarEstado.addEventListener('click', actualizarEstadoPedido);
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

        alert(esEdicion ? 'Producto actualizado correctamente' : 'Producto guardado correctamente');

    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert(error.message || 'Error al guardar el producto');
    }
}


//---------------------------------------------------------------------------------------------^ GUARDAR PRODUCTO ^---------------------------------------------------------------------------


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


//---------------------------------------------------------------------------------------------^ CARGAR PRODUCTO ^---------------------------------------------------------------------------


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


//---------------------------------------------------------------------------------------------^ EDITAR PRODUCTO ^---------------------------------------------------------------------------


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

//---------------------------------------------------------------------------------------------^ ELIMINAR PRODUCTO ^---------------------------------------------------------------------------



// ===============================================================================================================^ PRODUCTOS ^===============================================================================




// ================================================================================================================ INVENTARIO ==============================================================
/**
 * Módulo de Inventario.
 * Proporciona una vista de solo lectura del stock de los productos.
 * Permite filtrar por categoría y ordena los productos por la cantidad de stock más baja primero.
 */

/**
 * Carga y muestra los productos en la tabla de inventario.
 * Lee los productos del localStorage, aplica el filtro de categoría seleccionado,
 * ordena los productos por stock ascendente (de menor a mayor) y los renderiza en la tabla.
 * Aplica estilos especiales para productos con stock bajo o agotado.
 */
function cargarInventario() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const tbody = document.getElementById('tbody-inventario');
    const sinInventario = document.getElementById('sin-inventario');
    const filtroCat = document.getElementById('filtro-inventario-categoria');
    const categoriaSeleccionada = filtroCat ? filtroCat.value : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    // Filtrar por categoría si hay una seleccionada
    let productosFiltrados = productos;
    if (categoriaSeleccionada) {
        productosFiltrados = productos.filter(p => p.categoria === categoriaSeleccionada);
    }

    if (productosFiltrados.length === 0) {
        if (sinInventario) {
            sinInventario.style.display = 'block';
            sinInventario.textContent = productos.length === 0 ? 'No hay productos para mostrar en el inventario.' : 'No hay productos en esta categoría.';
        }
        return;
    }

    if (sinInventario) sinInventario.style.display = 'none';

    // Ordenar por stock más bajo primero para priorizar
    productosFiltrados.sort((a, b) => (a.stock || 0) - (b.stock || 0));

    productosFiltrados.forEach(producto => {
        const row = document.createElement('tr');
        const stock = producto.stock || 0;
        
        let stockClass = '';
        if (stock === 0) {
            stockClass = 'stock-agotado'; // Para estilizar en rojo
        } else if (stock > 0 && stock <= 10) {
            stockClass = 'stock-bajo'; // Para estilizar en naranja
        }

        row.innerHTML = `
            <td>${escapeHtml(producto.nombre)}</td>
            <td>${escapeHtml(producto.categoria) || 'General'}</td>
            <td><span class="stock-badge ${stockClass}">${stock}</span></td>
        `;
        tbody.appendChild(row);
    });
}


// ================================================================================================================ INVENTARIO ==============================================================



// =========================================================================================================== CLIENTES =====================================================================================                                                      local


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

// -------------------------------------------------------------------------------------------------- MOSTRAR CLIENTE------------------------------------------------------------------------------------------




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

// -------------------------------------------------------------------------------------------------- CARGAR CLIENTE------------------------------------------------------------------------------------------


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


// -------------------------------------------------------------------------------------------- CARGAR CLIENTES EN TABLA --------------------------------------------------------------------------------



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


// ----------------------------------------------------------------------------------------- LLENAR EL FORMULARIO DE CLIENTE -----------------------------------------------------------------------------



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


// --------------------------------------------------------------------------------------------- ELIMINAR CLIENTE -----------------------------------------------------------------------------------------


// ================================================================================================== CLIENTES =============================================================================================



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


//------------------------------------------------------------------------------------------------ GUARDAR O ACTUALIZAR CATEGORIA ----------------------------------------------------------------------------------------



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
                    categorias.map(c => `<option value="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</option>`).join('');
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


//------------------------------------------------------------------------------------------------ CARGAR CATEGORIA ----------------------------------------------------------------------------------------



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


//------------------------------------------------------------------------------------------------ EDITAR CATEGORIA ----------------------------------------------------------------------------------------


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


//------------------------------------------------------------------------------------------------ CARGAR CATEGORIA ----------------------------------------------------------------------------------------




function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
}


//==================================================================================================== CATEGORIAS ==========================================================================================


// =================================================================================================== NOTIFICACIONES =======================================================================================
function cargarNotificaciones() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const tbody = document.getElementById('tbody-notificaciones');
    const sinNotificaciones = document.getElementById('sin-notificaciones');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        if (sinNotificaciones) sinNotificaciones.style.display = 'block';
        return;
    }

    if (sinNotificaciones) sinNotificaciones.style.display = 'none';

    // Mostrar pedidos en orden inverso (más recientes primero)
    pedidos.reverse().forEach(pedido => {
        // Buscar nombre del cliente por email
        const cliente = clientes.find(c => c.email === pedido.cliente_email);
        const nombreCliente = cliente ? cliente.nombre : pedido.cliente_nombre || 'Cliente desconocido';
        
        // Construir lista de productos
        let productosText = '';
        pedido.items.forEach(item => {
            productosText += `${item.nombre}, `;
        });
        if (pedido.items && Array.isArray(pedido.items)) {
            pedido.items.forEach(item => {
                productosText += `${item.nombre}, `;
            });
        }
        productosText = productosText.slice(0, -2); // Remover última coma y espacio
        
        // Cantidad de artículos
        const cantidadArticulos = pedido.items.length;
        
        // Fecha formateada
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES');
        
        const fila = document.createElement('tr');
        fila.className = 'notificacion-row';
        fila.setAttribute('data-cliente', nombreCliente.toLowerCase());
        fila.innerHTML = `
            <td><strong>${escapeHtml(nombreCliente)}</strong></td>
            <td>${fecha}</td>
            <td>#${pedido.id}</td>
            <td>${escapeHtml(productosText)}</td>
            <td><span class="badge-cantidad">${cantidadArticulos}</span></td>
            <td><strong>$${(pedido.total || 0).toFixed(2)}</strong></td>
        `;
        tbody.appendChild(fila);
    });
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


// ==================================================================================================== PROVEEDORES ======================================================================


// ====================================================================================================== COMPRAS =========================================================================
function mostrarFormCompra() {
    compraEditando = null;
    const form = document.getElementById('formulario-compra');
    if (form) form.reset();

    // Limpiar campos calculados
    document.getElementById('compra-productos').value = '';
    document.getElementById('compra-total').value = '';
    
    // Cargar proveedores en el select
    const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    const select = document.getElementById('compra-proveedor');
    if (select) {
        select.innerHTML = '<option value="">-- Selecciona proveedor --</option>' + 
            proveedores.map(p => `<option value="${escapeHtml(p.nombre)}">${escapeHtml(p.nombre)}</option>`).join('');
    }

    // Cargar categorías
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const selectCat = document.getElementById('compra-categoria-select');
    if (selectCat) {
        selectCat.innerHTML = '<option value="">-- Todas --</option>' + 
            categorias.map(c => `<option value="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</option>`).join('');
    }
    
    // Cargar productos iniciales
    filtrarProductosCompra();

    // Set default date to today
    const dateInput = document.getElementById('compra-fecha');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    const cont = document.getElementById('form-compra');
    if (cont) cont.style.display = 'block';
    const titulo = document.querySelector('#form-compra h3');
    if (titulo) titulo.textContent = 'Registrar Compra';
}

function ocultarFormCompra() {
    const cont = document.getElementById('form-compra');
    if (cont) cont.style.display = 'none';
    const form = document.getElementById('formulario-compra');
    if (form) form.reset();
    compraEditando = null;
}

function guardarCompra(e) {
    e.preventDefault();

    const proveedor = document.getElementById('compra-proveedor').value;
    const idFactura = document.getElementById('compra-id-factura').value.trim();
    const fecha = document.getElementById('compra-fecha').value;
    const productosTexto = document.getElementById('compra-productos').value.trim();
    const total = parseFloat(document.getElementById('compra-total').value || 0);

    if (!productosTexto || total < 0) {
        alert('Debes agregar al menos un producto a la compra.');
        return;
    }

    if (!proveedor || !idFactura || !fecha) {
        alert('Por favor completa los campos obligatorios');
        return;
    }

    const compra = {
        id: compraEditando?.id || Date.now(),
        proveedor: proveedor,
        idFactura: idFactura,
        fecha: fecha,
        productos: productosTexto,
        total: total,
        fechaRegistro: new Date().toISOString()
    };

    let compras = JSON.parse(localStorage.getItem('compras')) || [];

    if (compraEditando) {
        compras = compras.map(c => c.id === compraEditando.id ? compra : c);
    } else {
        compras.push(compra);
    }

    localStorage.setItem('compras', JSON.stringify(compras));
    ocultarFormCompra();
    cargarCompras();
    alert('Compra registrada exitosamente');
}

function cargarCompras() {
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    const tbody = document.getElementById('tbody-compras');
    const sinCompras = document.getElementById('sin-compras');
    const filtroInput = document.getElementById('filtro-compra-proveedor');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    const comprasFiltradas = compras.filter(c => c.proveedor.toLowerCase().includes(filtro));

    if (comprasFiltradas.length === 0) {
        if (sinCompras) {
            sinCompras.style.display = 'block';
            sinCompras.textContent = compras.length === 0 ? 'No hay compras registradas.' : 'No se encontraron compras de ese proveedor.';
        }
        return;
    }

    if (sinCompras) sinCompras.style.display = 'none';

    // Ordenar por fecha descendente
    comprasFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    comprasFiltradas.forEach(c => {
        const row = document.createElement('tr');
        row.className = 'compra-row';
        row.setAttribute('data-proveedor', c.proveedor.toLowerCase());
        row.innerHTML = `
            <td>${escapeHtml(c.idFactura)}</td>
            <td>${escapeHtml(c.proveedor)}</td>
            <td>${new Date(c.fecha).toLocaleDateString()}</td>
            <td>${escapeHtml(c.productos)}</td>
            <td>₡${(c.total || 0).toFixed(2)}</td>
            <td>
                <button class="btn-editar" onclick="editarCompra(${c.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarCompra(${c.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarCompra(id) {
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    const compra = compras.find(c => c.id === id);
    if (!compra) return;

    mostrarFormCompra(); // Esto carga los proveedores y resetea
    compraEditando = compra;

    document.getElementById('compra-proveedor').value = compra.proveedor;
    document.getElementById('compra-id-factura').value = compra.idFactura;
    document.getElementById('compra-fecha').value = compra.fecha;
    document.getElementById('compra-productos').value = compra.productos;
    document.getElementById('compra-total').value = compra.total;

    const titulo = document.querySelector('#form-compra h3');
    if (titulo) titulo.textContent = 'Editar Compra';
}

function eliminarCompra(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta compra?')) return;

    let compras = JSON.parse(localStorage.getItem('compras')) || [];
    compras = compras.filter(c => c.id !== id);
    localStorage.setItem('compras', JSON.stringify(compras));
    cargarCompras();
}

function filtrarProductosCompra() {
    const cat = document.getElementById('compra-categoria-select').value;
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const selectProd = document.getElementById('compra-producto-select');
    
    if (!selectProd) return;
    
    let filtrados = productos;
    if (cat) {
        filtrados = productos.filter(p => p.categoria === cat);
    }
    
    selectProd.innerHTML = '<option value="">-- Selecciona producto --</option>' + 
        filtrados.map(p => `<option value="${escapeHtml(p.nombre)}">${escapeHtml(p.nombre)}</option>`).join('');
}

function agregarProductoACompra() {
    const prodSelect = document.getElementById('compra-producto-select');
    const prodNombre = prodSelect.value;
    const itemCantidadInput = document.getElementById('compra-item-cantidad');
    const itemPrecioInput = document.getElementById('compra-item-precio');
    
    const cantidad = parseInt(itemCantidadInput.value);
    const precio = parseFloat(itemPrecioInput.value);

    if (!prodNombre) {
        alert('Por favor, selecciona un producto.');
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida.');
        itemCantidadInput.focus();
        return;
    }
    if (isNaN(precio) || precio < 0) {
        alert('Por favor, ingresa un precio unitario válido.');
        itemPrecioInput.focus();
        return;
    }

    const subtotal = cantidad * precio;
    const itemTexto = `${cantidad} - ${prodNombre} - ₡${precio.toFixed(2)} - ₡${subtotal.toFixed(2)}`;

    // Actualizar listado de productos
    const productosTextarea = document.getElementById('compra-productos');
    productosTextarea.value += (productosTextarea.value ? '\n' : '') + itemTexto;

    // Actualizar totales
    const totalCompraInput = document.getElementById('compra-total');
    totalCompraInput.value = ((parseFloat(totalCompraInput.value) || 0) + subtotal).toFixed(2);

    // Limpiar campos de item
    prodSelect.value = '';
    itemCantidadInput.value = '1';
    itemPrecioInput.value = '';
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
                    <button onclick="verPedido(${pedido.ID}, \`${pedido.CLIENTE}\`, \`${pedido.FECHA}\`, ${pedido.TOTAL}, \`${pedido.TIPO_PAGO}\`, \`${pedido.ESTADO}\`, \`${pedido.DESCRIPCION}\`)" class="btn-ver">Ver</button>
                    <button onclick="eliminarPedido(${pedido.ID})" class="btn-eliminar">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('❌ Error cargando pedidos:', error);
    }
}



function verPedido(id, cliente, fecha, total, tipoPago, estado, descripcion) {
    pedidoActualId = id;
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


// function cerrarModalPedido() {
//     document.getElementById('modal-pedido').style.display = 'none';
//     pedidoVisualizando = null;
// }

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
function descargarPedidoPDF(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
        alert('Pedido no encontrado');
        return;
    }
    
    generarPDF(pedido);
}

function generarPDF(pedido) {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.backgroundColor = '#fff';
    
    let itemsHTML = '';
    pedido.items.forEach(item => {
        itemsHTML += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.precio.toFixed(2)}</td>
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
            <p><strong>ID Pedido:</strong> ${pedido.id}</p>
            <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-ES')} ${new Date(pedido.fecha).toLocaleTimeString('es-ES')}</p>
            <p><strong>Estado:</strong> ${(pedido.estado || 'pendiente').charAt(0).toUpperCase() + (pedido.estado || 'pendiente').slice(1)}</p>
            <p><strong>Tipo de Pago:</strong> ${pedido.tipo_pago || 'No especificado'}</p>
        </div>
        
        <h3 style="color: #333; margin-top: 25px;">Información del Cliente</h3>
        <p><strong>Nombre:</strong> ${pedido.cliente_nombre}</p>
        <p><strong>Email:</strong> ${pedido.cliente_email}</p>
        
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
            <h3 style="margin: 0; color: #667eea;">Total: $${pedido.total.toFixed(2)}</h3>
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

function enviarPedidoPorEmail(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
        alert('Pedido no encontrado');
        return;
    }
    
    // Validar que EmailJS esté configurado
    if (typeof validarConfiguracionEmailJS === 'undefined' || !validarConfiguracionEmailJS()) {
        alert('⚠️ EmailJS no está configurado correctamente.\n\nPara usar esta función:\n1. Regístrate en https://www.emailjs.com\n2. Actualiza tu PUBLIC_KEY en config.js\n3. Crea un servicio y plantilla de email\n\nMientras tanto, puedes descargar el PDF del pedido.');
        return;
    }
    
    // Construir el contenido del email
    let itemsText = '';
    pedido.items.forEach(item => {
        itemsText += `- ${item.nombre}: $${item.precio.toFixed(2)}\n`;
    });
    
    const templateParams = {
        to_email: pedido.cliente_email,
        to_name: pedido.cliente_nombre,
        order_id: pedido.id,
        order_date: new Date(pedido.fecha).toLocaleDateString('es-ES'),
        order_items: itemsText,
        order_total: pedido.total.toFixed(2),
        order_status: (pedido.estado || 'pendiente').charAt(0).toUpperCase() + (pedido.estado || 'pendiente').slice(1)
    };
    
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            alert('✅ Email enviado correctamente a ' + pedido.cliente_email + '!');
        })
        .catch(function(error) {
            alert('❌ Error al enviar el email. Por favor, intenta de nuevo.\n\nNota: Asegúrate de configurar EmailJS en config.js');
            console.error('Error:', error);
        });
}

// ==================================================================================================== DASHBOARD & MÉTRICAS =============================================================
function cargarDashboard() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // 1. Calcular Totales
    // Sumar solo pedidos no cancelados
    const totalIngresos = pedidos
        .filter(p => p.estado !== 'cancelado')
        .reduce((sum, p) => sum + (p.total || 0), 0);
    
    const totalPedidos = pedidos.length;
    const totalProductos = productos.length;
    const totalClientes = clientes.length;

    // 2. Actualizar Tarjetas (Cards)
    const elIngresos = document.getElementById('dash-total-ingresos');
    const elPedidos = document.getElementById('dash-total-pedidos');
    const elProductos = document.getElementById('dash-total-productos');
    const elClientes = document.getElementById('dash-total-clientes');

    if (elIngresos) elIngresos.textContent = `$${totalIngresos.toFixed(2)}`;
    if (elPedidos) elPedidos.textContent = totalPedidos;
    if (elProductos) elProductos.textContent = totalProductos;
    if (elClientes) elClientes.textContent = totalClientes;

    // 3. Tabla de Productos con Bajo Stock (Top 5)
    const tbodyBajoStock = document.getElementById('tbody-dash-bajo-stock');
    if (tbodyBajoStock) {
        tbodyBajoStock.innerHTML = '';
        const bajoStock = productos
            .sort((a, b) => (a.stock || 0) - (b.stock || 0))
            .slice(0, 5);
        
        bajoStock.forEach(p => {
            const row = document.createElement('tr');
            const stockClass = p.stock === 0 ? 'stock-agotado' : (p.stock <= 10 ? 'stock-bajo' : '');
            row.innerHTML = `
                <td>${escapeHtml(p.nombre)}</td>
                <td><span class="stock-badge ${stockClass}">${p.stock}</span></td>
            `;
            tbodyBajoStock.appendChild(row);
        });
    }

    // 4. Gráfico simple de ventas (últimos 7 días)
    renderizarGraficoVentas(pedidos);
}

function renderizarGraficoVentas(pedidos) {
    const container = document.getElementById('grafico-ventas-container');
    if (!container) return;

    // Agrupar ventas por fecha (últimos 7 días)
    const ventasPorDia = {};
    const hoy = new Date();
    const dias = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(hoy.getDate() - i);
        const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const label = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        ventasPorDia[key] = 0;
        dias.push({ key, label });
    }

    pedidos.forEach(p => {
        if (p.estado !== 'cancelado') {
            const fechaP = new Date(p.fecha).toISOString().split('T')[0];
            if (ventasPorDia[fechaP] !== undefined) {
                ventasPorDia[fechaP] += (p.total || 0);
            }
        }
    });

    const maxVenta = Math.max(...Object.values(ventasPorDia), 100); // Mínimo 100 para escala

    let html = '<div class="chart-bars">';
    dias.forEach(dia => {
        const total = ventasPorDia[dia.key];
        const altura = Math.max((total / maxVenta) * 100, 2); // Mínimo 2% altura
        html += `
            <div class="chart-bar-group">
                <div class="chart-bar" style="height: ${altura}%" title="$${total.toFixed(2)}"></div>
                <div class="chart-label">${dia.label}</div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ========================================================================================================= EQUIPO (EMPLEADOS) ===========================================================

// =========================================================================================================
// EQUIPO (EMPLEADOS)
// Este bloque ya trabaja con la tabla USUARIOS en SQL Server
// y deja de usar localStorage.
// =========================================================================================================

// Variable global para saber si estamos editando un empleado existente.
// Si vale null, significa que estamos creando uno nuevo.
// Si tiene un número, ese número será el ID del empleado a editar.
//let empleadoEditando = null;

// ---------------------------------------------------------------------------------------------------------
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
