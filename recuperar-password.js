// Variables globales
let usuarioEnRecuperacion = null;
let tipoRecuperacion = 'usuario'; // 'usuario' o 'admin'
const SECRET_KEY = 'zuarse_secret_2024'; // Clave secreta para encriptación

// Datos del admin
const adminData = {
    usuario: 'admin',
    preguntaSeguridad: "¿En qué ciudad naciste?",
    respuestaSeguridad: "méxico"
};

// Preguntas de seguridad disponibles
const preguntasSeguridad = [
    { id: 1, pregunta: "¿Cuál es el nombre de tu mascota favorita?", respuestaEjemplo: "michi" },
    { id: 2, pregunta: "¿En qué ciudad naciste?", respuestaEjemplo: "méxico" },
    { id: 3, pregunta: "¿Cuál es el nombre de tu madre?", respuestaEjemplo: "maría" },
    { id: 4, pregunta: "¿Cuál es tu película favorita?", respuestaEjemplo: "avatar" },
    { id: 5, pregunta: "¿En qué año naciste?", respuestaEjemplo: "1990" }
];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-email-recuperacion').addEventListener('submit', buscarUsuario);
    document.getElementById('form-usuario-recuperacion').addEventListener('submit', buscarAdmin);
    document.getElementById('form-nueva-password').addEventListener('submit', cambiarPassword);
    configurarTabs();
    configurarErrores();
});

// ==================== TABS ====================
function configurarTabs() {
    const tabBtns = document.querySelectorAll('.tab-login');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tipoTab = this.dataset.tab;
            tipoRecuperacion = tipoTab.includes('usuario') ? 'usuario' : 'admin';
            
            // Remover active
            tabBtns.forEach(b => b.classList.remove('active'));
            document.getElementById('paso-1').style.display = 'none';
            document.getElementById('paso-1-admin').style.display = 'none';
            
            // Agregar active
            this.classList.add('active');
            if (tipoRecuperacion === 'usuario') {
                document.getElementById('paso-1').style.display = 'block';
            } else {
                document.getElementById('paso-1-admin').style.display = 'block';
            }
            
            // Limpiar
            document.getElementById('form-email-recuperacion').reset();
            document.getElementById('form-usuario-recuperacion').reset();
        });
    });
}

// ==================== PASO 1: BUSCAR USUARIO ====================
function buscarUsuario(e) {
    e.preventDefault();
    
    const email = document.getElementById('email-recuperacion').value.trim();
    
    if (!validarEmail(email)) {
        mostrarError('Por favor ingresa un email válido');
        return;
    }

    // Obtener usuarios del localStorage
    const usuariosRegistrados = obtenerUsuariosRegistrados();
    
    // Buscar el usuario
    let usuarioEncontrado = null;
    for (const [userEmail, userData] of Object.entries(usuariosRegistrados)) {
        if (userEmail === email) {
            usuarioEncontrado = { email: userEmail, ...userData };
            break;
        }
    }

    if (!usuarioEncontrado) {
        mostrarError('No encontramos una cuenta con ese email');
        return;
    }

    usuarioEnRecuperacion = usuarioEncontrado;
    irPaso2();
}

// ==================== PASO 1B: BUSCAR ADMIN ====================
function buscarAdmin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario-recuperacion').value.trim();
    
    if (usuario !== adminData.usuario) {
        mostrarError('Usuario administrador no encontrado');
        return;
    }

    usuarioEnRecuperacion = adminData;
    irPaso2();
}

// ==================== PASO 2: PREGUNTA DE SEGURIDAD ====================
function irPaso2() {
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'block';

    // Mostrar pregunta de seguridad
    const pregunta = usuarioEnRecuperacion.preguntaSeguridad;
    document.getElementById('pregunta-texto').textContent = pregunta;
    document.getElementById('respuesta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').focus();
}

function verificarRespuesta() {
    const respuestaIngresada = document.getElementById('respuesta-seguridad').value.trim().toLowerCase();
    const respuestaCorrecta = usuarioEnRecuperacion.respuestaSeguridad.toLowerCase();

    if (respuestaIngresada !== respuestaCorrecta) {
        mostrarError('La respuesta de seguridad es incorrecta');
        return;
    }

    // Respuesta correcta
    irPaso3();
}

// ==================== PASO 3: NUEVA CONTRASEÑA ====================
function irPaso3() {
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'block';
    document.getElementById('nueva-password').focus();
}

function cambiarPassword(e) {
    e.preventDefault();

    const nuevaPassword = document.getElementById('nueva-password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;

    if (nuevaPassword.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (nuevaPassword !== confirmarPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    // Encriptar la nueva contraseña
    const passwordEncriptada = encriptarPassword(nuevaPassword);

    if (tipoRecuperacion === 'usuario') {
        // Actualizar contraseña de usuario normal
        const usuariosRegistrados = obtenerUsuariosRegistrados();
        
        if (usuariosRegistrados[usuarioEnRecuperacion.email]) {
            usuariosRegistrados[usuarioEnRecuperacion.email].passwordEncriptada = passwordEncriptada;
            localStorage.setItem('usuarios_zuarse', JSON.stringify(usuariosRegistrados));
            irPaso4();
        }
    } else if (tipoRecuperacion === 'admin') {
        // Actualizar contraseña de admin
        const adminData = {
            usuario: usuarioEnRecuperacion.usuario,
            passwordEncriptada: passwordEncriptada,
            preguntaSeguridad: usuarioEnRecuperacion.preguntaSeguridad,
            respuestaSeguridad: usuarioEnRecuperacion.respuestaSeguridad
        };
        localStorage.setItem('admin_zuarse', JSON.stringify(adminData));
        irPaso4();
    }
}

// ==================== PASO 4: ÉXITO ====================
function irPaso4() {
    document.getElementById('paso-3').style.display = 'none';
    document.getElementById('paso-4').style.display = 'block';

    setTimeout(() => {
        // window.location.href = 'login.html';
    }, 2000);
}

// ==================== VOLVER ====================
function volverPaso1() {
    usuarioEnRecuperacion = null;
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    document.getElementById('paso-4').style.display = 'none';
    document.getElementById('paso-1').style.display = 'block';
    document.getElementById('form-email-recuperacion').reset();
}

// ==================== ENCRIPTACIÓN ====================
function encriptarPassword(password) {
    return btoa(password + SECRET_KEY); // Base64 encoding
}

// ==================== UTILIDADES ====================
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
