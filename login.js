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
}

// ========================================================================================== LOGIN UNIFICADO CON BASE DE DATOS ===========================================================
async function loginUnificado(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();

    // Obtiene los datos escritos por el usuario
    const identificador = document.getElementById('login-identificador').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const recordar = document.getElementById('login-recordar').checked;

    // Valida que ambos campos tengan contenido
    if (!identificador || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    // Encripta la contraseña exactamente igual que en el registro
    const passwordEncriptada = encriptarPassword(password);

    try {
        // Envía los datos al backend para validar contra SQL Server
        const respuesta = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identificador: identificador,
                contrasena: passwordEncriptada
            })
        });

        // Convierte la respuesta a JSON
        const resultado = await respuesta.json();

        // Si el backend devuelve error, muestra mensaje
        if (!resultado.ok) {
            mostrarError(resultado.mensaje || 'Usuario o contraseña incorrectos');
            return;
        }

        // 🚨 Si es contraseña temporal → obligar cambio
if (resultado.requiereCambioPassword) {
    localStorage.setItem("usuario_temp", resultado.usuario);
    window.location.href = "cambiar-password.html";
    return;
}

// ✔ Login normal
crearSesion(resultado.usuario, resultado.tipo, recordar, {
    id: resultado.id || null,
    email: resultado.email || null,
    nombre: resultado.nombre || null
});;

    } catch (error) {
        // Muestra error en consola para depuración
        console.error('Error en login:', error);

        // Muestra error amigable al usuario
        mostrarError('Error al iniciar sesión');
    }
}

function crearSesion(identificador, rol, recordar, datosExtra = {}) {
    const sesion = {
        logueado: true,
        tipo: rol,
        usuario: identificador,
        email: datosExtra.email || (identificador.includes('@') ? identificador : null),
        id: datosExtra.id || null,
        nombre: datosExtra.nombre || null,
        fechaLogin: new Date().toISOString()
    };

    if (recordar) {
        localStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    } else {
        sessionStorage.setItem('sesion_zuarse', JSON.stringify(sesion));
    }

    // Redirigir según rol
    setTimeout(() => {
        if (rol === 'admin') {
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
