// Variables globales
const SECRET_KEY = 'zuarse_secret_2024'; // Clave secreta para encriptación

// Preguntas de seguridad
const preguntasSeguridad = [
    "¿Cuál es el nombre de tu mascota favorita?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de tu madre?",
    "¿Cuál es tu película favorita?",
    "¿En qué año naciste?"
];

// Datos de prueba (para demostración)
const usuariosDemo = {
    'usuario@test.com': {
        passwordEncriptada: encriptarPassword('usuario123'),
        preguntaSeguridad: "¿Cuál es el nombre de tu mascota favorita?",
        respuestaSeguridad: "michi"
    }
};

const adminRegistrado = {
    usuario: 'admin',
    passwordEncriptada: encriptarPassword('admin123'),
    preguntaSeguridad: "¿En qué ciudad naciste?",
    respuestaSeguridad: "méxico"
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está logueado
    const sesion = JSON.parse(localStorage.getItem('sesion_zuarse'));
    if (sesion && sesion.logueado) {
        if (sesion.tipo === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    // Inicializar usuarios en localStorage si no existen
    inicializarUsuarios();

    configurarTabs();
    configurarFormularios();
    configurarErrores();
});

// ==================== INICIALIZACIÓN ====================
function inicializarUsuarios() {
    const usuariosExistentes = localStorage.getItem('usuarios_zuarse');
    if (!usuariosExistentes) {
        localStorage.setItem('usuarios_zuarse', JSON.stringify(usuariosDemo));
    }
}

// Función para encriptar (se ejecutará cuando el script cargue)
function encriptarPassword(password) {
    // Usar un hash simple para no depender de CryptoJS
    return btoa(password + SECRET_KEY); // Base64 encoding
}

// ==================== TABS ====================
function configurarTabs() {
    const tabBtns = document.querySelectorAll('.tab-login');
    const forms = document.querySelectorAll('.form-login');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabActivo = this.dataset.tab;

            // Remover active
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Agregar active
            this.classList.add('active');
            document.getElementById('form-' + tabActivo).classList.add('active');

            // Limpiar formularios
            document.getElementById('form-' + tabActivo).reset();
        });
    });
}

// ==================== FORMULARIOS ====================
function configurarFormularios() {
    // Formulario Usuario
    document.getElementById('form-usuario').addEventListener('submit', loginUsuario);

    // Formulario Admin
    document.getElementById('form-admin').addEventListener('submit', loginAdmin);
}

function loginUsuario(e) {
    e.preventDefault();

    const email = document.getElementById('usuario-email').value.trim();
    const password = document.getElementById('usuario-password').value;
    const recordar = document.getElementById('usuario-recordar').checked;

    // Validación simple
    if (!email || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    // Validación de email
    if (!validarEmail(email)) {
        mostrarError('Por favor ingresa un email válido');
        return;
    }

    // Obtener usuarios registrados
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_zuarse')) || {};

    // Verificar si el usuario existe
    if (!(email in usuariosRegistrados)) {
        mostrarError('Email o contraseña incorrectos');
        return;
    }

    const userData = usuariosRegistrados[email];
    const passwordEncriptada = encriptarPassword(password);

    // Verificar contraseña
    if (userData.passwordEncriptada !== passwordEncriptada) {
        mostrarError('Email o contraseña incorrectos');
        return;
    }

    // Crear sesión
    const sesion = {
        logueado: true,
        tipo: 'usuario',
        email: email,
        fechaLogin: new Date().toISOString()
    };

    if (recordar) {
        localStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    } else {
        sessionStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    }

    // Redirigir
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

function loginAdmin(e) {
    e.preventDefault();

    const usuario = document.getElementById('admin-usuario').value.trim();
    const password = document.getElementById('admin-password').value;

    // Validación
    if (!usuario || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    // Verificar credenciales del admin - primero buscar en localStorage
    const passwordEncriptada = encriptarPassword(password);
    const adminEnLocalStorage = JSON.parse(localStorage.getItem('admin_zuarse'));
    
    let adminValido = false;
    
    // Si existe admin en localStorage, usar ese; si no, usar el por defecto
    if (adminEnLocalStorage && adminEnLocalStorage.usuario === usuario) {
        adminValido = adminEnLocalStorage.passwordEncriptada === passwordEncriptada;
    } else if (usuario === adminRegistrado.usuario) {
        adminValido = adminRegistrado.passwordEncriptada === passwordEncriptada;
    }
    
    if (!adminValido) {
        mostrarError('Usuario o contraseña de administrador incorrectos');
        return;
    }

    // Crear sesión admin
    const sesion = {
        logueado: true,
        tipo: 'admin',
        usuario: usuario,
        fechaLogin: new Date().toISOString()
    };

    localStorage.setItem('sesion_zuarse', JSON.stringify(sesion));

    // Redirigir
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 500);
}

// ==================== VALIDACIONES ====================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ==================== MANEJO DE ERRORES ====================
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

    // Auto-ocultar después de 5 segundos
    setTimeout(ocultarError, 5000);
}

function ocultarError() {
    document.getElementById('error-message').style.display = 'none';
}

// ==================== UTILIDADES ====================
function cerrarSesion() {
    localStorage.removeItem('sesion_zuarse');
    sessionStorage.removeItem('sesion_zuarse');
    window.location.href = 'login.html';
}
