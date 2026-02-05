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
function registrarUsuario(e) {
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

    // Verificar si el email ya existe
    const usuariosRegistrados = obtenerUsuariosRegistrados();
    if (usuariosRegistrados[email]) {
        mostrarError('Este email ya está registrado. Intenta iniciar sesión');
        return;
    }

    // Obtener la pregunta
    const pregunta = preguntasSeguridad.find(p => p.id === parseInt(preguntaId));

    // Crear nuevo usuario
    const nuevoUsuario = {
        email: email,
        passwordEncriptada: encriptarPassword(password),
        preguntaSeguridad: pregunta.pregunta,
        respuestaSeguridad: respuestaSeguridad,
        fechaRegistro: new Date().toISOString()
    };

    // Guardar usuario
    usuariosRegistrados[email] = nuevoUsuario;
    localStorage.setItem('usuarios_zuarse', JSON.stringify(usuariosRegistrados));

    // También crear un cliente en el módulo administrativo
    crearClienteDesdeRegistro(email, nuevoUsuario);

    // Mostrar éxito y redirigir
    mostrarMensajeExito();

    // Limpiar formulario
    document.getElementById('form-registro').reset();
}

// ==================== FUNCIONES AUXILIARES ====================
function encriptarPassword(password) {
    return btoa(password + SECRET_KEY); // Base64 encoding
}

function obtenerUsuariosRegistrados() {
    return JSON.parse(localStorage.getItem('usuarios_zuarse')) || {};
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

// ==================== CREAR CLIENTE AUTOMÁTICO ====================
function crearClienteDesdeRegistro(email, usuario) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || {};
    
    // Extraer nombre del email
    const nombreCliente = email.split('@')[0];
    
    // Crear cliente
    const nuevoCliente = {
        id: generarIdCliente(),
        nombre: nombreCliente,
        email: email,
        telefono: '',
        direccion: '',
        ciudad: '',
        estado: 'activo',
        fechaRegistro: usuario.fechaRegistro
    };
    
    // Guardar cliente
    clientes[email] = nuevoCliente;
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function generarIdCliente() {
    return 'CLI-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}
