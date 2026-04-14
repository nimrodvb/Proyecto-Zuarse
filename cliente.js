const estado = document.getElementById("estado");
const mensaje = document.getElementById("mensaje");
const form = document.getElementById("form-cliente");

document.addEventListener("DOMContentLoaded", () => {
    cargarClienteLogueado();
    form.addEventListener("submit", guardarCambios);
});

async function cargarClienteLogueado() {
    try {
        // Buscar sesión primero en localStorage, si no está, en sessionStorage
        let sesion =
            JSON.parse(localStorage.getItem("sesion_zuarse")) ||
            JSON.parse(sessionStorage.getItem("sesion_zuarse"));

        if (!sesion || !sesion.logueado) {
            estado.textContent = "No hay sesión iniciada.";
            return;
        }

        // Para clientes, en tu login 'usuario' queda como el correo real
        const correoSesion = (sesion.usuario || "").trim().toLowerCase();

        if (!correoSesion) {
            estado.textContent = "No se encontró el correo del cliente en la sesión.";
            return;
        }

        // Traer todos los clientes y buscar el que coincide con el correo
        const respuesta = await fetch("/api/clientes");
        const clientes = await respuesta.json();

        if (!Array.isArray(clientes)) {
            estado.textContent = "No se pudo obtener la lista de clientes.";
            return;
        }

        const cliente = clientes.find(c =>
            (c.CORREO || "").trim().toLowerCase() === correoSesion
        );

        if (!cliente) {
            estado.textContent = "No se encontró el cliente logueado.";
            return;
        }

        // Llenar formulario
        document.getElementById("cliente-id").value = cliente.ID || "";
        document.getElementById("nombre").value = cliente.NOMBRE || "";
        document.getElementById("correo").value = cliente.CORREO || "";
        document.getElementById("telefono").value = cliente.TELEFONO || "";
        document.getElementById("ciudad").value = cliente.CIUDAD || "";
        document.getElementById("direccion").value = cliente.DIRECCION || "";

        estado.style.display = "none";
        form.style.display = "block";

    } catch (error) {
        console.error("Error al cargar cliente:", error);
        estado.textContent = "Error al cargar los datos del cliente.";
    }
}

async function guardarCambios(e) {
    e.preventDefault();
    mensaje.textContent = "";

    const id = document.getElementById("cliente-id").value;
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const telefono = document.getElementById("telefono").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!id) {
        mensaje.textContent = "No se encontró el ID del cliente.";
        return;
    }

    if (!nombre || !correo) {
        mensaje.textContent = "Nombre y correo son obligatorios.";
        return;
    }

    try {
        const respuesta = await fetch(`/api/clientes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                correo,
                telefono,
                direccion,
                ciudad,
                estado: "activo"
            })
        });

        const data = await respuesta.json();

        if (!data.ok) {
            mensaje.textContent = data.mensaje || "No se pudo guardar.";
            return;
        }

        // actualizar la sesión si el correo cambió
        let sesion =
            JSON.parse(localStorage.getItem("sesion_zuarse")) ||
            JSON.parse(sessionStorage.getItem("sesion_zuarse"));

        if (sesion) {
            sesion.usuario = correo;
            sesion.email = correo;

            if (localStorage.getItem("sesion_zuarse")) {
                localStorage.setItem("sesion_zuarse", JSON.stringify(sesion));
            } else {
                sessionStorage.setItem("sesion_zuarse", JSON.stringify(sesion));
            }
        }

        mensaje.textContent = "Datos guardados correctamente.";

    } catch (error) {
        console.error("Error al guardar cambios:", error);
        mensaje.textContent = "Error al guardar cambios.";
    }
}