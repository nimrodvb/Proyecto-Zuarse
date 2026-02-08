// VARIABLES GLOBALES
let productoEditando = null;
let clienteEditando = null;
let pedidoVisualizando = null;
let categoriaEditando = null;
let proveedorEditando = null;
let compraEditando = null;

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
    // Configurar eventos primero para asegurar que la navegación funcione
    configurarEventos();

    try { cargarProductos(); } catch(e) { console.error(e); }
    try { cargarClientes(); } catch(e) { console.error(e); }
    try { cargarCategorias(); } catch(e) { console.error(e); }
    try { cargarProveedores(); } catch(e) { console.error(e); }
    try { cargarCompras(); } catch(e) { console.error(e); }
    try { cargarPedidos(); } catch(e) { console.error(e); }
    try { cargarNotificaciones(); } catch(e) { console.error(e); }
});

// ==================== CONFIGURAR EVENTOS ====================
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

    // Clientes
    const btnNuevoCliente = document.getElementById('btn-nuevo-cliente');
    const cancelarCliente = document.getElementById('cancelar-cliente');
    const formularioCliente = document.getElementById('formulario-cliente');
    if (btnNuevoCliente) btnNuevoCliente.addEventListener('click', mostrarFormCliente);
    if (cancelarCliente) cancelarCliente.addEventListener('click', ocultarFormCliente);
    if (formularioCliente) formularioCliente.addEventListener('submit', guardarCliente);

    // Categorías
    const btnNuevaCategoria = document.getElementById('btn-nueva-categoria');
    const cancelarCategoria = document.getElementById('cancelar-categoria');
    const formularioCategoria = document.getElementById('formulario-categoria');
    if (btnNuevaCategoria) btnNuevaCategoria.addEventListener('click', mostrarFormCategoria);
    if (cancelarCategoria) cancelarCategoria.addEventListener('click', ocultarFormCategoria);
    if (formularioCategoria) formularioCategoria.addEventListener('submit', guardarCategoria);

    // Notificaciones

    // Proveedores
    const btnNuevoProveedor = document.getElementById('btn-nuevo-proveedor');
    const cancelarProveedor = document.getElementById('cancelar-proveedor');
    const formularioProveedor = document.getElementById('formulario-proveedor');
    if (btnNuevoProveedor) btnNuevoProveedor.addEventListener('click', mostrarFormProveedor);
    if (cancelarProveedor) cancelarProveedor.addEventListener('click', ocultarFormProveedor);
    if (formularioProveedor) formularioProveedor.addEventListener('submit', guardarProveedor);

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
}

// ==================== NAVEGACIÓN DE TABS ====================
function cambiarTab(e) {
    const tabBtn = e.target;
    const tabNombre = tabBtn.dataset.tab;

    // Remover active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Agregar active al seleccionado
    tabBtn.classList.add('active');
    document.getElementById(tabNombre).classList.add('active');
}

// ==================== PRODUCTOS ====================
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

function guardarProducto(e) {
    e.preventDefault();

    const producto = {
        id: productoEditando?.id || Date.now(),
        nombre: document.getElementById('prod-nombre').value,
        descripcion: document.getElementById('prod-descripcion').value,
        precio: parseFloat(document.getElementById('prod-precio').value),
        imagen: document.getElementById('prod-imagen').value || 'images/default.png',
        stock: parseInt(document.getElementById('prod-stock').value),
        categoria: document.getElementById('prod-categoria').value || 'General',
        fechaCreacion: productoEditando?.fechaCreacion || new Date().toLocaleDateString()
    };

    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    if (productoEditando) {
        // Actualizar
        productos = productos.map(p => p.id === productoEditando.id ? producto : p);
    } else {
        // Crear nuevo
        productos.push(producto);
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    ocultarFormProducto();
    cargarProductos();
    alert('Producto guardado exitosamente');
}

function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const tbody = document.getElementById('tbody-productos');
    const sinProductos = document.getElementById('sin-productos');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (productos.length === 0) {
        sinProductos.style.display = 'block';
        return;
    }

    sinProductos.style.display = 'none';

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${(producto.precio || 0).toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>
                <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarProducto(id) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    productoEditando = producto;
    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-descripcion').value = producto.descripcion;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen;
    document.getElementById('prod-stock').value = producto.stock;
    document.getElementById('prod-categoria').value = producto.categoria;

    document.querySelector('#form-producto h3').textContent = 'Editar Producto';
    document.getElementById('form-producto').style.display = 'block';
}

function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos = productos.filter(p => p.id !== id);
    localStorage.setItem('productos', JSON.stringify(productos));
    cargarProductos();
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

    if (!tbody) return;

    tbody.innerHTML = '';

    if (clientes.length === 0) {
        sinClientes.style.display = 'block';
        return;
    }

    sinClientes.style.display = 'none';

    clientes.forEach(cliente => {
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

    if (!tbody) return;

    tbody.innerHTML = '';

    if (categorias.length === 0) {
        if (sinCategorias) sinCategorias.style.display = 'block';
        if (prodSelect) prodSelect.innerHTML = '<option value="">-- Ninguna --</option>';
        return;
    }

    if (sinCategorias) sinCategorias.style.display = 'none';

    // Actualizar select de categorías en formulario de producto
    if (prodSelect) {
        prodSelect.innerHTML = '<option value="">-- Selecciona categoría --</option>' + categorias.map(c => `<option value="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</option>`).join('');
    }

    categorias.forEach(c => {
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

    if (!tbody) return;

    tbody.innerHTML = '';

    if (proveedores.length === 0) {
        if (sinProveedores) sinProveedores.style.display = 'block';
        return;
    }

    if (sinProveedores) sinProveedores.style.display = 'none';

    proveedores.forEach(prov => {
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

    if (!tbody) return;

    tbody.innerHTML = '';

    if (compras.length === 0) {
        if (sinCompras) sinCompras.style.display = 'block';
        return;
    }

    if (sinCompras) sinCompras.style.display = 'none';

    // Ordenar por fecha descendente
    compras.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    compras.forEach(c => {
        const row = document.createElement('tr');
        row.className = 'compra-row';
        row.setAttribute('data-proveedor', c.proveedor.toLowerCase());
        row.innerHTML = `
            <td>${escapeHtml(c.idFactura)}</td>
            <td>${escapeHtml(c.proveedor)}</td>
            <td>${new Date(c.fecha).toLocaleDateString()}</td>
            <td>${escapeHtml(c.productos)}</td>
            <td>$${(c.total || 0).toFixed(2)}</td>
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
    const itemTexto = `${cantidad} x ${prodNombre} @ $${precio.toFixed(2)} = $${subtotal.toFixed(2)}`;

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
