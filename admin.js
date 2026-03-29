// VARIABLES GLOBALES
const SECRET_KEY = 'zuarse_secret_2024'; // Necesario para crear contraseñas de empleados
let productoEditando = null;
let clienteEditando = null;
let pedidoVisualizando = null;
let categoriaEditando = null;
let proveedorEditando = null;
let compraEditando = null;
let empleadoEditando = null;

// FUNCIONES DE SESIÓN
function cerrarSesionAdmin() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('sesion_zuarse');
        sessionStorage.removeItem('sesion_zuarse');
        window.location.href = 'login.html';
    }
}

// SIDEBAR TOGGLE
function toggleSidebar() {
    const wrapper = document.querySelector('.admin-wrapper');
    wrapper.classList.toggle('sidebar-collapsed');
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos primero para asegurar que la navegación funcione
    configurarEventos();

    try { cargarProductos(); } catch(e) { console.error(e); }
    try { cargarInventario(); } catch(e) { console.error(e); }
    try { cargarClientes(); } catch(e) { console.error(e); }
    try { cargarCategorias(); } catch(e) { console.error(e); }
    try { cargarProveedores(); } catch(e) { console.error(e); }
    try { cargarCompras(); } catch(e) { console.error(e); }
    try { cargarPedidos(); } catch(e) { console.error(e); }
    try { cargarNotificaciones(); } catch(e) { console.error(e); }
    try { cargarDashboard(); } catch(e) { console.error(e); }
    try { cargarEquipo(); } catch(e) { console.error(e); }
});

// ==================== CONFIGURAR EVENTOS ====================
function configurarEventos() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', cambiarTab);
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);

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

// ==================== PRODUCTOS ====================
/**
 * Muestra el formulario para crear un nuevo producto.
 *
 * Resetea el formulario, limpia la variable de edición, cambia el título a "Nuevo Producto"
 * y hace visible el contenedor del formulario.
 */
function mostrarFormProducto() {
    productoEditando = null; // Limpiar edición previa
    document.getElementById('formulario-producto').reset(); // Limpiar campos
    document.getElementById('form-producto').style.display = 'block'; // Mostrar formulario
    document.querySelector('#form-producto h3').textContent = 'Nuevo Producto'; // Cambiar título
}

/**
 * Oculta el formulario de producto y lo resetea.
 *
 * Hace invisible el contenedor del formulario, resetea todos los campos y limpia la variable de edición.
 */
function ocultarFormProducto() {
    document.getElementById('form-producto').style.display = 'none'; // Ocultar formulario
    document.getElementById('formulario-producto').reset(); // Limpiar campos
    productoEditando = null; // Limpiar edición
}

/**
 * Guarda un producto nuevo o actualiza uno existente en localStorage.
 *
 * Esta función valida los datos del formulario, crea o actualiza el objeto producto,
 * lo guarda en localStorage y recarga las vistas correspondientes.
 *
 * Validaciones realizadas:
 * - Nombre: obligatorio, no vacío.
 * - Precio: debe ser un número flotante válido y no negativo.
 * - Stock: debe ser un número entero válido y no negativo.
 *
 * Si alguna validación falla, muestra una alerta y detiene el proceso.
 *
 * Después de guardar, oculta el formulario, recarga la lista de productos y el inventario,
 * y muestra una alerta de éxito.
 *
 * @param {Event} e - El evento de submit del formulario.
 */
