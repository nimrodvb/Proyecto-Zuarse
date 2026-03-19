// Constantes
const SECRET_KEY = 'zuarse_secret_2024';

// Preguntas de seguridad
const preguntasSeguridad = [
    { id: 1, pregunta: "¿Cuál es el nombre de tu mascota favorita?", respuestaEjemplo: "michi" },
    { id: 2, pregunta: "¿En qué ciudad naciste?", respuestaEjemplo: "méxico" },
    { id: 3, pregunta: "¿Cuál es el nombre de tu madre?", respuestaEjemplo: "maría" },
    { id: 4, pregunta: "¿Cuál es tu película favorita?", respuestaEjemplo: "avatar" },
    { id: 5, pregunta: "¿En qué año naciste?", respuestaEjemplo: "1990" }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-registro').addEventListener('submit', registrarUsuario);
    configurarErrores();
});

// ==================== REGISTRO ====================
async function registrarUsuario(e) {
    e.preventDefault();

    const email = document.getElementById('email-registro').value.trim().toLowerCase();
    const password = document.getElementById('password-registro').value;
    const confirmarPassword = document.getElementById('confirmar-password-registro').value;
    const preguntaId = document.getElementById('pregunta-seguridad-registro').value;
    const respuestaSeguridad = document.getElementById('respuesta-seguridad-registro').value.trim().toLowerCase();

    // Validaciones
    if (!validarEmail(email)) {
        mostrarError('Por favor ingresa un email válido');
        return;
    }

    if (password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmarPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    if (!preguntaId) {
        mostrarError('Por favor selecciona una pregunta de seguridad');
        return;
    }

    if (respuestaSeguridad.length < 2) {
        mostrarError('Por favor ingresa una respuesta válida');
        return;
    }

    try {
        // Envía los datos al backend para guardarlos en la BD (tabla CLIENTES)
        const respuesta = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: email.split('@')[0], // Se genera nombre desde el email
                correo: email,
                telefono: '',
                ciudad: '',
                estado: 'activo'
            })
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {
            mostrarError(resultado.mensaje);
            return;
        }

        // Mostrar éxito y redirigir
        mostrarMensajeExito();

        // Limpiar formulario
        document.getElementById('form-registro').reset();

    } catch (error) {
        console.error('Error al registrar:', error);
        mostrarError('Error al registrar usuario');
    }
}

// ==================== FUNCIONES AUXILIARES ====================
function encriptarPassword(password) {
    return btoa(password + SECRET_KEY);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function configurarErrores() {
    const btnClose = document.querySelector('.btn-close-error');
    if (btnClose) {
        btnClose.addEventListener('click', ocultarError);
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    errorText.textContent = mensaje;
    errorDiv.style.display = 'flex';

    setTimeout(ocultarError, 5000);
}

function ocultarError() {
    document.getElementById('error-message').style.display = 'none';
}

function mostrarMensajeExito() {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    errorText.textContent = '¡Registro exitoso! Redirigiendo a login...';
    errorDiv.style.display = 'flex';
    errorDiv.style.backgroundColor = '#4CAF50';
    errorDiv.style.color = 'white';

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}
