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
    inicializarEmpleados(); // Inicializar admin de prueba extra

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

function inicializarEmpleados() {
    let empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];
    
    // Verificar si ya existe el usuario de prueba, si no, agregarlo
    const existePrueba = empleados.some(e => e.usuario === 'admin_prueba');
    
    if (!existePrueba) {
        const adminPrueba = {
            id: 9999, // ID reservado para demo
            usuario: 'admin_prueba',
            passwordEncriptada: encriptarPassword('123456'),
            rol: 'admin',
            fechaCreacion: new Date().toISOString()
        };
        empleados.push(adminPrueba);
        localStorage.setItem('empleados_zuarse', JSON.stringify(empleados));
        console.log('✅ Admin de prueba creado/restaurado: admin_prueba / 123456');
    }
}

// Función para encriptar (se ejecutará cuando el script cargue)
function encriptarPassword(password) {
    // Usar un hash simple para no depender de CryptoJS
    return btoa(password + SECRET_KEY); // Base64 encoding
}

// ==================== FORMULARIOS ====================
function configurarFormularios() {
    // Formulario Unificado
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUnificado);
    }

    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                const esPassword = targetInput.type === 'password';
                targetInput.type = esPassword ? 'text' : 'password';
                const icon = toggle.querySelector('.material-icons');
                if (icon) {
                    icon.textContent = esPassword ? 'visibility_off' : 'visibility';
                }
                toggle.setAttribute('aria-label', esPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
            }
        });
    });
}

function loginUnificado(e) {
    e.preventDefault();

    const identificador = document.getElementById('login-identificador').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const recordar = document.getElementById('login-recordar').checked;

    // Validación simple
    if (!identificador || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    const passwordEncriptada = encriptarPassword(password);

    // ================== 1. INTENTO DE LOGIN: ADMIN PRINCIPAL O EMPLEADOS ==================
    
    // A) Buscar en lista de empleados creados desde el panel
    const empleados = JSON.parse(localStorage.getItem('empleados_zuarse')) || [];
    const empleadoEncontrado = empleados.find(emp => emp.usuario === identificador && emp.passwordEncriptada === passwordEncriptada);

    if (empleadoEncontrado) {
        crearSesion(empleadoEncontrado.usuario, empleadoEncontrado.rol || 'cliente', recordar);
        return;
    }

    // B) Buscar Admin Principal (Legacy / Hardcoded)
    const adminEnLocalStorage = JSON.parse(localStorage.getItem('admin_zuarse'));
    let esAdmin = false;

    // Verificar si coincide con admin guardado o por defecto
    if (adminEnLocalStorage && adminEnLocalStorage.usuario === identificador) {
        if (adminEnLocalStorage.passwordEncriptada === passwordEncriptada) esAdmin = true;
    } else if (identificador === adminRegistrado.usuario) {
        if (adminRegistrado.passwordEncriptada === passwordEncriptada) esAdmin = true;
    }

    if (esAdmin) {
        crearSesion(identificador, 'admin', recordar);
        return;
    }

    // ================== 2. INTENTO DE LOGIN COMO USUARIO ==================
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_zuarse')) || {};

    // Verificar si existe el identificador (email) en la lista de usuarios
    if (identificador in usuariosRegistrados) {
        const userData = usuariosRegistrados[identificador];
        
        // Verificar contraseña
        if (userData.passwordEncriptada === passwordEncriptada) {
            crearSesion(identificador, 'usuario', recordar);
            return;
        }
    }

    // Si llegamos aquí, las credenciales no coincidieron con ninguno
    mostrarError('Usuario, email o contraseña incorrectos');
}

function crearSesion(identificador, rol, recordar) {
    const sesion = {
        logueado: true,
        tipo: rol,
        usuario: identificador, // Puede ser email o user
        email: identificador.includes('@') ? identificador : null,
        fechaLogin: new Date().toISOString()
    };

    if (recordar) {
        localStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    } else {
        sessionStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    }

    // Redirigir según rol
    setTimeout(() => {
        if (rol === 'admin' || rol === 'cliente') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
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
