# Sistema de Gestión ZUARSE

## 🔐 Sistema de Autenticación

Se ha implementado un sistema completo de login que separa **usuarios normales** de **administradores**.

### Credenciales de Prueba

#### Usuario Normal (Tienda)
- **Email:** `usuario@test.com`
- **Contraseña:** `usuario123`

#### Administrador (Panel Admin)
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Acceso

1. **Usuarios Normales:**
   - Dirección: `login.html` → Tab "Usuario"
   - Ingresa email y contraseña registrados
   - ✅ Redirige automáticamente a `index.html`
   - Acceso a la tienda con carrito de compras
   - Pueden ver productos y realizar compras

2. **Administradores:**
   - Dirección: `login.html` → Tab "Administrador"
   - Ingresa usuario "admin" y contraseña
   - ✅ Redirige automáticamente a `admin.html`
   - Acceso al panel administrativo
   - Pueden gestionar productos, clientes y pedidos

### Flujo de Autenticación

```
registro.html (público)
    ↓
Crear cuenta nueva
    ↓
✅ Guarda usuario + ✅ Crea cliente automático
    ↓
Redirige a login.html
    ↓
[Tipo de Usuario]
    ↙          ↘
Usuario        Admin
  ↓              ↓
index.html   admin.html
(Tienda)     (Panel Admin)
```

### Flujo de Compra

```
index.html
    ↓
1. Agregar productos al carrito
    ↓
2. Confirmar pedido
    ↓
3. Sistema valida sesión
    ↓
4. Crea pedido + Guarda datos
    ↓
5. ✅ Envía notificación por email
    ↓
6. Muestra confirmación + PDF
    ↓
7. Pedido visible en admin.html (Pedidos)
```

## 📊 Panel Administrativo

### Características:

✅ **Gestión de Productos**
- Crear, editar, eliminar productos
- Campos: nombre, descripción, precio, imagen, stock, categoría
- **Buscadores en tiempo real** por nombre y categoría

✅ **Gestión de Categorías**
- Crear, editar, eliminar categorías
- **Buscador en tiempo real** por nombre

✅ **Gestión de Clientes**
- Crear, editar, eliminar clientes
- Campos: nombre, email, teléfono, dirección, ciudad, estado
- **Buscador inteligente** (ignora tildes y corrige errores ortográficos leves)

✅ **Gestión de Pedidos**
- Ver todos los pedidos generados desde la tienda
- Filtrar pedidos por estado (pendiente, procesando, completado, cancelado)
- Ver detalles completos de cada pedido (items, cliente, fecha, total)
- Cambiar estado de los pedidos
- **Descargar PDF del comprobante** de compra
- **Enviar comprobante por Email** al cliente
- Eliminar pedidos

✅ **Gestión de Compras**
- Registrar nuevas compras asociadas a proveedores
- Selección dinámica de productos filtrados por categoría
- Ingreso detallado de cantidad y costo unitario por producto
- Cálculo automático de totales
- Historial completo de compras
- Buscador en tiempo real por nombre de proveedor

✅ **Reportes**
- Total de productos
- Total de clientes
- Ingresos estimados
- Exportar datos a JSON
- Limpiar base de datos

## 🏪 Tienda (Usuarios Normales)

✅ Ver productos agregados desde el admin
✅ Carrito de compras
✅ Botón "Cargar Más" para productos
✅ Menú de usuario con opción de cerrar sesión

## � Encriptación de Contraseñas

✅ **Todas las contraseñas están encriptadas** usando Base64 + clave secreta
✅ Las contraseñas NO se almacenan en texto plano
✅ Cada contraseña tiene una encriptación única
✅ Verificación segura al iniciar sesión

### Cómo funciona:
```
Contraseña ingresada → Encriptación → Comparación con encriptada en localStorage
```

## 🔑 Sistema de Recuperación de Contraseña

Se accede en: `recuperar-password.html` o desde el enlace en login

