// Importa Express para crear el servidor web
const express = require("express");

// Permite comunicación entre frontend y backend
const cors = require("cors");

// Sirve para manejar rutas de archivos
const path = require("path");

// Importa la conexión a la base de datos
const { sql, conectarDB } = require("./db");

// Crea la aplicación
const app = express();

// Puerto del servidor
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta para probar conexión con SQL Server
app.get("/api/prueba", async (req, res) => {
  try {
    const pool = await conectarDB();
    const result = await pool.request().query("SELECT GETDATE() AS fecha");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en /api/prueba:", error);
    res.status(500).json({ ok: false, mensaje: "Error de conexión" });
  }
});

// Ruta para guardar formulario de contacto
app.post("/api/contacto", async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono } = req.body;

    const pool = await conectarDB();

    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("apellido", sql.NVarChar(100), apellido)
      .input("correo", sql.NVarChar(150), correo)
      .input("telefono", sql.NVarChar(50), telefono)
      .query(`
        INSERT INTO Contactos (Nombre, Apellido, Correo, Telefono)
        VALUES (@nombre, @apellido, @correo, @telefono)
      `);

    res.json({ ok: true, mensaje: "Mensaje guardado correctamente" });
  } catch (error) {
    console.error("Error en /api/contacto:", error);
    res.status(500).json({ ok: false, mensaje: "Error al guardar el mensaje" });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});