function guardarProducto(e) {
    e.preventDefault();

    // Obtener y validar datos del formulario
    const nombre = document.getElementById('prod-nombre').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const stockInput = document.getElementById('prod-stock').value.trim();
    const stock = parseInt(stockInput);

    // Validación: nombre obligatorio
    if (!nombre) {
        alert('Por favor ingresa un nombre para el producto.');
        return;
    }

    // Validación: precio válido y no negativo
    if (isNaN(precio) || precio < 0) {
        alert('Por favor ingresa un precio válido.');
        return;
    }

    // Validación: stock válido y no negativo
    if (isNaN(stock) || stock < 0) {
        alert('Por favor ingresa una cantidad de stock válida (número entero positivo o cero).');
        return;
    }

    // Crear objeto producto
    const producto = {
        id: productoEditando?.id || Date.now(), // Usar ID existente o generar nuevo
        nombre: nombre,
        descripcion: document.getElementById('prod-descripcion').value,
        precio: precio,
        imagen: document.getElementById('prod-imagen').value || 'images/default.png',
        stock: stock, // Ahora garantizado como número entero válido
        categoria: document.getElementById('prod-categoria').value || 'General',
        fechaCreacion: productoEditando?.fechaCreacion || new Date().toLocaleDateString()
    };

    // Obtener productos existentes de localStorage
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Actualizar o agregar el producto
    if (productoEditando) {
        // Modo edición: reemplazar el producto existente
        productos = productos.map(p => p.id === productoEditando.id ? producto : p);
    } else {
        // Modo creación: agregar nuevo producto
        productos.push(producto);
    }

    // Guardar en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));

    // Limpiar y ocultar formulario
    ocultarFormProducto();

    // Recargar vistas para reflejar cambios
    cargarProductos();
    cargarInventario();

    // Notificar éxito
    alert('Producto guardado exitosamente');
}

function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const tbody = document.getElementById('tbody-productos');
    const sinProductos = document.getElementById('sin-productos');
    const filtroNombreInput = document.getElementById('filtro-producto-nombre');
    const filtroCategoriaInput = document.getElementById('filtro-producto-categoria');
    
    const filtroNombre = filtroNombreInput ? filtroNombreInput.value.toLowerCase().trim() : '';
    const filtroCategoria = filtroCategoriaInput ? filtroCategoriaInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    const productosFiltrados = productos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(filtroNombre);
        const coincideCategoria = (p.categoria || '').toLowerCase().includes(filtroCategoria);
        return coincideNombre && coincideCategoria;
    });

    if (productosFiltrados.length === 0) {
        sinProductos.style.display = 'block';
        sinProductos.textContent = productos.length === 0 ? 'No hay productos aún. ¡Crea uno nuevo!' : 'No se encontraron productos con esos criterios.';
        return;
    }

    sinProductos.style.display = 'none';

    productosFiltrados.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${(producto.precio || 0).toFixed(2)}</td>
            <td>${isNaN(parseInt(producto.stock)) ? 0 : parseInt(producto.stock)}</td>
            <td>${producto.categoria}</td>
            <td>
                <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Carga los datos de un producto existente en el formulario para edición.
 *
 * Busca el producto por ID en localStorage, llena los campos del formulario con sus datos,
 * marca el producto como "editando" y muestra el formulario.
 *
 * Si el producto no existe, no hace nada.
 *
 * @param {number} id - El ID único del producto a editar.
 */
function editarProducto(id) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(p => p.id === id);

    if (!producto) return; // Producto no encontrado

    // Marcar como editando
    productoEditando = producto;

    // Llenar formulario con datos del producto
    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-descripcion').value = producto.descripcion;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen;
    // Asegurar que stock sea un número válido (tratar NaN como 0)
    document.getElementById('prod-stock').value = isNaN(parseInt(producto.stock)) ? 0 : parseInt(producto.stock);
    document.getElementById('prod-categoria').value = producto.categoria;

    // Cambiar título del formulario
    document.querySelector('#form-producto h3').textContent = 'Editar Producto';

    // Mostrar formulario
    document.getElementById('form-producto').style.display = 'block';
}

/**
 * Elimina un producto del localStorage después de confirmar con el usuario.
 *
 * Muestra un diálogo de confirmación. Si el usuario confirma, filtra el producto por ID
 * de la lista de productos, guarda los cambios en localStorage y recarga la vista de productos.
 * También recarga el inventario para reflejar la eliminación.
 *
 * @param {number} id - El ID único del producto a eliminar.
 */
function eliminarProducto(id) {
    // Confirmar eliminación con el usuario
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    // Obtener productos y filtrar el que se va a eliminar
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos = productos.filter(p => p.id !== id);

    // Guardar cambios
    localStorage.setItem('productos', JSON.stringify(productos));

    // Recargar vistas
    cargarProductos();
    cargarInventario(); // Para reflejar el producto eliminado

    // Notificar éxito (opcional, ya que confirm() informa)
}

