# ZUARSE - Sistema de Gestión de Tienda Online

ZUARSE es una aplicación web completa para la gestión de una tienda en línea, desarrollada íntegramente en el lado del cliente (frontend) utilizando HTML, CSS y JavaScript. No requiere un backend ni una base de datos, ya que toda la información se persiste en el `localStorage` del navegador.

Este proyecto simula un entorno de e-commerce real, incluyendo un catálogo de productos, carrito de compras, autenticación de usuarios y un panel de administración robusto para gestionar todos los aspectos de la tienda.

## ✨ Características Principales

### 🏪 Tienda para Clientes (`index.html`)
- **Catálogo de Productos**: Visualización de productos con imágenes, precios y descripciones.
- **Carga Dinámica**: Botón "Cargar Más" para mostrar productos adicionales.
- **Carrito de Compras**: Funcionalidad completa para agregar, eliminar y vaciar el carrito.
- **Flujo de Compra Completo**: Desde la confirmación del pedido hasta la generación de un comprobante.
- **Generación de PDF**: Los clientes pueden descargar un comprobante de su compra en formato PDF.
- **Sesión de Usuario**: Sistema de inicio de sesión y registro para clientes.

### 🔐 Autenticación y Seguridad
- **Roles de Usuario**: Separación clara entre **Usuarios Normales** y **Administradores**.
- **Registro de Usuarios**: Los nuevos clientes pueden crear una cuenta.
- **Encriptación de Contraseñas**: Las contraseñas se almacenan encriptadas usando Base64 y una clave secreta (`SECRET_KEY`).
- **Recuperación de Contraseña**: Sistema de 3 pasos basado en preguntas de seguridad.
- **Protección de Rutas**: El panel de administración (`admin.html`) es inaccesible sin una sesión de administrador activa.

### 📊 Panel de Administración (`admin.html`)
Un panel centralizado para gestionar toda la tienda:
- **Gestión de Productos**: CRUD (Crear, Leer, Actualizar, Eliminar) completo para productos.
- **Gestión de Categorías**: CRUD para organizar los productos.
- **Gestión de Clientes**: CRUD para la información de los clientes.
- **Gestión de Proveedores**: CRUD para los proveedores de la tienda.
- **Gestión de Compras**: Registro de compras a proveedores para control de inventario.
- **Gestión de Pedidos**:
    - Visualización de todos los pedidos de los clientes.
    - Filtros por estado (Pendiente, Procesando, Completado, Cancelado).
    - Opción para cambiar el estado de un pedido.
    - Descargar el comprobante del pedido en PDF.
    - **Enviar comprobante por email** al cliente (requiere configuración de EmailJS).
- **Notificaciones**: Un feed de los pedidos más recientes.

### 📧 Notificaciones por Email
- **Integración con EmailJS**: Envío automático de emails de confirmación de pedido.
- **Configuración Sencilla**: Las credenciales se gestionan en `config.js`.
- **Guía Detallada**: El archivo `EMAILJS_SETUP.md` explica paso a paso cómo configurar el servicio.

## 🚀 Cómo Empezar

Este proyecto no requiere un servidor web. Puedes ejecutarlo directamente en tu navegador.

1.  **Clona o descarga el repositorio.**
2.  Abre el archivo `index.html` en tu navegador para ver la tienda.
3.  Para acceder al panel de inicio de sesión, haz clic en "Iniciar Sesión" o navega directamente a `login.html`.

### Credenciales de Prueba

#### Usuario Normal (Tienda)
-   **Email:** `usuario@test.com`
-   **Contraseña:** `usuario123`

#### Administrador (Panel Admin)
-   **Usuario:** `admin`
-   **Contraseña:** `admin123`

## ⚙️ Flujos de Funcionamiento

### Flujo de Compra
El proceso que sigue un cliente para realizar un pedido está documentado en detalle en `FLUJO_COMPRA.md`. El resumen es:
1.  El usuario agrega productos al carrito.
2.  Hace clic en "Confirmar Pedido".
3.  El sistema valida que el usuario haya iniciado sesión y que el carrito no esté vacío.
4.  Se muestra una pasarela de pago simulada.
5.  Se crea un objeto `pedido` con un ID único, los items, el total y la fecha.
6.  El pedido se guarda en `localStorage`.
7.  Se envía un email de confirmación (si está configurado).
8.  Se muestra un mensaje de éxito con la opción de descargar el comprobante en PDF.

### Flujo de Autenticación
1.  **Registro (`registro.html`)**: Un nuevo usuario proporciona su email, contraseña y una respuesta a una pregunta de seguridad. El sistema crea una cuenta de usuario y, automáticamente, un perfil de cliente en el panel de administración.
2.  **Login (`login.html`)**: El usuario o el administrador ingresan sus credenciales. El sistema verifica los datos contra la información encriptada en `localStorage`.
3.  **Sesión**: Se crea una sesión en `localStorage` (si se marca "Recuérdame") o en `sessionStorage`, redirigiendo al usuario a la tienda (`index.html`) o al administrador al panel (`admin.html`).

## 🛠️ Detalles Técnicos

