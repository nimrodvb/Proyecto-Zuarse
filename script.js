let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Obtiene el formulario usando su ID
const formularioContacto = document.getElementById("formulario-contacto");

// Verifica que el formulario exista en la página
if (formularioContacto) {

  // Escucha el evento submit del formulario
  formularioContacto.addEventListener("submit", async function (e) {

    // Evita que la página se recargue al enviar el formulario
    e.preventDefault();

    // Obtiene los valores ingresados por el usuario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Crea un objeto con los datos para enviarlos al servidor
    const datos = {
      nombre,
      apellido,
      correo,
      telefono
    };

    try {

      // Envía los datos al backend usando fetch
      const respuesta = await fetch("/api/contacto", {

        // Tipo de petición
        method: "POST",

        // Indica que los datos se enviarán en formato JSON
        headers: {
          "Content-Type": "application/json"
        },

        // Convierte el objeto a JSON
        body: JSON.stringify(datos)

      });

      // Convierte la respuesta del servidor a JSON
      const resultado = await respuesta.json();

      // Muestra la respuesta en la consola para verificar
      console.log("Respuesta del servidor:", resultado);

      // Si el servidor respondió correctamente
      if (resultado.ok) {

        // Oculta el formulario
        document.getElementById("contenido-form").style.display = "none";

        // Muestra el mensaje de éxito
        document.getElementById("msg-exito").style.display = "block";

        // Limpia los campos del formulario
        formularioContacto.reset();

      } else {

        // Si ocurrió un problema se muestra el mensaje del servidor
        alert(resultado.mensaje || "No se pudo guardar");

      }

    } catch (error) {

      // Si ocurre un error de conexión se muestra en consola
      console.error("Error al enviar formulario:", error);

      // Mensaje para el usuario
      alert("Hubo un error al enviar el formulario");

    }

  });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Cargar productos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    inicializarEmailJS();
    cargarProductosDelAdmin();
    cargarEventListeners();
    if (loadMoreBtn) {
        loadMoreBtn.onclick = mostrarMasProductos;
    }
});

// Función de inicialización de EmailJS que faltaba
function inicializarEmailJS() {
    if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
}

// ==================== GESTIÓN DE SESIÓN ====================
function verificarSesion() {
    // Buscar sesión en localStorage o sessionStorage
    let sesion = JSON.parse(localStorage.getItem('sesion_zuarse'));
    if (!sesion) {
        sesion = JSON.parse(sessionStorage.getItem('sesion_zuarse'));
    }

    const menuAdmin = document.getElementById('menu-admin');
    const btnUsuario = document.getElementById('btn-usuario');
    const btnLoginVisible = document.getElementById('btn-login-visible');
    const adminBadge = document.getElementById('admin-badge');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const menuAdminItem = document.getElementById('menu-admin-item');
    const menuClienteItem = document.getElementById('menu-cliente-item');
    const btnComprar = document.getElementById('comprar-carrito');
    
    if (sesion && sesion.logueado) {
        // Usuario logueado
        if (btnLoginVisible) {
            btnLoginVisible.style.display = 'none';
        }
        if (btnUsuario) {
            btnUsuario.style.display = 'flex';
        }
        
        // Habilitar botón de compra
        if (btnComprar) {
            btnComprar.disabled = false;
            btnComprar.style.opacity = '1';
            btnComprar.style.cursor = 'pointer';
        }
        
        // Si es administrador
        if (sesion.tipo === 'admin') {
            if (adminBadge) {
                adminBadge.style.display = 'inline-block';
            }
            if (usuarioNombre) {
                usuarioNombre.textContent = '👤 Administrador';
            }
            if (menuAdmin) {
                menuAdmin.style.display = 'block';
            }
            if (menuAdminItem) {
                menuAdminItem.style.display = 'block';
            }
            if (menuClienteItem) {
                menuClienteItem.style.display = 'none';
            }
        } else {
            // Usuario normal
            if (adminBadge) {
                adminBadge.style.display = 'none';
            }
            if (usuarioNombre) {
                usuarioNombre.textContent = '👤 ' + (sesion.email ? sesion.email.split('@')[0] : 'Usuario');
            }
            if (menuAdmin) {
                menuAdmin.style.display = 'none';
            }
            if (menuAdminItem) {
                menuAdminItem.style.display = 'none';
            }
            if (menuClienteItem) {
                menuClienteItem.style.display = 'block';
            }
        }
    } else {
        // No hay sesión
        if (btnLoginVisible) {
            btnLoginVisible.style.display = 'block';
        }
        if (btnUsuario) {
            btnUsuario.style.display = 'none';
        }
        if (menuAdmin) {
            menuAdmin.style.display = 'none';
        }
        if (menuClienteItem) {
            menuClienteItem.style.display = 'none';
        }
        
        // Deshabilitar botón de compra
        if (btnComprar) {
            btnComprar.disabled = true;
            btnComprar.style.opacity = '0.5';
            btnComprar.style.cursor = 'not-allowed';
            btnComprar.title = 'Debes iniciar sesión para comprar';
        }
    }
}