### Proceso de 3 pasos:

**1. Verificación de Email:**
- Ingresa tu email registrado
- El sistema busca la cuenta

**2. Pregunta de Seguridad:**
- Se muestra tu pregunta de seguridad guardada
- Debes responder correctamente
- La respuesta es case-insensitive

**3. Nueva Contraseña:**
- Crea una nueva contraseña (mínimo 6 caracteres)
- Confirma que sean iguales
- Tu contraseña se actualiza encriptada

### Preguntas de Seguridad Disponibles:
- ¿Cuál es el nombre de tu mascota favorita?
- ¿En qué ciudad naciste?
- ¿Cuál es el nombre de tu madre?
- ¿Cuál es tu película favorita?
- ¿En qué año naciste?

## �💾 Almacenamiento

- Usa **localStorage** para persistencia
- Sesiones guardadas automáticamente
- Los datos persisten al cerrar/reabrir navegador

## 🔑 Funcionalidades de Seguridad

✅ Protección de admin.html - solo accesible si está autenticado como admin
✅ Opción de "Recuérdame" para usuarios normales
✅ Cerrar sesión en cualquier momento
✅ Validación de credenciales
✅ **Encriptación de contraseñas** - todas las contraseñas están encriptadas en localStorage
✅ **Sistema de recuperación de contraseña** con preguntas de seguridad

## � Sistema de Carrito y Pedidos

### Funcionamiento del Carrito:

1. **Agregar al Carrito:**
   - Click en "Agregar al carrito" en cualquier producto
   - Se añade a la lista del carrito (accesible desde el icono de carrito)
   - Se calcula automáticamente el total

2. **Opciones del Carrito:**
   - Eliminar items individuales (botón X)
   - Ver total actualizado en tiempo real
   - Vaciar todo el carrito
   - **Confirmar Pedido** - Realiza la compra

3. **Generar Pedido:**
   - Click en "Confirmar Pedido"
   - El sistema valida que el usuario esté logueado
   - Crea un pedido con los datos del cliente
   - Guarda los items, total y fecha
   - ✅ **Envía automáticamente notificación al email registrado** (si EmailJS está configurado)
   - Muestra confirmación y opción para descargar PDF
   - Limpia el carrito

### Seguimiento de Pedidos (Admin):

En el panel administrativo, hay un nuevo tab **"Pedidos"** donde se pueden:

✅ **Ver Pedidos:**
- Lista de todos los pedidos realizados
- Información: ID, cliente, fecha, total, estado

✅ **Filtrar Pedidos:**
- Por estado: Pendiente, Procesando, Completado, Cancelado

✅ **Ver Detalles:**
- Click en "Ver" para ver detalles completos
- Lista de items comprados
- Información del cliente
- Fecha y hora exacta

✅ **Cambiar Estado:**
- Dentro del modal de detalles
- Cambiar a: Pendiente, Procesando, Completado, Cancelado
- Actualizar automáticamente

✅ **Eliminar Pedidos:**
- Opción para eliminar pedidos (con confirmación)

### Estados de Pedidos:

- **Pendiente** (⚠️ Amarillo): Recién creado, esperando procesamiento
- **Procesando** (🔵 Azul): En proceso de preparación
- **Completado** (✅ Verde): Entregado al cliente
- **Cancelado** (❌ Rojo): Cancelado por algún motivo

## 📄 Comprobantes PDF y Envío por Email

### Generar PDF del Pedido

Se pueden generar PDFs de comprobante de dos formas:

1. **Desde la Tienda (Cliente):**
   - Cuando confirmas un pedido, se ofrece opción de descargar PDF
   - Se descarga automáticamente con nombre: `pedido-[ID].pdf`

2. **Desde Panel Admin:**
   - Clickea en "Ver" en la tabla de pedidos
   - Click en botón "📥 Descargar PDF" en el modal
   - Se descarga el comprobante en PDF

### Enviar Comprobante por Email