// ==================== INVENTARIO ====================
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
    productosFiltrados.sort((a, b) => {
        const stockA = isNaN(parseInt(a.stock)) ? 0 : parseInt(a.stock);
        const stockB = isNaN(parseInt(b.stock)) ? 0 : parseInt(b.stock);
        return stockA - stockB;
    });

    productosFiltrados.forEach(producto => {
        const row = document.createElement('tr');
        const stock = isNaN(parseInt(producto.stock)) ? 0 : parseInt(producto.stock);
        
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

// ==================== CLIENTES ====================
function mostrarFormCliente() {
    clienteEditando = null;
    document.getElementById('formulario-cliente').reset();
    document.getElementById('form-cliente').style.display = 'block';
    document.querySelector('#form-cliente h3').textContent = 'Nuevo Cliente';
}

function ocultarFormCliente() {
    document.getElementById('form-cliente').style.display = 'none';
    document.getElementById('formulario-cliente').reset();
    clienteEditando = null;
}

function guardarCliente(e) {
    e.preventDefault();

    const cliente = {
        id: clienteEditando?.id || Date.now(),
        nombre: document.getElementById('cli-nombre').value,
        email: document.getElementById('cli-email').value,
        telefono: document.getElementById('cli-telefono').value,
        direccion: document.getElementById('cli-direccion').value,
        ciudad: document.getElementById('cli-ciudad').value,
        estado: document.getElementById('cli-estado').value,
        fechaRegistro: clienteEditando?.fechaRegistro || new Date().toLocaleDateString()
    };

    let clientes = JSON.parse(localStorage.getItem('clientes'));
    // Asegurar que sea un array (corrección de compatibilidad)
    if (!Array.isArray(clientes)) {
        clientes = clientes ? Object.values(clientes) : [];
    }

    if (clienteEditando) {
        // Actualizar
        clientes = clientes.map(c => c.id === clienteEditando.id ? cliente : c);
    } else {
        // Crear nuevo
        clientes.push(cliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));
    ocultarFormCliente();
    cargarClientes();
    alert('Cliente guardado exitosamente');
}

function cargarClientes() {
    let clientes = JSON.parse(localStorage.getItem('clientes'));
    
    // Corrección automática de datos: Si es objeto, convertir a array y guardar
    if (clientes && !Array.isArray(clientes)) {
        clientes = Object.values(clientes);
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }
    clientes = clientes || [];

    const tbody = document.getElementById('tbody-clientes');
    const sinClientes = document.getElementById('sin-clientes');
    const filtroInput = document.getElementById('filtro-cliente-nombre');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    const clientesFiltrados = clientes.filter(c => c.nombre.toLowerCase().includes(filtro));

    if (clientesFiltrados.length === 0) {
        sinClientes.style.display = 'block';
        sinClientes.textContent = clientes.length === 0 ? 'No hay clientes aún. ¡Agrega uno nuevo!' : 'No se encontraron clientes con ese nombre.';
        return;
    }

    sinClientes.style.display = 'none';

    clientesFiltrados.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || '-'}</td>
            <td>${cliente.ciudad || '-'}</td>
            <td><span class="estado-${cliente.estado}">${cliente.estado}</span></td>
            <td>
                <button class="btn-editar" onclick="editarCliente('${cliente.id}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes'));
    if (!Array.isArray(clientes)) {
        clientes = clientes ? Object.values(clientes) : [];
    }
    const cliente = clientes.find(c => c.id == id);

    if (!cliente) return;

    clienteEditando = cliente;
    document.getElementById('cli-nombre').value = cliente.nombre;
    document.getElementById('cli-email').value = cliente.email;
    document.getElementById('cli-telefono').value = cliente.telefono;
    document.getElementById('cli-direccion').value = cliente.direccion;
    document.getElementById('cli-ciudad').value = cliente.ciudad;
    document.getElementById('cli-estado').value = cliente.estado;

    document.querySelector('#form-cliente h3').textContent = 'Editar Cliente';
    document.getElementById('form-cliente').style.display = 'block';
}

function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

    let clientes = JSON.parse(localStorage.getItem('clientes'));
    if (!Array.isArray(clientes)) {
        clientes = clientes ? Object.values(clientes) : [];
    }

    clientes = clientes.filter(c => c.id != id);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    cargarClientes();
}

