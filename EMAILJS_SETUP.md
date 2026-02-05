# Configuración de EmailJS para ZUARSE

## ¿Qué es EmailJS?

EmailJS es un servicio gratuito que permite enviar emails directamente desde tu aplicación web sin necesidad de un servidor backend.

## Pasos para Configurar

### 1. Registrarse en EmailJS

1. Ve a https://www.emailjs.com/
2. Click en "Sign Up" (es completamente gratis)
3. Registrate con tu email (o usa GitHub/Google)
4. Verifica tu correo electrónico

### 2. Crear un Servicio de Email

1. En el dashboard, ve a "Email Services"
2. Click en "Add Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. **Para Gmail:**
   - Ingresa tu dirección de Gmail
   - Autoriza el acceso de EmailJS
   - Sigue las instrucciones de seguridad de Google
5. Copia el **Service ID** (se vería así: `service_xxxxxxxxxxxxx`)

### 3. Crear una Plantilla de Email

1. Ve a "Email Templates"
2. Click en "Create New Template"
3. Usa esta plantilla como ejemplo:

```
Asunto: Tu Comprobante de Pedido - {{order_id}}

Cuerpo:

Hola {{to_name}},

Agradecemos tu compra en ZUARSE.

DETALLES DE TU PEDIDO:
- ID: {{order_id}}
- Fecha: {{order_date}}
- Estado: {{order_status}}

PRODUCTOS:
{{order_items}}

TOTAL: ${{order_total}}

Si tienes preguntas, contáctanos a pedidos@zuarse.com

¡Gracias por tu compra!

ZUARSE - Tienda Online
```

4. Click en "Save"
5. Copia el **Template ID** (se vería así: `template_xxxxxxxxxxxxx`)

### 4. Obtener tu Public Key

1. Ve a "Account" en el menú izquierdo
2. Copia tu **Public Key** (se vería así: `4qfb8-bz0vK6jWM6y`)

### 5. Actualizar la Configuración en ZUARSE

1. Abre el archivo `config.js` en tu editor
2. Reemplaza los valores:

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',        // Reemplaza esto
    SERVICE_ID: 'TU_SERVICE_ID_AQUI',        // Reemplaza esto
    TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI',      // Reemplaza esto
    FROM_EMAIL: 'pedidos@zuarse.com',
    FROM_NAME: 'ZUARSE - Tienda Online'
};
```

3. Guarda el archivo

### 6. Probar la Configuración

1. Inicia sesión como administrador
2. Ve a la pestaña "Pedidos"
3. Crea un pedido de prueba desde la tienda
4. En el panel de admin, abre un pedido
5. Click en "📧 Enviar por Email"
6. Verifica que el email llegó a tu bandeja

## Solución de Problemas

### "Error al enviar el email"
- Asegúrate de tener el Service ID correcto
- Verifica que tu cuenta de email esté conectada
- Para Gmail, puede ser necesario generar una contraseña de aplicación

### No recibo el email
- Revisa la carpeta de spam
- Verifica que el email del cliente sea correcto
- Prueba con tu propio email primero

### ¿Cómo sé si está funcionando?
- Mira la consola del navegador (F12)
- Busca mensajes de error si algo falla
- EmailJS mostrará un mensaje de éxito

## Límites Gratuitos

EmailJS ofrece:
- 200 emails gratuitos por mes (plan free)
- Plan premium desde $14.99/mes
- Suficiente para pequeñas tiendas

## Seguridad

- Tu **Public Key** es segura (está diseñada para ser pública)
- **Nunca** compartas tu Secret Key
- Los datos se envían encriptados

## Más Información

- Documentación oficial: https://www.emailjs.com/docs/
- Dashboard: https://dashboard.emailjs.com/
- Soporte: https://www.emailjs.com/docs/faq/

---

**¿Preguntas?** Revisa el archivo README.md o consulta la documentación de EmailJS.
