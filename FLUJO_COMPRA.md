# Guía de Flujo de Compra - ZUARSE

## Resumen del Flujo

```
Usuario visita index.html
      ↓
Busca productos
      ↓
Agrega productos al carrito
      ↓
Hace clic en "✓ Confirmar Pedido"
      ↓
¿Usuario logueado?
   ├─ NO → Pregunta si quiere ir a login
   │        └─→ login.html (inicia sesión o se registra)
   │
   └─ SÍ → Valida carrito no vacío
           ↓
           Crea pedido con:
           - ID único
           - Items del carrito
           - Total
           - Fecha actual
           - Estado: pendiente
           ↓
           ✅ Guarda en localStorage
           ✅ Envía email automático (si EmailJS configurado)
           ↓
           Muestra confirmación con detalles
           ↓
           ¿Descargar PDF?
           ├─ SÍ → Descarga PDF
           └─ NO → Vuelve a tienda
           ↓
           Pedido aparece en:
           - Panel admin > Pedidos
           - Historial del cliente
```

## Validaciones

### 1. Sesión del Usuario
- ✅ Valida si usuario está logueado
- ✅ Si NO está logueado:
  - Muestra mensaje explicativo
  - Ofrece ir a login.html
  - Usuario puede iniciar sesión O crear cuenta

### 2. Carrito
- ✅ Valida que carrito no esté vacío
- ✅ Si está vacío:
  - Muestra mensaje
  - No permite crear pedido

### 3. Datos del Pedido
- ✅ Extrae items del carrito
- ✅ Calcula total automáticamente
- ✅ Obtiene datos del usuario de la sesión
- ✅ Genera ID único del pedido

## Opciones en la Confirmación

Después de confirmar el pedido, el usuario ve:

1. **Detalles del Pedido:**
   - ID único
   - Fecha y hora
   - Lista de productos
   - Total

2. **Acciones:**
   - ✅ Aceptar → Descarga PDF
   - ❌ Cancelar → Vuelve a tienda

3. **Email:**
   - Se envía automáticamente
   - Si EmailJS está configurado
   - Si no, muestra nota informativa

## En el Panel Administrativo

El admin puede ver:

1. **Pestaña "Pedidos":**
   - Todos los pedidos creados
   - Filtrados por estado
   - Detalles completos
   - Opción cambiar estado
   - Opción descargar PDF
   - Opción enviar email

2. **Pestaña "Clientes":**
   - Cliente que hizo el pedido
   - Información de contacto
   - Fecha de registro

## Mensajes al Usuario

### Si no ha iniciado sesión
```
⚠️ Debes iniciar sesión para realizar una compra.
¿Deseas ir a la página de login?
Ahí puedes iniciar sesión o crear una cuenta nueva.
```

### Si carrito está vacío
```
❌ Tu carrito está vacío.
Agrega productos antes de confirmar el pedido.
```

### Después de confirmar
```
✅ ¡PEDIDO CONFIRMADO EXITOSAMENTE!

[Detalles completos del pedido]

✉️ Se ha enviado un comprobante detallado a tu email

¿Deseas descargar tu comprobante en PDF ahora?
```

## Datos Guardados

### En localStorage:
1. **pedidos** - Array de todos los pedidos
2. **usuarios_zuarse** - Usuarios registrados
3. **clientes** - Información de clientes
4. **sesion_zuarse** - Sesión actual

### Estructura de Pedido
```javascript
{
  id: "PED-1705348600000-XYZ1234",
  cliente_email: "usuario@test.com",
  cliente_nombre: "usuario",
  items: [
    { nombre: "Producto", precio: 19.99, imagen: "..." }
  ],
  total: 19.99,
  fecha: "2026-01-28T12:30:45.123Z",
  estado: "pendiente"
}
```

## Configuración

### Requerida:
- Ninguna (funciona de base)

### Opcional:
- **EmailJS** para envío automático de emails
- Ver: EMAILJS_SETUP.md

## Troubleshooting

### "Mi carrito no crea pedido"
1. ✓ Asegúrate de haber iniciado sesión
2. ✓ Verifica que haya productos en el carrito
3. ✓ Abre consola (F12) para ver errores

### "No recibo el email"
1. ✓ Verifica que EmailJS esté configurado
2. ✓ Revisa carpeta spam
3. ✓ Verifica el email en tu perfil

### "El botón no funciona"
1. ✓ Recarga la página (F5)
2. ✓ Comprueba conexión a internet
3. ✓ Abre consola (F12) para errores

## Funciones Clave

### En script.js:
- `realizarCompra(e)` - Procesa la compra
- `mostrarConfirmacionCompra(pedido)` - Muestra resumen
- `generarPDFCliente(pedido)` - Descarga PDF
- `enviarEmailPedido(pedido)` - Envía email
- `guardarPedido(pedido)` - Guarda en localStorage

### En admin.js:
- `cargarPedidos()` - Carga todos los pedidos
- `verDetallesPedido(id)` - Muestra detalles
- `guardarEstadoPedido()` - Actualiza estado
- `descargarPedidoPDF(id)` - Descarga PDF
- `enviarPedidoPorEmail(id)` - Envía email

---

**Última actualización:** 28 de enero de 2026
