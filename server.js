// Importa el framework Express, que facilita la creación de servidores y APIs en Node.js.
const express = require("express");

// Importa el middleware 'cors', que permite que tu frontend (cliente) se comunique con este backend (servidor) aunque estén en dominios diferentes.
const cors = require("cors");

// Importa el módulo 'path' de Node.js, una utilidad para trabajar con rutas de archivos y directorios de manera consistente en cualquier sistema operativo.
const path = require("path");

// Importa dos elementos desde tu archivo 'db.js': 'sql' (el objeto de la librería mssql) y 'conectarDB' (tu función para establecer la conexión a la base de datos).
// Esta línea fallará si el archivo db.js no existe o no exporta estos módulos.
const { sql, conectarDB } = require("./db");

// Crea una instancia de la aplicación Express. 'app' será tu servidor principal.
const app = express();

// Define el puerto en el que el servidor escuchará las peticiones. En este caso, el puerto 3000.
const PORT = 3000;

// --- MIDDLEWARE ---
// Un middleware es una función que se ejecuta en el medio, entre la petición del cliente y la respuesta del servidor.

// Habilita CORS (Cross-Origin Resource Sharing) para todas las rutas. Esto es crucial para permitir que tu página web (ej. index.html) haga peticiones a este servidor.
app.use(cors());
// Habilita el middleware de Express para que pueda interpretar y procesar cuerpos de petición en formato JSON. Esencial para las APIs que reciben datos.
app.use(express.json());
// Sirve los archivos estáticos (HTML, CSS, JS, imágenes) que se encuentren en el directorio raíz del proyecto (__dirname).
// Esto permite que al acceder a http://localhost:3000/ se cargue index.html, style.css, etc.
app.use(express.static(__dirname));

// --- RUTAS ---
// Las rutas definen cómo responde el servidor a las peticiones del cliente en URLs específicas.

// Define la ruta principal ('/'). Cuando un usuario navega a la raíz de tu sitio (ej. http://localhost:3000).
app.get("/", (req, res) => {
  // Envía el archivo 'index.html' como respuesta al navegador.
  // path.join() se usa para construir una ruta de archivo segura y compatible entre sistemas operativos.
  res.sendFile(path.join(__dirname, "index.html"));
});

// Define una ruta de API de tipo GET en '/api/prueba' para verificar la conexión con la base de datos.
app.get("/api/prueba", async (req, res) => {
  // Se usa un bloque try...catch para manejar posibles errores de conexión o consulta.
  try {
    // Llama a tu función para obtener una conexión a la base de datos. 'await' pausa la ejecución hasta que la conexión se establezca.
    const pool = await conectarDB();
    // Ejecuta una consulta SQL para obtener la fecha y hora actual del servidor de base de datos.
    const result = await pool.request().query("SELECT GETDATE() AS fecha");
    // Si la consulta es exitosa, envía el resultado (el conjunto de registros) de vuelta al cliente en formato JSON.
    res.json(result.recordset);
  } catch (error) {
    // Si ocurre un error en el bloque 'try', se captura aquí.
    // Imprime el error detallado en la consola del servidor para depuración.
    console.error("Error en /api/prueba:", error);
    // Envía una respuesta de error al cliente con un código de estado 500 (Error Interno del Servidor) y un mensaje en JSON.
    res.status(500).json({ ok: false, mensaje: "Error de conexión" });
  }
});

// Define una ruta de API de tipo POST en '/api/contacto' para recibir y guardar los datos de un formulario.
app.post("/api/contacto", async (req, res) => {
  // Bloque try...catch para manejar errores durante el proceso.
  try {
    // Extrae las variables 'nombre', 'apellido', 'correo' y 'telefono' del cuerpo (body) de la petición. Estos datos son enviados por el formulario del frontend.
    const { nombre, apellido, correo, telefono } = req.body;

    // Establece la conexión con la base de datos.
    const pool = await conectarDB();

    // Prepara y ejecuta una consulta SQL para insertar los datos en la tabla 'Contactos'.
    await pool.request()
      // .input() es un método seguro para pasar variables a una consulta SQL. Previene ataques de inyección SQL.
      // Define un parámetro llamado 'nombre' de tipo NVarChar(100) y le asigna el valor de la variable 'nombre'.
      .input("nombre", sql.NVarChar(100), nombre)
      // Define el parámetro 'apellido'.
      .input("apellido", sql.NVarChar(100), apellido)
      // Define el parámetro 'correo'.
      .input("correo", sql.NVarChar(150), correo)
      // Define el parámetro 'telefono'.
      .input("telefono", sql.NVarChar(50), telefono)
      // Ejecuta la consulta de inserción utilizando los parámetros definidos (@nombre, @apellido, etc.).
      .query(`
        INSERT INTO Contactos (Nombre, Apellido, Correo, Telefono)
        VALUES (@nombre, @apellido, @correo, @telefono)
      `);

    // Si la inserción es exitosa, envía una respuesta JSON al cliente confirmando que todo salió bien.
    res.json({ ok: true, mensaje: "Mensaje guardado correctamente" });
  } catch (error) {
    // Si ocurre un error durante la inserción.
    // Imprime el error en la consola del servidor.
    console.error("Error en /api/contacto:", error);
    // Envía una respuesta de error 500 al cliente con un mensaje explicativo.
    res.status(500).json({ ok: false, mensaje: "Error al guardar el mensaje" });
  }
});

// Inicia el servidor y lo pone a escuchar en el puerto definido en la constante PORT.
app.listen(PORT, () => {
  // Una vez que el servidor está listo, ejecuta esta función de callback.
  // Imprime un mensaje en la consola indicando que el servidor está corriendo y en qué dirección URL.
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});