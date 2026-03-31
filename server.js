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
    // Extrae las variables 'nombre', 'apellido', 'correo' y 'telefono' del body.
    const { nombre, apellido, correo, telefono } = req.body;

    // Establece la conexión con la base de datos.
    const pool = await conectarDB();

    // Prepara y ejecuta la consulta SQL para insertar en la tabla CONTACTOS.
    await pool.request()
      // Se usan nombres de parámetros en minúscula para que coincidan con @nombre, @apellido, etc.
      .input("nombre", sql.NVarChar(100), nombre)
      .input("apellido", sql.NVarChar(100), apellido)
      // Se ajusta el tamaño a NVARCHAR(150) según la tabla
      .input("correo", sql.NVarChar(150), correo)
      // Se ajusta el tamaño a NVARCHAR(20) según la tabla
      .input("telefono", sql.NVarChar(20), telefono)
      // Se usa el nombre correcto de la tabla y columnas en mayúscula
      .query(`
        INSERT INTO CONTACTOS (NOMBRE, APELLIDO, CORREO, TELEFONO)
        VALUES (@nombre, @apellido, @correo, @telefono)
      `);

    // Respuesta exitosa
    res.json({ ok: true, mensaje: "Mensaje guardado correctamente" });
  } catch (error) {
    // Manejo de errores
    console.error("Error en /api/contacto:", error);
    res.status(500).json({ ok: false, mensaje: "Error al guardar el mensaje" });
  }
});

// Inicia el servidor y lo pone a escuchar en el puerto definido en la constante PORT.
app.listen(PORT, () => {
  // Una vez que el servidor está listo, ejecuta esta función de callback.
  // Imprime un mensaje en la consola indicando que el servidor está corriendo y en qué dirección URL.
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// ==================================================================================== CLIENTES ============================================================

// Ruta POST para guardar un cliente nuevo desde el formulario
app.post("/api/clientes", async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    // IMPORTANTE: ahora también se incluye "direccion"
    const { nombre, correo, telefono, direccion, ciudad, estado } = req.body;

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Prepara y ejecuta el INSERT en la tabla CLIENTES
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)        // Nombre del cliente
      .input("correo", sql.NVarChar(150), correo)        // Correo electrónico
      .input("telefono", sql.NVarChar(20), telefono)     // Número de teléfono
      .input("direccion", sql.NVarChar(255), direccion)  // Dirección del cliente
      .input("ciudad", sql.NVarChar(100), ciudad)        // Ciudad
      .input("estado", sql.NVarChar(50), estado)         // Estado (activo/inactivo)
      .query(`
        INSERT INTO CLIENTES (NOMBRE, CORREO, TELEFONO, DIRECCION, CIUDAD, ESTADO)
        VALUES (@nombre, @correo, @telefono, @direccion, @ciudad, @estado)
      `);

    // Respuesta de éxito al frontend
    res.json({
      ok: true,
      mensaje: "Cliente creado correctamente"
    });

  } catch (error) {
    // Muestra el error en la consola del servidor
    console.error("Error en POST /api/clientes:", error);

    // Devuelve respuesta de error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error en servidor"
    });
  }
});





// ------------------------------------------------------------------------ OBTENER CLIENTES DE SQL---------------------------------------------------------

app.get("/api/clientes", async (req, res) => {

  try {
    // Se conecta a la base de datos usando la función previamente creada
    const pool = await conectarDB();

    // Ejecuta una consulta SQL para traer todos los clientes
    // IMPORTANTE: ahora incluye la columna DIRECCION
    const resultado = await pool.request().query(`
      SELECT 
        ID,              -- Identificador único del cliente
        NOMBRE,          -- Nombre del cliente
        CORREO,          -- Correo electrónico
        TELEFONO,        -- Número de teléfono
        DIRECCION,       -- Dirección (ANTES NO SE ESTABA TRAYENDO)
        CIUDAD,          -- Ciudad del cliente
        ESTADO           -- Estado (Activo, Inactivo, etc.)
      FROM CLIENTES
      ORDER BY ID DESC   -- Ordena del más reciente al más antiguo
    `);

    // Devuelve los resultados en formato JSON al frontend
    res.json(resultado.recordset);

  } catch (error) {

    // Si ocurre un error, lo muestra en la consola del servidor
    console.error("Error en GET /api/clientes:", error);

    // Envía una respuesta de error al cliente (frontend)
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener clientes"
    });

  }
});




// ------------------------------------------------------------------------ OBTENER CLIENTES POR ID--------------------------------------------------------   

