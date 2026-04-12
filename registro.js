// Constantes
const SECRET_KEY = 'zuarse_secret_2024';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-registro').addEventListener('submit', registrarUsuario);
    configurarErrores();
});

// ================================================================================================================ REGISTRO ==============================================================
async function registrarUsuario(e) {
    e.preventDefault();
    console.log("SE EJECUTÓ registrarUsuario");

    const email = document.getElementById('email-registro').value.trim().toLowerCase();
    const password = document.getElementById('password-registro').value;
    const confirmarPassword = document.getElementById('confirmar-password-registro').value;

    // Validaciones
    if (!validarEmail(email)) {
        mostrarError('Por favor ingresa un email válido');
        return;
    }

 if (password.length < 8) {
    mostrarError('Debe tener al menos 8 caracteres');
    return;
}

if (!/[A-Z]/.test(password)) {
    mostrarError('Debe tener al menos una letra mayúscula');
    return;
}

if (!/\d/.test(password)) {
    mostrarError('Debe tener al menos un número');
    return;
}

if (!/[@$!%*?&.#_-]/.test(password)) {
    mostrarError('Debe tener al menos un carácter especial');
    return;
}

    if (password !== confirmarPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    try {
        // Envía los datos al backend para guardarlos en la BD (tabla CLIENTES)
        console.log("ANTES DEL FETCH");

        const respuesta = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: email.split('@')[0],
                correo: email,
                telefono: '',
                ciudad: '',
                estado: 'activo',
                contrasena: encriptarPassword(password)
            })
        });

        console.log("STATUS RESPUESTA:", respuesta.status);

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
        alert(error.message);
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




function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;
    return regex.test(password);
}