// ==================== CATEGORÍAS ====================
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

function guardarCategoria(e) {
    e.preventDefault();

    const nombre = document.getElementById('cat-nombre').value.trim();
    const descripcion = document.getElementById('cat-descripcion').value.trim();

    if (!nombre) {
        alert('El nombre de la categoría es obligatorio');
        return;
    }

    const categoria = {
        id: categoriaEditando?.id || Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        fechaCreacion: categoriaEditando?.fechaCreacion || new Date().toLocaleDateString()
    };

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    if (categoriaEditando) {
        categorias = categorias.map(c => c.id === categoriaEditando.id ? categoria : c);
    } else {
        categorias.push(categoria);
    }

    localStorage.setItem('categorias', JSON.stringify(categorias));
    ocultarFormCategoria();
    cargarCategorias();
    alert('Categoría guardada exitosamente');
}

function cargarCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const tbody = document.getElementById('tbody-categorias');
    const sinCategorias = document.getElementById('sin-categorias');
    const prodSelect = document.getElementById('prod-categoria');
    const filtroInventarioSelect = document.getElementById('filtro-inventario-categoria');
    const filtroInput = document.getElementById('filtro-categoria-nombre');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    // Actualizar select de categorías en formulario de producto
    if (prodSelect) {
        if (categorias.length === 0) {
            prodSelect.innerHTML = '<option value="">-- Ninguna --</option>';
        } else {
            prodSelect.innerHTML = '<option value="">-- Selecciona categoría --</option>' + categorias.map(c => `<option value="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</option>`).join('');
        }
    }

    // Actualiza el menú desplegable de filtro en la pestaña de Inventario
    // Actualizar select de filtro inventario
    if (filtroInventarioSelect) {
        const valorActual = filtroInventarioSelect.value;
        if (categorias.length === 0) {
            filtroInventarioSelect.innerHTML = '<option value="">Todas las categorías</option>';
        } else {
            filtroInventarioSelect.innerHTML = '<option value="">Todas las categorías</option>' + categorias.map(c => `<option value="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</option>`).join('');
        }
        if (valorActual) filtroInventarioSelect.value = valorActual;
    }

    const categoriasFiltradas = categorias.filter(c => c.nombre.toLowerCase().includes(filtro));

    if (categoriasFiltradas.length === 0) {
        if (sinCategorias) {
            sinCategorias.style.display = 'block';
            sinCategorias.textContent = categorias.length === 0 ? 'No hay categorías aún. ¡Crea una nueva!' : 'No se encontraron categorías con ese nombre.';
        }
        return;
    }

    if (sinCategorias) sinCategorias.style.display = 'none';

    categoriasFiltradas.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.descripcion || '-'}</td>
            <td>
                <button class="btn-editar" onclick="editarCategoria(${c.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarCategoria(${c.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarCategoria(id) {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;

    categoriaEditando = cat;
    document.getElementById('cat-nombre').value = cat.nombre;
    document.getElementById('cat-descripcion').value = cat.descripcion || '';
    const titulo = document.querySelector('#form-categoria h3');
    if (titulo) titulo.textContent = 'Editar Categoría';
    const cont = document.getElementById('form-categoria');
    if (cont) cont.style.display = 'block';
}

function eliminarCategoria(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias = categorias.filter(c => c.id !== id);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    cargarCategorias();
    alert('Categoría eliminada correctamente');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
}

// ==================== NOTIFICACIONES ====================
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

// ==================== PROVEEDORES ====================
function mostrarFormProveedor() {
    proveedorEditando = null;
    const form = document.getElementById('formulario-proveedor');
    if (form) form.reset();
    const cont = document.getElementById('form-proveedor');
    if (cont) cont.style.display = 'block';
    const titulo = document.querySelector('#form-proveedor h3');
    if (titulo) titulo.textContent = 'Nuevo Proveedor';
}

function ocultarFormProveedor() {
    const cont = document.getElementById('form-proveedor');
    if (cont) cont.style.display = 'none';
    const form = document.getElementById('formulario-proveedor');
    if (form) form.reset();
    proveedorEditando = null;
}

