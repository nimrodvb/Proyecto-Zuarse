// Constantes
const SECRET_KEY = 'zuarse_secret_2024';

// ==================== VALIDACIÓN DE CONTRASEÑA ====================
const REQUISITOS_PASSWORD = {
    mayusculas: { minimo: 2, id: 'req-mayusculas' },
    minusculas: { minimo: 2, id: 'req-minusculas' },
    numeros: { minimo: 2, id: 'req-numeros' },
    especiales: { minimo: 2, id: 'req-especiales' },
    longitud: { minimo: 12, id: 'req-longitud' }
};

function contarCoincidencias(password, regex) {
    const matches = password.match(regex);
    return matches ? matches.length : 0;
}

function contarEspeciales(password) {
    const especiales = new Set(['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', "'", '"', ',', '.', '<', '>', '/', '?', '\\', '`', '~']);
    return Array.from(password).filter(ch => especiales.has(ch)).length;
}

function validarRequisitosPassword(password) {
    const mayusculas = contarCoincidencias(password, /[A-Z]/g);
    const minusculas = contarCoincidencias(password, /[a-z]/g);
    const numeros = contarCoincidencias(password, /[0-9]/g);
    const especiales = contarEspeciales(password);
    const longitud = password.length;

    return {
        mayusculas: mayusculas >= REQUISITOS_PASSWORD.mayusculas.minimo,
        minusculas: minusculas >= REQUISITOS_PASSWORD.minusculas.minimo,
        numeros: numeros >= REQUISITOS_PASSWORD.numeros.minimo,
        especiales: especiales >= REQUISITOS_PASSWORD.especiales.minimo,
        longitud: longitud >= REQUISITOS_PASSWORD.longitud.minimo
    };
}

function todosRequisitosCompletos(validacion) {
    return validacion.mayusculas && validacion.minusculas && validacion.numeros && validacion.especiales && validacion.longitud;
}

function actualizarVisualizacionRequisitos(password) {
    console.log('Actualizando requisitos con:', password);
    
    const requisitosDiv = document.getElementById('requisitos-password');
    console.log('requisitosDiv encontrado:', !!requisitosDiv);
    
    if (!requisitosDiv) {
        console.error('No se encontró elemento con id="requisitos-password"');
        return;
    }
    
    if (!password || password.length === 0) {
        requisitosDiv.style.display = 'none';
        return;
    }

    requisitosDiv.style.display = 'block';
    const validacion = validarRequisitosPassword(password);
    console.log('Validación:', validacion);

    // Actualizar cada requisito individualmente
    const requisitoKeys = ['mayusculas', 'minusculas', 'numeros', 'especiales', 'longitud'];
    
    requisitoKeys.forEach(key => {
        const id = REQUISITOS_PASSWORD[key].id;
        const elemento = document.getElementById(id);
        
        if (!elemento) {
            console.warn(`No existe elemento con id="${id}"`);
            return;
        }
        
        const iconoElement = elemento.querySelector('.requisito-icon');
        if (!iconoElement) {
            console.warn(`No existe .requisito-icon dentro de id="${id}"`);
            return;
        }
        
        if (validacion[key]) {
            elemento.classList.remove('requisito-no-cumplido');
            elemento.classList.add('requisito-cumplido');
            iconoElement.textContent = '✓';
            console.log(`✓ ${key} cumplido`);
        } else {
            elemento.classList.remove('requisito-cumplido');
            elemento.classList.add('requisito-no-cumplido');
            iconoElement.textContent = '✗';
            console.log(`✗ ${key} no cumplido`);
        }
    });
}

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
    console.log('Página de registro cargada');
    
    document.getElementById('form-registro').addEventListener('submit', registrarUsuario);

    // Event listener para validación de contraseña en tiempo real
    const inputPassword = document.getElementById('password-registro');
    console.log('inputPassword encontrado:', !!inputPassword);
    
    if (inputPassword) {
        console.log('Agregando listeners al campo de contraseña...');
        
        inputPassword.addEventListener('input', function() {
            console.log('INPUT event disparado:', this.value);
            actualizarVisualizacionRequisitos(this.value);
        });
        
        inputPassword.addEventListener('focus', function() {
            console.log('FOCUS event disparado');
            if (this.value) {
                const requisitosDiv = document.getElementById('requisitos-password');
                if (requisitosDiv) {
                    requisitosDiv.style.display = 'block';
                }
            }
        });
        
        inputPassword.addEventListener('blur', function() {
            console.log('BLUR event disparado');
            if (!this.value) {
                const requisitosDiv = document.getElementById('requisitos-password');
                if (requisitosDiv) {
                    requisitosDiv.style.display = 'none';
                }
            }
        });
    } else {
        console.error('NO se encontró campo password-registro!!');
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

    // Validar requisitos de contraseña
    const validacionPassword = validarRequisitosPassword(password);
    if (!todosRequisitosCompletos(validacionPassword)) {
        let mensajeError = 'La contraseña no cumple con los requisitos de seguridad:\n';
        if (!validacionPassword.mayusculas) mensajeError += '• Mínimo 2 letras mayúsculas\n';
        if (!validacionPassword.minusculas) mensajeError += '• Mínimo 2 letras minúsculas\n';
        if (!validacionPassword.numeros) mensajeError += '• Mínimo 2 números\n';
        if (!validacionPassword.especiales) mensajeError += '• Mínimo 2 caracteres especiales (!@#$%^&*)\n';
        if (!validacionPassword.longitud) mensajeError += '• Mínimo 12 caracteres';
        mostrarError(mensajeError);
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
        fechaRegistro: new Date().toISOString(),
        rol: 'usuario' // Asignación automática de rol por defecto
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
    let clientes = JSON.parse(localStorage.getItem('clientes'));
    
    // Asegurar que sea array para compatibilidad con admin
    if (!Array.isArray(clientes)) {
        clientes = clientes ? Object.values(clientes) : [];
    }
    
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
    clientes.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function generarIdCliente() {
    return 'CLI-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}