El sistema integra EmailJS para enviar comprobantes por correo:

1. **Desde Panel Admin:**
   - Abre detalles del pedido (click en "Ver")
   - Click en botón "📧 Enviar por Email"
   - Se envía automáticamente al email registrado del cliente

2. **Configuración de EmailJS (Opcional):**
   - Para usar la funcionalidad de email, debes configurar EmailJS
   - Registrarse en: https://www.emailjs.com (es gratuito)
   - **Ver archivo: EMAILJS_SETUP.md para instrucciones detalladas**
   - Actualizar credenciales en config.js
   - Crear un servicio y plantilla de email en EmailJS

3. **Sin configuración:**
   - Los PDFs se descargan correctamente en cualquier caso
   - Los emails requieren configuración de EmailJS
   - El sistema mostrará instrucciones si falta la configuración

### Contenido del PDF

Cada PDF incluye:
- Logo y nombre de la empresa (ZUARSE)
- ID único del pedido
- Fecha y hora exacta
- Estado del pedido
- Información del cliente
- Lista de productos con precios
- Total de la compra
- Pie de página con información de contacto



Se ha implementado un sistema completo de registro que permite a nuevos usuarios crear sus propias cuentas.

### Acceso al Registro

1. **Desde Login:** Clickea en "Crear cuenta" en el formulario de login
2. **URL Directa:** `registro.html`

### Proceso de Registro:

**1. Ingresar Email:**
- Email debe ser válido y no estar registrado
- El sistema verifica que no exista otro usuario con el mismo email

**2. Crear Contraseña:**
- Mínimo 6 caracteres
- Debe confirmar la contraseña (deben coincidir)
- Se encripta automáticamente con Base64 + clave secreta

**3. Pregunta de Seguridad:**
- Selecciona una pregunta de seguridad
- Ingresa tu respuesta
- Se utilizará para recuperación de contraseña

**4. Confirmación:**
- Se validan todos los datos
- ✅ Se guarda el usuario en localStorage
- ✅ **Se crea automáticamente un cliente en el módulo administrativo**
- Se redirige automáticamente a login

### Validaciones Implementadas:

✅ Email válido y no duplicado
✅ Contraseña mínimo 6 caracteres
✅ Confirmación de contraseña
✅ Pregunta de seguridad seleccionada
✅ Respuesta de seguridad no vacía
✅ Mensajes de error claros
✅ Encriptación de contraseña automática

## 📝 Estructura de Archivos

```
├── login.html                # Página de autenticación
├── login.js                  # Lógica de login con encriptación
├── login-style.css           # Estilos de login y recuperación
├── recuperar-password.html   # Página de recuperación de contraseña
├── recuperar-password.js     # Lógica de recuperación (usuarios y admins)
├── registro.html             # Página de registro de nuevos usuarios
├── registro.js               # Lógica de registro con validaciones
├── admin.html                # Panel administrativo con módulo de pedidos
├── admin.js                  # Lógica del admin (CRUD de productos/clientes/pedidos)
├── admin-style.css           # Estilos del panel admin
├── index.html                # Tienda principal con carrito mejorado
├── script.js                 # Lógica de tienda (carrito con generación de pedidos, sesiones)
├── style.css                 # Estilos de tienda
├── config.js                 # Configuración de EmailJS para envío de emails
├── images/                   # Carpeta para imágenes de productos
├── EMAILJS_SETUP.md          # Guía de configuración de EmailJS
├── FLUJO_COMPRA.md           # Guía detallada del flujo de compra y pedidos
└── README.md                 # Este archivo
```

## 🚀 Próximas Mejoras Sugeridas

- [x] Encriptar contraseñas
- [x] Sistema de recuperación de contraseña
- [x] Registro de nuevos usuarios
- [x] Historial de compras
- [ ] Dashboard de ventas por fecha
- [ ] Integración con pasarela de pagos
- [ ] Notificaciones por email
- [ ] Backup automático de datos