function toggleMenuUsuario() {
    const menu = document.getElementById('menu-usuario');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function cerrarSesionUsuario() {
    localStorage.removeItem('sesion_zuarse');
    sessionStorage.removeItem('sesion_zuarse');
    window.location.href = 'login.html';
}

function cargarProductosDelAdmin() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const boxContainer = document.getElementById('lista-1');
    
    // Mantener los primeros 8 productos (o menos si no hay suficientes)
    const productosAMostrar = productos.slice(0, 8);
    
    if (productosAMostrar.length > 0) {
        // Limpiar solo si hay productos en el admin
        // Mantener la estructura existente y agregar los del admin
        productosAMostrar.forEach((prod, index) => {
            const box = document.createElement('div');
            box.className = 'box';
            if (index >= 8) {
                box.style.display = 'none';
            }
            box.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <div class="product-text">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.categoria || 'Calidad Premium'}</p>
                    <p class="precio">$${prod.precio.toFixed(2)}</p>
                    <a href="#" class="agregar-carrito btn-3" data-id="${prod.id}">
                        Agregar al carrito
                    </a>
                </div>
            `;
            
            // Reemplazar productos existentes o agregar nuevos
            const boxExistente = boxContainer.children[index];
            if (boxExistente) {
                boxContainer.replaceChild(box, boxExistente);
            } else {
                boxContainer.appendChild(box);
            }
        });
    }
}

function mostrarMasProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    let boxes = [...document.querySelectorAll('.box-container .box')];
    
    for (var i = currentItem; i < currentItem + 4 && i < boxes.length; i++) {
        boxes[i].style.display = 'inline-block';
    }
    
    currentItem += 4;
    
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
}

///////////////////////////////////////////////////////////////////////////////// CARRITO DE COMPRAS//////////////////////////////////////////////////////////
let carrito;
let elementos1;
let lista;
let vaciarCarritoBtn;
let comprarCarritoBtn;

function cargarEventListeners() {
    console.log('⚙️ [INIT] Cargando event listeners...');
    
    carrito = document.getElementById('carrito');
    elementos1 = document.getElementById('lista-1');
    lista = document.querySelector('#lista-carrito tbody');
    vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    comprarCarritoBtn = document.getElementById('comprar-carrito');
    
    console.log('📍 [INIT] Elementos encontrados:', {
        carrito: !!carrito,
        elementos1: !!elementos1,
        lista: !!lista,
        vaciarCarritoBtn: !!vaciarCarritoBtn,
        comprarCarritoBtn: !!comprarCarritoBtn
    });
    
    if (!elementos1 || !lista || !vaciarCarritoBtn || !comprarCarritoBtn) {
        console.error('❌ [INIT] Faltan elementos del carrito');
        return;
    }
    
    // Agregar event listeners
    elementos1.addEventListener('click', function(e) {
        comprarElemento(e);
    });
    
    if (carrito) {
        carrito.addEventListener('click', eliminarElemento);
    }
    
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    comprarCarritoBtn.addEventListener('click', realizarCompra);
    
    console.log('✅ [INIT] Event listeners configurados correctamente');
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {   
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('.agregar-carrito').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100" height="150">
        </td>
        <td>${elemento.titulo}</td>
        <td>${elemento.precio}</td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
    actualizarTotalCarrito();
}

function eliminarElemento(e) {
    e.preventDefault();
    let elemento;
    let elementoId;
    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
        elemento = e.target.parentElement.parentElement;
        elementoId = elemento.querySelector('a').getAttribute('data-id');
    }
    actualizarTotalCarrito();
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    actualizarTotalCarrito();
    return false;
}


function actualizarTotalCarrito() {
    const filas = lista.querySelectorAll('tr');
    let total = 0;

    filas.forEach(fila => {
        const precioText = fila.querySelector('td:nth-child(3)').textContent;

        // Elimina cualquier símbolo que no sea número o punto
        const precioLimpio = precioText.replace(/[^\d.]/g, '');

        const precio = parseFloat(precioLimpio) || 0;
        total += precio;
    });

    document.getElementById('total-carrito').textContent = total.toFixed(2);
}





// ==================== FUNCIÓN DE COMPRA ====================
async function realizarCompra(e) {
    if (e) e.preventDefault();

    console.log('🛒 [COMPRA] Iniciando proceso de compra...');

    // Verificar sesión (buscar en localStorage y sessionStorage)
    let sesion = JSON.parse(localStorage.getItem('sesion_zuarse'));
    if (!sesion) {
        sesion = JSON.parse(sessionStorage.getItem('sesion_zuarse'));
    }
    console.log('📋 [COMPRA] Sesión:', sesion);

    if (!sesion || !sesion.logueado) {
        console.error('❌ [COMPRA] Usuario no logueado');
        alert('⚠️ Por favor inicia sesión para realizar una compra');
        window.location.href = 'login.html';
        return;
    }

    if (sesion.tipo !== 'cliente') {
        console.error('❌ [COMPRA] La sesión actual no es de cliente');
        alert('⚠️ Solo los clientes pueden realizar compras');
        return;
    }

    // Verificar que el carrito esté inicializado
    if (!lista) {
        console.error('❌ [COMPRA] Lista de carrito no inicializada');
        lista = document.querySelector('#lista-carrito tbody');
    }

    if (!lista) {
        console.error('❌ [COMPRA] No se pudo encontrar el elemento #lista-carrito tbody');
        alert('Error técnico: No se pudo acceder al carrito');
        return;
    }

    // Obtener filas del carrito
    const filas = lista.querySelectorAll('tr');
    console.log('📦 [COMPRA] Filas en el carrito:', filas.length);

    if (filas.length === 0) {
        console.warn('⚠️ [COMPRA] Carrito vacío');
        alert('❌ Tu carrito está vacío. Agrega productos antes de confirmar el pedido.');
        return;
    }

    // Construir items del pedido
    const items = [];
    let total = 0;

    filas.forEach((fila, index) => {
        try {
            const celdas = fila.querySelectorAll('td');

            console.log('-------------------');
            console.log('Fila index:', index);
            console.log('HTML fila:', fila.innerHTML);
            console.log('Cantidad de celdas:', celdas.length);

            celdas.forEach((td, i) => {
                console.log(`Celda ${i}:`, td.textContent.trim());
            });

            if (celdas.length < 3) {
                console.warn(`⚠️ [COMPRA] Fila ${index} incompleta`);
                return;
            }

            const imagen = fila.querySelector('img') ? fila.querySelector('img').src : '';
            const nombre = celdas[1] ? celdas[1].textContent.trim() : 'Producto sin nombre';
            const precioText = celdas[2] ? celdas[2].textContent.trim() : '0';
            const precio = parseFloat(precioText.replace(/[^\d.]/g, '').trim());

            const botonBorrar = fila.querySelector('.borrar');
            const id = botonBorrar ? botonBorrar.getAttribute('data-id') : null;

            const cantidadInput = fila.querySelector('input[type="number"]');
            const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1;

            console.log('Nombre:', nombre);
            console.log('Precio texto:', precioText);
            console.log('Precio parseado:', precio);
            console.log('ID:', id);
            console.log('Cantidad:', cantidad);

            if (isNaN(precio)) {
                console.warn(`⚠️ [COMPRA] Precio inválido: ${precioText}`);
                return;
            }

            if (id === null || id === '' || isNaN(parseInt(id))) {
                console.warn(`⚠️ [COMPRA] ID inválido en la fila ${index}:`, id);
                return;
            }

            items.push({
                id: parseInt(id),
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: cantidad
            });

            total += precio * cantidad;

        } catch (error) {
            console.error(`❌ [COMPRA] Error procesando fila ${index}:`, error);
        }
    });

    console.log('DEBUG: Final items array constructed in realizarCompra:', items);
    console.log('✅ [COMPRA] Items procesados:', items.length, 'Total:', total);

    if (items.length === 0) {
        console.error('❌ [COMPRA] No se procesaron items');
        alert('Error: No se pudieron procesar los productos del carrito');
        return;
    }

    // Construir descripción para guardar en PEDIDOS.DESCRIPCION
    const descripcion = items
        .map(item => `${item.nombre} x${item.cantidad} - ₡${item.precio.toFixed(2)}`)
        .join(' | ');

    // Mostrar pasarela de pago antes de procesar
    mostrarPasarelaPago(total, async function() {
        // Crear pedido local para usarlo en confirmación/email
        const pedido = {
            id: null,
            cliente_email: sesion.email || sesion.usuario,
            cliente_nombre: sesion.email ? sesion.email.split('@')[0] : sesion.usuario,
            items: items,
            total: parseFloat(total.toFixed(2)),
            fecha: new Date().toISOString(),
            estado: 'procesando',
            estado_pago: 'PAGADO',
            tipo_pago: 'Contado',
            descripcion: descripcion
        };

        console.log('DEBUG: Pedido object created before saving and PDF generation (script.js):', pedido);
        console.log('📝 [COMPRA] Pedido creado:', pedido);

        try {
            const productos = items.map(item => ({
                id: item.id,
                cantidad: item.cantidad
            }));

            console.log('Productos a enviar:', productos);

            const respuesta = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_cliente: sesion.id,
                    fecha: new Date().toISOString().split('T')[0],
                    estado: 'procesando',
                    tipo_pago: 'Contado',
                    descripcion: descripcion,
                    total: parseFloat(total.toFixed(2)),
                    productos: productos
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                console.error('❌ [COMPRA] Error respuesta servidor:', data);
                alert(data.mensaje || 'Error al guardar el pedido en la base de datos');
                return;
            }

            console.log('✅ [COMPRA] Pedido guardado en BD:', data);

            // usar el ID real de la BD
            pedido.id = data.id_pedido;

        } catch (error) {
            console.error('❌ [COMPRA] Error guardando pedido en BD:', error);
            alert('Error al guardar el pedido en la base de datos');
            return;
        }

        // Mostrar confirmación
        mostrarConfirmacionCompra(pedido);

        // Enviar email (sin bloquear)
        enviarEmailPedido(pedido);

        // Limpiar carrito
        vaciarCarrito();

        console.log('✨ [COMPRA] Proceso completado exitosamente');
    });
}






function mostrarConfirmacionCompra(pedido) {
    const itemsResumen = pedido.items.map(item => `  • ${item.nombre}: $${item.precio.toFixed(2)}`).join('\n');
    
    const confirmacion = `✅ ¡PEDIDO CONFIRMADO EXITOSAMENTE!

═══════════════════════════════════════════════════════════
DETALLES DE TU PEDIDO:
═══════════════════════════════════════════════════════════

ID del Pedido: ${pedido.id}
Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-ES')} ${new Date(pedido.fecha).toLocaleTimeString('es-ES')}

PRODUCTOS:
${itemsResumen}

═══════════════════════════════════════════════════════════
TOTAL: $${pedido.total.toFixed(2)}
═══════════════════════════════════════════════════════════

✉️ Se ha enviado un comprobante detallado a tu email: ${pedido.cliente_email}
📧 Revisa tu bandeja de entrada (o spam) para ver el comprobante

¿Deseas descargar tu comprobante en PDF ahora?
    `;
    
    if (confirm(confirmacion)) {
        generarPDFCliente(pedido);
    }
}

function generarPDFCliente(pedido) {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.backgroundColor = '#fff';
    element.style.color = '#333';
    
    let itemsHTML = '';
    pedido.items.forEach(item => {
        itemsHTML += `
            <tr style="color: #333;">
                <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #333;">${item.nombre}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #333;">$${item.precio.toFixed(2)}</td>
            </tr>
        `;
    });
    
    console.log('DEBUG: Pedido object received by generarPDFCliente:', pedido);
    console.log('DEBUG: Items array received by generarPDFCliente:', pedido.items);

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
        <p><strong>Email:</strong> ${pedido.cliente_email}</p>
        
        <h3 style="color: #333; margin-top: 25px;">Detalles de la Compra</h3>
        <table style="width: 100%; border-collapse: collapse; color: #333;">
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
            <p>Gracias por tu compra en ZUARSE.</p>
            <p>Tu pedido ha sido registrado y puedes consultarlo en tu panel de cliente.</p>
            <p>Generado el: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>
    `;
    
    console.log('DEBUG: HTML content for PDF generation in generarPDFCliente:', element.innerHTML);

    const options = {
        margin: 10,
        filename: `pedido-${pedido.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(options).from(element).save();
}



// ==================== ENVÍO DE EMAIL AUTOMÁTICO ====================
function enviarEmailPedido(pedido) {
    // Esperar a que EmailJS esté disponible
    if (typeof emailjs === 'undefined') {
        console.log('⚠️ EmailJS no está cargado aún');
        return;
    }
    
    // Validar configuración
    if (typeof EMAILJS_CONFIG === 'undefined' || !validarConfiguracionEmailJS()) {
        console.log('⚠️ EmailJS no está configurado. Se guardó el pedido pero no se envió email.');
        return;
    }
    
    // Construir contenido del email
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
    
    console.log('📧 [EMAIL] Enviando con parámetros:', templateParams);
    
    // Enviar email silenciosamente (sin bloquear la experiencia del usuario)
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('✅ Email de confirmación enviado exitosamente al cliente:', pedido.cliente_email);
            console.log('📧 [EMAIL] Respuesta:', response);
        })
        .catch(function(error) {
            console.log('⚠️ Error al enviar email. Verifica que la plantilla tenga las variables correctas en EmailJS');
            console.error('❌ Error detallado:', error);
        });
}

function guardarPedido(pedido) {
    try {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        console.log('✅ [GUARDAR] Pedido guardado. Total:', pedidos.length);
        return true;
    } catch (error) {
        console.error('❌ [GUARDAR] Error al guardar pedido:', error);
        return false;
    }
}

// ==================== PASARELA DE PAGO SIMULADA ====================
function inyectarEstilosPasarela() {
    if (document.getElementById('estilos-pasarela')) return;
    
    const style = document.createElement('style');
    style.id = 'estilos-pasarela';
    style.textContent = `
        .modal-pago-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        .modal-pago {
            background: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-pago h2 {
            margin-top: 0;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
            font-size: 22px;
        }
        .form-group-pago {
            margin-bottom: 15px;
        }
        .form-group-pago label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-size: 14px;
            font-weight: 600;
        }
        .form-group-pago input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        .form-group-pago input:focus {
            border-color: #667eea;
            outline: none;
        }
        .form-row-pago {
            display: flex;
            gap: 15px;
        }
        .btn-pagar {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-pagar:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-cancelar-pago {
            width: 100%;
            padding: 10px;
            background: transparent;
            color: #888;
            border: none;
            margin-top: 10px;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-cancelar-pago:hover {
            color: #555;
        }
        .total-pago {
            text-align: center;
            font-size: 28px;
            font-weight: 800;
            color: #333;
            margin: 10px 0 20px 0;
        }
        .tarjetas-iconos {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: #666;
            letter-spacing: 15px;
        }
    `;
    document.head.appendChild(style);
}

function mostrarPasarelaPago(total, callbackExito) {
    inyectarEstilosPasarela();

    const overlay = document.createElement('div');
    overlay.className = 'modal-pago-overlay';
    
    overlay.innerHTML = `
        <div class="modal-pago">
            <h2>Pago Seguro</h2>
            <div class="tarjetas-iconos">💳 💳 💳</div>
            <div class="total-pago">$${total.toFixed(2)}</div>
            
            <form id="form-pago">
                <div class="form-group-pago">
                    <label>Titular de la tarjeta</label>
                    <input type="text" placeholder="Nombre como aparece en la tarjeta" required>
                </div>
                <div class="form-group-pago">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required>
                </div>
                <div class="form-row-pago">
                    <div class="form-group-pago" style="flex: 1">
                        <label>Vencimiento</label>
                        <input type="text" placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="form-group-pago" style="flex: 1">
                        <label>CVV</label>
                        <input type="password" placeholder="123" maxlength="3" required>
                    </div>
                </div>
                <button type="submit" class="btn-pagar">Pagar Ahora</button>
                <button type="button" class="btn-cancelar-pago">Cancelar</button>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector('#form-pago');
    const btnCancelar = overlay.querySelector('.btn-cancelar-pago');
    const btnPagar = overlay.querySelector('.btn-pagar');

    // Formateo simple de tarjeta
    const inputTarjeta = overlay.querySelector('input[placeholder="0000 0000 0000 0000"]');
    inputTarjeta.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    btnCancelar.addEventListener('click', () => {
        overlay.remove();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulación de proceso de pago
        btnPagar.innerHTML = 'Procesando pago... <span style="display:inline-block; animation: spin 1s linear infinite">↻</span>';
        btnPagar.disabled = true;
        btnPagar.style.opacity = '0.7';
        
        setTimeout(() => {
            overlay.remove();
            if (callbackExito) callbackExito();
        }, 2000); // 2 segundos de delay simulado
    });
}