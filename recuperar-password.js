// ==========================================================
// recuperar-password.js
// Flujo nuevo de recuperación:
// 1. Usuario normal ingresa su correo
// 2. Admin ingresa su usuario
// 3. Se envía la solicitud al backend
// 4. El backend genera una contraseña temporal
// 5. El backend guarda la nueva contraseña en la BD
// 6. El backend envía esa contraseña al correo del usuario/admin
// ==========================================================

// Variable global para saber si se está recuperando
// una cuenta de usuario normal o de administrador
let tipoRecuperacion = 'usuario'; // 'usuario' o 'admin'

// ==========================================================
// INICIALIZACIÓN
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    // Formulario de recuperación para usuario normal
    const formEmail = document.getElementById('form-email-recuperacion');
    if (formEmail) {
        formEmail.addEventListener('submit', recuperarPasswordUsuario);
    }


  

    // Configurar botón para cerrar mensajes de error
    configurarErrores();
});


// ==========================================================
// RECUPERAR CONTRASEÑA - USUARIO NORMAL
// Envía el correo al backend
// ==========================================================
async function recuperarPasswordUsuario(e) {
    e.preventDefault();

    // Obtener el correo ingresado
    const email = document.getElementById('email-recuperacion').value.trim().toLowerCase();

    // Validar formato del correo
    if (!validarEmail(email)) {
        mostrarError('Por favor ingresa un correo válido');
        return;
    }

    try {
        // Petición al backend para recuperar contraseña del cliente
        const respuesta = await fetch('/api/recuperar-password-cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo: email })
        });

        // Convertir respuesta a JSON
        const resultado = await respuesta.json();

        // Si el backend responde error
        if (!resultado.ok) {
            mostrarError(resultado.mensaje || 'No se pudo procesar la recuperación');
            return;
        }

        // Mostrar pantalla de éxito
        mostrarPasoExito();

    } catch (error) {
        console.error('Error al recuperar contraseña de usuario:', error);
        mostrarError('Error de conexión con el servidor');
    }
}



// ==========================================================
// MOSTRAR PANTALLA DE ÉXITO
// Oculta formularios y muestra mensaje final
// ==========================================================
function mostrarPasoExito() {
    ocultarTodosLosPasos();

    const pasoExito = document.getElementById('paso-4');
    if (pasoExito) {
        pasoExito.style.display = 'block';
    }
}

// ==========================================================
// OCULTAR TODOS LOS PASOS
// Útil para cambiar entre formularios y pantalla de éxito
// ==========================================================
function ocultarTodosLosPasos() {
    const paso1 = document.getElementById('paso-1');
    const paso1Admin = document.getElementById('paso-1-admin');
    const paso4 = document.getElementById('paso-4');

    if (paso1) paso1.style.display = 'none';
    if (paso1Admin) paso1Admin.style.display = 'none';
    if (paso4) paso4.style.display = 'none';
}

// ==========================================================
// VALIDAR EMAIL
// Verifica formato básico del correo
// ==========================================================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ==========================================================
// CONFIGURAR MANEJO DE ERRORES
// Agrega funcionalidad al botón de cerrar mensaje
// ==========================================================
function configurarErrores() {
    const btnClose = document.querySelector('.btn-close-error');

    if (btnClose) {
        btnClose.addEventListener('click', ocultarError);
    }
}

// ==========================================================
// MOSTRAR ERROR
// Muestra el contenedor de error con el mensaje recibido
// ==========================================================
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (!errorDiv || !errorText) return;

    errorText.textContent = mensaje;
    errorDiv.style.display = 'flex';

    // Ocultar automáticamente después de 5 segundos
    setTimeout(ocultarError, 5000);
}

// ==========================================================
// OCULTAR ERROR
// Esconde el contenedor de errores
// ==========================================================
function ocultarError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}