const SECRET_KEY = 'zuarse_secret_2024';

// Encriptar igual que el resto del sistema
function encriptarPassword(password) {
    return btoa(password + SECRET_KEY);
}

document.getElementById("form-cambiar-password").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nueva = document.getElementById("nueva-password").value;
    const confirmar = document.getElementById("confirmar-password").value;

   if (nueva.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres");
    return;
}

if (!/[A-Z]/.test(nueva)) {
    alert("La contraseña debe tener al menos una mayúscula");
    return;
}

if (!/\d/.test(nueva)) {
    alert("La contraseña debe tener al menos un número");
    return;
}

if (!/[@$!%*?&.#_-]/.test(nueva)) {
    alert("La contraseña debe tener al menos un carácter especial");
    return;
}

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const usuario = localStorage.getItem("usuario_temp");

    if (!usuario) {
        alert("Error de sesión");
        return;
    }

    const passwordEncriptada = encriptarPassword(nueva);

    try {
        const res = await fetch("/api/cambiar-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                nuevaPassword: passwordEncriptada
            })
        });

        const data = await res.json();

        if (!data.ok) {
            alert(data.mensaje);
            return;
        }

        // limpiar temp
        localStorage.removeItem("usuario_temp");

        alert("Contraseña actualizada");

        window.location.href = "login.html";

    } catch (err) {
        console.error(err);
        alert("Error en servidor");
    }
});


function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;
    return regex.test(password);
}