function guardarProveedor(e) {
    e.preventDefault();

    const nombre = document.getElementById('prov-nombre').value.trim();
    const direccion = document.getElementById('prov-direccion').value.trim();
    const telefono = document.getElementById('prov-telefono').value.trim();

    if (!nombre) {
        alert('El nombre del proveedor es obligatorio');
        return;
    }

    const proveedor = {
        id: proveedorEditando?.id || Date.now(),
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        fechaRegistro: proveedorEditando?.fechaRegistro || new Date().toLocaleDateString()
    };

    let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

    if (proveedorEditando) {
        proveedores = proveedores.map(p => p.id === proveedorEditando.id ? proveedor : p);
    } else {
        proveedores.push(proveedor);
    }

    localStorage.setItem('proveedores', JSON.stringify(proveedores));
    ocultarFormProveedor();
    cargarProveedores();
    alert('Proveedor guardado exitosamente');
}

function cargarProveedores() {
    const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    const tbody = document.getElementById('tbody-proveedores');
    const sinProveedores = document.getElementById('sin-proveedores');
    const filtroInput = document.getElementById('filtro-proveedor-nombre');
    const filtro = filtroInput ? filtroInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    tbody.innerHTML = '';

    const proveedoresFiltrados = proveedores.filter(p => p.nombre.toLowerCase().includes(filtro));

    if (proveedoresFiltrados.length === 0) {
        if (sinProveedores) {
            sinProveedores.style.display = 'block';
            sinProveedores.textContent = proveedores.length === 0 ? 'No hay proveedores aún. ¡Crea uno nuevo!' : 'No se encontraron proveedores con ese nombre.';
        }
        return;
    }

    if (sinProveedores) sinProveedores.style.display = 'none';

    proveedoresFiltrados.forEach(prov => {
        const row = document.createElement('tr');
        row.className = 'proveedor-row';
        row.setAttribute('data-nombre', prov.nombre.toLowerCase());
        row.innerHTML = `
            <td>#${prov.id}</td>
            <td><strong>${escapeHtml(prov.nombre)}</strong></td>
            <td>${escapeHtml(prov.direccion) || '-'}</td>
            <td>${escapeHtml(prov.telefono) || '-'}</td>
            <td>${prov.fechaRegistro}</td>
            <td>
                <button class="btn-editar" onclick="editarProveedor(${prov.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProveedor(${prov.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarProveedor(id) {
    const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    const prov = proveedores.find(p => p.id === id);
    if (!prov) return;

    proveedorEditando = prov;
    document.getElementById('prov-nombre').value = prov.nombre;
    document.getElementById('prov-direccion').value = prov.direccion || '';
    document.getElementById('prov-telefono').value = prov.telefono || '';
    const titulo = document.querySelector('#form-proveedor h3');
    if (titulo) titulo.textContent = 'Editar Proveedor';
    const cont = document.getElementById('form-proveedor');
    if (cont) cont.style.display = 'block';
}

function eliminarProveedor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return;

    let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    proveedores = proveedores.filter(p => p.id !== id);
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
    cargarProveedores();
    alert('Proveedor eliminado correctamente');
}

// ==================== COMPRAS ====================
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
        // Cambio 1: Al editar una compra, revertimos primero el stock registrado anteriormente
        // para evitar sumar dos veces la misma cantidad.
        ajustarStockPorCompra(compraEditando.productos, -1, { actualizarPrecio: false });
        compras = compras.map(c => c.id === compraEditando.id ? compra : c);
    } else {
        compras.push(compra);
    }

    // Cambio 1: Agregar el stock de los productos registrados en esta compra.
    // Cambio 2: Actualizar el precio del producto según el precio unitario ingresado en la compra.
    ajustarStockPorCompra(compra.productos, 1, { actualizarPrecio: true });

    localStorage.setItem('compras', JSON.stringify(compras));
    ocultarFormCompra();
    cargarCompras();

    // Refrescar productos/inventario para mostrar el nuevo stock y precio
    cargarProductos();
    cargarInventario();

    const mensaje = compraEditando
        ? 'Compra actualizada correctamente. Stock y precios de productos ajustados.'
        : 'Compra registrada correctamente. Stock y precios de productos ajustados.';
    alert(mensaje);
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
    const compra = compras.find(c => c.id === id);
    if (compra) {
        // Cambio 1: Al eliminar una compra, restar del stock las cantidades que se habían sumado.
        // (No se cambia el precio del producto al eliminar una compra).
        ajustarStockPorCompra(compra.productos, -1);
    }

    compras = compras.filter(c => c.id !== id);
    localStorage.setItem('compras', JSON.stringify(compras));
    cargarCompras();
    cargarProductos();
    cargarInventario();
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

/**
 * Ajusta el stock (y opcionalmente el precio) de los productos según los items registrados en una compra.
 *
 * Esta función procesa el texto de productos de una compra (formato: "cantidad - nombre - ₡precio - ₡subtotal"),
 * encuentra cada producto por nombre en localStorage, y ajusta su stock sumando/restando la cantidad
 * multiplicada por el multiplicador. Opcionalmente, actualiza el precio del producto.
 *
 * Cambios realizados en el código:
 * 1) Actualiza el stock del producto según la cantidad registrada en la compra (suma para compras nuevas, resta para eliminaciones).
 * 2) Puede actualizar el precio del producto usando el precio unitario ingresado en la compra.
 * 3) Maneja stocks inválidos (NaN) tratándolos como 0 para evitar errores de suma.
 *
 * @param {string} productosTexto - Texto de los productos (línea por línea) como se guarda en la compra.
 * @param {number} multiplicador - 1 para sumar stock (compra nueva/actualizada), -1 para restar stock (eliminar/editar).
 * @param {object} [opciones] - Opciones de comportamiento.
 * @param {boolean} [opciones.actualizarPrecio=false] - Si es true, actualiza el precio del producto al precio registrado en la compra.
 */
function ajustarStockPorCompra(productosTexto, multiplicador, opciones = {}) {
    // Validar parámetros básicos
    if (!productosTexto || !multiplicador) return;

    // Obtener productos de localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const { actualizarPrecio = false } = opciones;

    // Procesar cada línea del texto de productos
    // Formato esperado: "cantidad - nombre - ₡precio - ₡subtotal"
    const lineas = productosTexto.split('\n').map(l => l.trim()).filter(Boolean);
    lineas.forEach(linea => {
        // Separar partes por " - "
        const partes = linea.split(' - ');
        const cantidad = parseInt(partes[0], 10);
        const nombre = partes[1] ? partes[1].trim() : '';
        const precioTexto = partes[2] ? partes[2].trim() : '';

        // Validar que cantidad y nombre sean válidos
        if (!nombre || isNaN(cantidad) || cantidad <= 0) return;

        // Buscar producto por nombre exacto
        const producto = productos.find(p => p.nombre === nombre);
        if (!producto) return; // Si no existe, ignorar (no debería pasar en uso normal)

        // Actualizar stock (asegurando que stockActual sea un número válido, tratando NaN como 0)
        const stockActual = isNaN(parseInt(producto.stock, 10)) ? 0 : parseInt(producto.stock, 10);
        const nuevoStock = Math.max(0, stockActual + multiplicador * cantidad); // No permitir stock negativo
        producto.stock = nuevoStock;

        // Actualizar precio si se solicita (solo en compras nuevas/guardadas)
        if (actualizarPrecio) {
            // Limpiar texto del precio (remover símbolos como ₡) y parsear como float
            const precioParsed = parseFloat(precioTexto.replace(/[^0-9.,-]/g, '').replace(/,/g, '.'));
            if (!isNaN(precioParsed) && precioParsed >= 0) {
                producto.precio = precioParsed;
            }
        }
    });

    // Guardar cambios en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));
}

// ==================== PEDIDOS ====================
function cargarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const productos = JSON.parse(localStorage.getItem('productos')) || []; // Cargar productos para buscar categorías
    const tbody = document.getElementById('tbody-pedidos');
    const sinPedidos = document.getElementById('sin-pedidos');
    const filtroEstadoEl = document.getElementById('filtro-estado');
    const filtroProductoEl = document.getElementById('filtro-pedido-producto');
    const filtroCategoriaEl = document.getElementById('filtro-pedido-categoria');

    const filtroEstado = filtroEstadoEl ? filtroEstadoEl.value : '';
    const filtroProducto = filtroProductoEl ? filtroProductoEl.value.toLowerCase() : '';
    const filtroCategoria = filtroCategoriaEl ? filtroCategoriaEl.value.toLowerCase() : '';

    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Filtrado combinado
    let pedidosFiltrados = pedidos.filter(p => {
        // 1. Filtro por Estado
        if (filtroEstado && (p.estado || 'pendiente') !== filtroEstado) return false;

        // 2. Filtro por Nombre de Producto (busca dentro de los items del pedido)
        if (filtroProducto) {
            const tieneProducto = p.items.some(item => item.nombre.toLowerCase().includes(filtroProducto));
            if (!tieneProducto) return false;
        }

        // 3. Filtro por Categoría (cruza información con la lista de productos)
        if (filtroCategoria) {
            const tieneCategoria = p.items.some(item => {
                const prod = productos.find(pr => pr.nombre === item.nombre);
                return prod && prod.categoria && prod.categoria.toLowerCase().includes(filtroCategoria);
            });
            if (!tieneCategoria) return false;
        }

        return true;
    });
    
    if (pedidosFiltrados.length === 0) {
        sinPedidos.style.display = 'block';
        return;
    }
    
    sinPedidos.style.display = 'none';
    
    // Mostrar pedidos en orden inverso (más recientes primero)
    pedidosFiltrados.reverse().forEach(pedido => {
        const fila = document.createElement('tr');
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES');
        const estado = pedido.estado || 'pendiente';
        
        fila.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente_nombre}</td>
            <td>${fecha}</td>
            <td>$${(pedido.total || 0).toFixed(2)}</td>
            <td>${pedido.tipo_pago || 'N/A'}</td>
            <td>
                <span class="badge badge-${estado}">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
            </td>
            <td>
                <button class="btn-ver" onclick="verDetallesPedido('${pedido.id}')">Ver</button>
                <button class="btn-eliminar" onclick="eliminarPedido('${pedido.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function verDetallesPedido(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
        alert('Pedido no encontrado');
        return;
    }
    
    pedidoVisualizando = pedido;
    const modal = document.getElementById('modal-pedido');
    const contenido = document.getElementById('detalles-pedido-content');
    
    let itemsHtml = '';
    pedido.items.forEach(item => {
        itemsHtml += `
            <div class="item-pedido">
                <strong>${item.nombre}</strong> - $${item.precio.toFixed(2)}
            </div>
        `;
    });
    
    const estadoSeleccionado = pedido.estado || 'pendiente';
    
    contenido.innerHTML = `
        <p><strong>ID Pedido:</strong> ${pedido.id}</p>
        <p><strong>Cliente:</strong> ${pedido.cliente_nombre} (${pedido.cliente_email})</p>
        <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-ES')} ${new Date(pedido.fecha).toLocaleTimeString('es-ES')}</p>
        <p><strong>Estado Actual:</strong> <span class="badge badge-${estadoSeleccionado}">${estadoSeleccionado.charAt(0).toUpperCase() + estadoSeleccionado.slice(1)}</span></p>
        <p><strong>Tipo de Pago:</strong> ${pedido.tipo_pago || 'No especificado'}</p>
        <hr>
        <h4>Items:</h4>
        ${itemsHtml}
        <hr>
        <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
        
        <div class="acciones-pedido">
            <button class="btn-pdf" onclick="descargarPedidoPDF('${pedido.id}')">📥 Descargar PDF</button>
            <button class="btn-email" onclick="enviarPedidoPorEmail('${pedido.id}')">📧 Enviar por Email</button>
        </div>
    `;
    
    document.getElementById('nuevo-estado').value = estadoSeleccionado;
    modal.style.display = 'block';
}

function cerrarModalPedido() {
    document.getElementById('modal-pedido').style.display = 'none';
    pedidoVisualizando = null;
}

function guardarEstadoPedido() {
    if (!pedidoVisualizando) return;
    
    const nuevoEstado = document.getElementById('nuevo-estado').value;
    if (!nuevoEstado) {
        alert('Por favor selecciona un nuevo estado');
        return;
    }
    
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const indice = pedidos.findIndex(p => p.id === pedidoVisualizando.id);
    
    if (indice !== -1) {
        pedidos[indice].estado = nuevoEstado;
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        alert('Estado del pedido actualizado correctamente');
        cargarPedidos();
        cerrarModalPedido();
    }
}

function eliminarPedido(pedidoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        return;
    }
    
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos = pedidos.filter(p => p.id !== pedidoId);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    cargarPedidos();
    alert('Pedido eliminado correctamente');
}

// ==================== PDF Y EMAIL ====================
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

// ==================== DASHBOARD & MÉTRICAS ====================
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

// ==================== EQUIPO (EMPLEADOS) ====================
function mostrarFormEmpleado() {
    empleadoEditando = null;
    document.getElementById('formulario-empleado').reset();
    document.getElementById('emp-password').required = true; // Password obligatorio al crear
    document.getElementById('form-empleado').style.display = 'block';
    document.querySelector('#form-empleado h3').textContent = 'Nuevo Empleado';
}

function ocultarFormEmpleado() {
    document.getElementById('form-empleado').style.display = 'none';
    document.getElementById('formulario-empleado').reset();
    empleadoEditando = null;
}

function guardarEmpleado(e) {
    e.preventDefault();

    const usuario = document.getElementById('emp-usuario').value.trim().toLowerCase();
    const password = document.getElementById('emp-password').value;
    const rol = document.getElementById('emp-rol').value;

    if (!usuario) {
        alert('El usuario es obligatorio');
        return;
    }

    // Si es nuevo, requerimos contraseña
    if (!empleadoEditando && !password) {
        alert('La contraseña es obligatoria para nuevos empleados');
        return;
    }

    let empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];

    // Validar usuario único
    const existe = empleados.some(emp => emp.usuario === usuario && (!empleadoEditando || emp.id !== empleadoEditando.id));
    if (existe || usuario === 'admin') {
        alert('Ese nombre de usuario ya está en uso');
        return;
    }

    const empleadoData = {
        id: empleadoEditando?.id || Date.now(),
        usuario: usuario,
        rol: rol,
        fechaCreacion: empleadoEditando?.fechaCreacion || new Date().toISOString()
    };

    // Manejo de contraseña (solo actualizar si se escribió algo o es nuevo)
    if (password) {
        empleadoData.passwordEncriptada = btoa(password + SECRET_KEY);
    } else if (empleadoEditando) {
        empleadoData.passwordEncriptada = empleadoEditando.passwordEncriptada;
    }

    if (empleadoEditando) {
        empleados = empleados.map(e => e.id === empleadoEditando.id ? empleadoData : e);
    } else {
        empleados.push(empleadoData);
    }

    localStorage.setItem('empleados_zuarse', JSON.stringify(empleados));
    ocultarFormEmpleado();
    cargarEquipo();
    alert('Empleado guardado correctamente');
}

function cargarEquipo() {
    const empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];
    const tbody = document.getElementById('tbody-equipo');
    const sinEquipo = document.getElementById('sin-equipo');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (empleados.length === 0) {
        sinEquipo.style.display = 'block';
        return;
    }
    sinEquipo.style.display = 'none';

    empleados.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(emp.usuario)}</td>
            <td><span class="badge badge-${emp.rol === 'admin' ? 'procesando' : 'pendiente'}">${emp.rol.toUpperCase()}</span></td>
            <td>${new Date(emp.fechaCreacion).toLocaleDateString()}</td>
            <td>
                <button class="btn-editar" onclick="editarEmpleado(${emp.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEmpleado(${emp.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarEmpleado(id) {
    const empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];
    const emp = empleados.find(e => e.id === id);
    if (!emp) return;

    empleadoEditando = emp;
    document.getElementById('emp-usuario').value = emp.usuario;
    document.getElementById('emp-rol').value = emp.rol;
    document.getElementById('emp-password').value = '';
    document.getElementById('emp-password').required = false; // Opcional al editar

    document.querySelector('#form-empleado h3').textContent = 'Editar Empleado';
    document.getElementById('form-empleado').style.display = 'block';
}

function eliminarEmpleado(id) {
    if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;
    let empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];
    empleados = empleados.filter(e => e.id !== id);
    localStorage.setItem('empleados_zuarse', JSON.stringify(empleados));
    cargarEquipo();
}