### Almacenamiento de Datos
La aplicación utiliza `localStorage` para simular una base de datos. Los datos clave son:
-   `usuarios_zuarse`: Objeto con los usuarios registrados y sus contraseñas encriptadas.
-   `clientes`: Array de objetos, cada uno representando un cliente.
-   `productos`: Array de objetos de productos.
-   `categorias`: Array de objetos de categorías.
-   `proveedores`: Array de objetos de proveedores.
-   `compras`: Array de registros de compras a proveedores.
-   `pedidos`: Array de todos los pedidos realizados por los clientes.
-   `sesion_zuarse`: Objeto que contiene la información de la sesión activa.

### Encriptación de Contraseñas
La encriptación es un método simple para fines demostrativos. En `login.js` y `registro.js`, la función `encriptarPassword` se encarga de esto:
```javascript
function encriptarPassword(password) {
    // Clave secreta definida en el script
    const SECRET_KEY = 'zuarse_secret_2024';
    return btoa(password + SECRET_KEY); // Codificación Base64
}
```
**Nota**: Para un entorno de producción real, se recomienda utilizar algoritmos de hash seguros como Argon2 o bcrypt en un entorno de servidor.

### Dependencias Externas
El proyecto utiliza dos librerías externas incluidas directamente en los archivos HTML:
-   **html2pdf.js**: Para generar los comprobantes de pedido en formato PDF.
-   **EmailJS Browser SDK**: Para enviar emails desde el lado del cliente sin un backend.

## 📂 Estructura de Archivos
```
.
├── admin.html                # Panel administrativo
├── admin.js                  # Lógica del panel administrativo (CRUDs)
├── admin-style.css           # Estilos para el panel
├── config.js                 # Configuración de EmailJS
├── contactos.html            # Página de contacto
├── index.html                # Página principal de la tienda
├── login.html                # Página de inicio de sesión para usuarios y admin
├── login.js                  # Lógica de autenticación y sesión
├── login-style.css           # Estilos para login, registro y recuperación
├── productos.html            # Página de listado de productos
├── recuperar-password.html   # Página para recuperar contraseña
├── recuperar-password.js     # Lógica de recuperación de contraseña
├── registro.html             # Página de registro de nuevos usuarios
├── registro.js               # Lógica de registro de usuarios
├── script.js                 # Lógica de la tienda (carrito, pedidos de cliente)
├── style.css                 # Estilos principales de la tienda
├── images/                   # Carpeta para imágenes de productos
├── EMAILJS_SETUP.md          # Guía detallada para configurar EmailJS
├── FLUJO_COMPRA.md           # Documentación del flujo de compra
└── README.md                 # Este archivo
```

## 🧠 Funciones Clave del Código

#### `script.js` (Lógica de la Tienda)
-   `verificarSesion()`: Comprueba si hay un usuario logueado y actualiza la UI.
-   `realizarCompra()`: Orquesta todo el proceso de compra.
-   `mostrarPasarelaPago()`: Simula una interfaz de pago antes de confirmar el pedido.
-   `guardarPedido()`: Guarda el pedido en `localStorage`.
-   `mostrarConfirmacionCompra()`: Muestra el resumen del pedido al cliente.
-   `generarPDFCliente()`: Genera y descarga el PDF para el cliente.
-   `enviarEmailPedido()`: Envía la confirmación por email usando EmailJS.

#### `admin.js` (Lógica del Panel de Administración)
-   `cambiarTab()`: Gestiona la navegación entre las pestañas del panel.
-   `cargarProductos()`, `cargarClientes()`, `cargarPedidos()`, etc.: Funciones que leen de `localStorage` y renderizan las tablas de datos.
-   `guardarProducto()`, `guardarCliente()`, etc.: Manejan la creación y edición de registros.
-   `eliminarProducto()`, `eliminarCliente()`, etc.: Eliminan registros.
-   `verDetallesPedido()`: Muestra un modal con la información completa de un pedido.
-   `guardarEstadoPedido()`: Actualiza el estado de un pedido.
-   `descargarPedidoPDF()`: Llama a la función para generar el PDF desde el panel de admin.
-   `enviarPedidoPorEmail()`: Envía el email del pedido desde el panel de admin.

#### `login.js` / `registro.js` / `recuperar-password.js`
-   `loginUsuario()`, `loginAdmin()`: Validan las credenciales y gestionan el inicio de sesión.
-   `registrarUsuario()`: Valida los datos del formulario de registro, encripta la contraseña y crea el nuevo usuario y cliente.
-   `buscarUsuario()`, `verificarRespuesta()`, `cambiarPassword()`: Gestionan los pasos del flujo de recuperación de contraseña.

## 🔮 Próximas Mejoras Sugeridas
-   [ ] **Dashboard de Métricas**: Añadir una pestaña de "Reportes" con gráficos de ventas por fecha, productos más vendidos, etc.
-   [ ] **Integración con Pasarela de Pagos Real**: Reemplazar la pasarela simulada con una real como Stripe o Mercado Pago.
-   [ ] **Backup y Restauración**: Funcionalidad para que el administrador pueda exportar todos los datos de `localStorage` a un archivo JSON y restaurarlos.
-   [ ] **Paginación**: En lugar de "Cargar Más", implementar un sistema de paginación en la tienda y en el panel de administración para manejar grandes volúmenes de datos.
-   [ ] **Refactorización a Módulos ES6**: Organizar el código JavaScript en módulos para mejorar la mantenibilidad.