app.get("/api/clientes/:id", async (req, res) => {
  try {
    // Obtiene el ID enviado en la URL
    const { id } = req.params;

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta una consulta SQL para buscar el cliente por su ID
    // IMPORTANTE: ahora también trae la columna DIRECCION
    const resultado = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          ID,         -- Identificador del cliente
          NOMBRE,     -- Nombre del cliente
          CORREO,     -- Correo electrónico
          TELEFONO,   -- Número de teléfono
          DIRECCION,  -- Dirección del cliente
          CIUDAD,     -- Ciudad del cliente
          ESTADO      -- Estado actual del cliente
        FROM CLIENTES
        WHERE ID = @id
      `);

    // Si no se encontró ningún cliente con ese ID, devuelve error 404
    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no encontrado"
      });
    }

    // Devuelve el cliente encontrado al frontend
    res.json(resultado.recordset[0]);

  } catch (error) {
    // Muestra el error en la consola del servidor
    console.error("Error en GET /api/clientes/:id:", error);

    // Devuelve respuesta de error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener cliente"
    });
  }
});




// ------------------------------------------------------------------------ CREAR UN NUEVO CLIENTE ---------------------------------------------------------
app.post("/api/clientes", async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    const { nombre, correo, telefono, ciudad, estado } = req.body;

    // Conecta a la base de datos
    const pool = await conectarDB();

    // Inserta el nuevo cliente
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("correo", sql.NVarChar(150), correo)
      .input("telefono", sql.NVarChar(20), telefono)
      .input("ciudad", sql.NVarChar(100), ciudad)
      .input("estado", sql.NVarChar(50), estado)
      .query(`
        INSERT INTO CLIENTES (NOMBRE, CORREO, TELEFONO, CIUDAD, ESTADO)
        VALUES (@nombre, @correo, @telefono, @ciudad, @estado)
      `);

    // Respuesta exitosa
    res.json({ ok: true, mensaje: "Cliente guardado correctamente" });
  } catch (error) {
    // Muestra error en consola y responde con error
    console.error("Error en POST /api/clientes:", error);
    res.status(500).json({ ok: false, mensaje: "Error al guardar cliente" });
  }
});




// ------------------------------------------------------------------------ ACTUALIZAR UN NUEVO CLIENTE ---------------------------------------------------------
app.put("/api/clientes/:id", async (req, res) => {
  try {
    // Obtiene el ID enviado en la URL
    const { id } = req.params;

    // Obtiene los datos enviados desde el frontend
    const { nombre, correo, telefono, direccion, ciudad, estado } = req.body;

    // Muestra en consola lo que llegó
    console.log("ID recibido para actualizar:", id);
    console.log("Datos recibidos para actualizar:", req.body);

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta la consulta SQL de actualización
    const resultado = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre)
      .input("correo", sql.NVarChar(150), correo)
      .input("telefono", sql.NVarChar(20), telefono)
      .input("direccion", sql.NVarChar(255), direccion)
      .input("ciudad", sql.NVarChar(100), ciudad)
      .input("estado", sql.NVarChar(50), estado)
      .query(`
        UPDATE CLIENTES
        SET 
          NOMBRE = @nombre,
          CORREO = @correo,
          TELEFONO = @telefono,
          DIRECCION = @direccion,
          CIUDAD = @ciudad,
          ESTADO = @estado
        WHERE ID = @id
      `);

    // Muestra cuántas filas se actualizaron
    console.log("Filas actualizadas:", resultado.rowsAffected);

    // Si no se actualizó ninguna fila, devuelve error
    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no encontrado para actualizar"
      });
    }

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Cliente actualizado correctamente"
    });

  } catch (error) {
    // Muestra el error real en la consola del servidor
    console.error("Error en PUT /api/clientes/:id:", error);

    // Devuelve error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar cliente"
    });
  }
});




// ------------------------------------------------------------------------ ELIMINAR UN CLIENTE---------------------------------------------------------
app.delete("/api/clientes/:id", async (req, res) => {
  try {
    // Obtiene el ID desde la URL
    const { id } = req.params;

    // Conecta a la base de datos
    const pool = await conectarDB();

    // Elimina el cliente
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM CLIENTES
        WHERE ID = @id
      `);

    // Respuesta exitosa
    res.json({ ok: true, mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    // Muestra error en consola y responde con error
    console.error("Error en DELETE /api/clientes/:id:", error);
    res.status(500).json({ ok: false, mensaje: "Error al eliminar cliente" });
  }
});

// ==================================================================================== CLIENTES ============================================================
