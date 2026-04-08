// Importa el framework Express, que facilita la creación de servidores y APIs en Node.js.
const express = require("express");

// Importa el middleware 'cors', que permite que tu frontend (cliente) se comunique con este backend (servidor) aunque estén en dominios diferentes.
const cors = require("cors");

// Importa el módulo 'path' de Node.js, una utilidad para trabajar con rutas de archivos y directorios de manera consistente en cualquier sistema operativo.
const path = require("path");

// Importa dos elementos desde tu archivo 'db.js': 'sql' (el objeto de la librería mssql) y 'conectarDB' (tu función para establecer la conexión a la base de datos).
// Esta línea fallará si el archivo db.js no existe o no exporta estos módulos.
const { sql, conectarDB } = require("./db");

// Importa nodemailer para poder enviar correos
const nodemailer = require("nodemailer");

// Clave secreta usada para "encriptar" la contraseña igual que en el frontend
const SECRET_KEY = "zuarse_secret_2024";

// Crea una instancia de la aplicación Express. 'app' será tu servidor principal.
const app = express();

// Define el puerto en el que el servidor escuchará las peticiones. En este caso, el puerto 3000.
const PORT = 3000;

// =========================================================================================================== RECUPERACIÓN DE CONTRASEÑA ==================================================================================



// Genera contraseña temporal
function generarPasswordTemporal(longitud = 8) {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    password += caracteres.charAt(indice);
  }

  return password;
}

// Encripta igual que frontend
function encriptarPassword(password) {
  return Buffer.from(password + SECRET_KEY).toString("base64");
}

// ================= CONFIGURACIÓN DE CORREO =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "zuarzeweb@gmail.com", // <-- pon tu correo aquí
    pass: "bgjw wbej isck wmoe"        // <-- pega la clave que generaste
  }
});

// --- MIDDLEWARE ---
// Un middleware es una función que se ejecuta en el medio, entre la petición del cliente y la respuesta del servidor.

// Habilita CORS (Cross-Origin Resource Sharing) para todas las rutas. Esto es crucial para permitir que tu página web (ej. index.html) haga peticiones a este servidor.
app.use(cors());
// Habilita el middleware de Express para que pueda interpretar y procesar cuerpos de petición en formato JSON. Esencial para las APIs que reciben datos.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
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

// ============================================================================================================== CLIENTES =================================================================================

// Ruta POST para guardar un cliente nuevo desde el formulario
app.post("/api/clientes", async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    const { nombre, correo, telefono, direccion, ciudad, estado, contrasena } = req.body;

    // Validación básica
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, correo y contraseña son obligatorios"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Verifica si ya existe un cliente con el mismo correo
    const clienteExistente = await pool.request()
      .input("correo", sql.NVarChar(150), correo)
      .query(`
        SELECT ID
        FROM CLIENTES
        WHERE CORREO = @correo
      `);

    if (clienteExistente.recordset.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe una cuenta registrada con ese correo"
      });
    }

    // Inserta el cliente incluyendo la contraseña
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("correo", sql.NVarChar(150), correo)
      .input("telefono", sql.NVarChar(20), telefono || null)
      .input("direccion", sql.NVarChar(255), direccion || null)
      .input("ciudad", sql.NVarChar(100), ciudad || null)
      .input("estado", sql.NVarChar(50), estado || null)
      .input("contrasena", sql.NVarChar(100), contrasena)
      .query(`
        INSERT INTO CLIENTES (NOMBRE, CORREO, TELEFONO, DIRECCION, CIUDAD, ESTADO, CONTRASENA)
        VALUES (@nombre, @correo, @telefono, @direccion, @ciudad, @estado, @contrasena)
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





// ---------------------------------------------------------------------------------------------- OBTENER CLIENTES DE SQL-----------------------------------------------------------------------------------

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




// ------------------------------------------------------------------------------------------ OBTENER CLIENTES POR ID----------------------------------------------------------------------------------------   

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




// -------------------------------------------------------------------------------------------- CREAR UN NUEVO CLIENTE --------------------------------------------------------------------------------------
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




// ------------------------------------------------------------------------------------------ ACTUALIZAR UN NUEVO CLIENTE ------------------------------------------------------------------------------------
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




// --------------------------------------------------------------------------------------------------- ELIMINAR UN CLIENTE----------------------------------------------------------------------------------
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

// ================================================================================================================ CLIENTES ===================================================================================



// ================================================================================================================ CATEGORIAS ==================================================================================


// ------------------------------------------------------------------------------------------------------------ AGREGAR NUEVA CATEGORÍA ----------------------------------------------------------------------------


// Ruta para guardar una nueva categoría en la base de datos
app.post("/api/categorias", async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    const { nombre, descripcion } = req.body;

    // Valida que el nombre venga con contenido
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre de la categoría es obligatorio"
      });
    }

    // Usa la función de conexión que ya existe en tu proyecto
    const pool = await conectarDB();

    // Inserta la categoría en la tabla CATEGORIAS
    await pool.request()
      // Parámetro para el nombre
      .input("nombre", sql.NVarChar(100), nombre.trim())

      // Parámetro para la descripción
      // Si viene vacía, se guarda como null
      .input("descripcion", sql.NVarChar(255), descripcion ? descripcion.trim() : null)

      // Consulta SQL para insertar los datos
      .query(`
        INSERT INTO CATEGORIAS (NOMBRE, DESCRIPCION)
        VALUES (@nombre, @descripcion)
      `);

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Categoría guardada correctamente"
    });

  } catch (error) {
    // Muestra el error en consola del servidor
    console.error("Error al insertar categoría:", error);

    // Envía respuesta de error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error al guardar la categoría"
    });
  }
});


// ------------------------------------------------------------------------------------------------------------ AGREGAR NUEVA CATEGORÍA ----------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------ CARGAR CATEGORIA ----------------------------------------------------------------------------


// Ruta para obtener todas las categorías desde la base de datos
app.get("/api/categorias", async (req, res) => {
  try {
    // Se establece la conexión con la base de datos
    const pool = await conectarDB();

    // Se consultan todas las categorías ordenadas por ID ascendente
    const result = await pool.request().query(`
      SELECT ID, NOMBRE, DESCRIPCION
      FROM CATEGORIAS
      ORDER BY ID ASC
    `);

    // Se devuelve la lista de categorías al frontend
    res.json({
      ok: true,
      categorias: result.recordset
    });

  } catch (error) {
    // Muestra el error en consola para depuración
    console.error("Error en /api/categorias:", error);

    // Respuesta de error al cliente
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las categorías"
    });
  }
});


// ------------------------------------------------------------------------------------------------------------ CARGAR CATEGORIA ----------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------------------------- ACTUALIZAR CATEGORÍA -------------------------------------------------------------------------
// Ruta para actualizar una categoría existente en la base de datos
app.put("/api/categorias/:id", async (req, res) => {
  try {
    // Obtiene el id desde la URL
    const id = parseInt(req.params.id);

    // Obtiene los datos enviados desde el frontend
    const { nombre, descripcion } = req.body;

    // Valida que el id sea correcto
    if (!id || isNaN(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID de categoría no válido"
      });
    }

    // Valida que el nombre no venga vacío
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre de la categoría es obligatorio"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta la actualización
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("descripcion", sql.NVarChar(255), descripcion ? descripcion.trim() : null)
      .query(`
        UPDATE CATEGORIAS
        SET NOMBRE = @nombre,
            DESCRIPCION = @descripcion
        WHERE ID = @id
      `);

    // Si no se actualizó ninguna fila, la categoría no existía
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró la categoría a actualizar"
      });
    }

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Categoría actualizada correctamente"
    });

  } catch (error) {
    console.error("Error en PUT /api/categorias/:id:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar la categoría"
    });
  }
});


// ----------------------------------------------------------------------------------------------------------- ACTUALIZAR CATEGORÍA -------------------------------------------------------------------------




// ----------------------------------------------------------------------------------------------------------- ELIMINAR CATEGORÍA -------------------------------------------------------------------------



// Ruta para eliminar una categoría existente de la base de datos
app.delete("/api/categorias/:id", async (req, res) => {
  try {
    // Obtiene el id desde la URL
    const id = parseInt(req.params.id);

    // Valida que el id sea correcto
    if (!id || isNaN(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID de categoría no válido"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta el DELETE
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM CATEGORIAS
        WHERE ID = @id
      `);

    // Si no se eliminó ninguna fila, no existía
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró la categoría a eliminar"
      });
    }

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Categoría eliminada correctamente"
    });

  } catch (error) {
    console.error("Error en DELETE /api/categorias/:id:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar la categoría"
    });
  }
});


// ----------------------------------------------------------------------------------------------------------- ELIMINAR CATEGORÍA -------------------------------------------------------------------------



// ===========================================================================================================^ CATEGORIAS ^==================================================================================



// =========================================================================================================== PRODUCTOS ==================================================================================


// --------------------------------------------------------------------------------------------------- GUARDAR PRODUCTO ---------------------------------------------------------------------


// Ruta para guardar un nuevo producto en la base de datos
app.post("/api/productos", async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    const { nombre, descripcion, precio, imagen, stock, categoriaId } = req.body;

    // Valida los campos obligatorios
    if (!nombre || precio === undefined || precio === null || !categoriaId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, precio y categoría son obligatorios"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Inserta el producto en la tabla PRODUCTOS
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("descripcion", sql.NVarChar(255), descripcion ? descripcion.trim() : null)
      .input("precio", sql.Decimal(10, 2), precio)
      .input("stock", sql.Int, stock || 0)
      .input("imagen", sql.NVarChar(500), imagen ? imagen.trim() : null)
      .input("categoriaId", sql.Int, categoriaId)
      .query(`
        INSERT INTO PRODUCTOS (NOMBRE, DESCRIPCION, PRECIO, STOCK, URL_IMAGEN, ID_CATEGORIA)
        VALUES (@nombre, @descripcion, @precio, @stock, @imagen, @categoriaId)
      `);

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Producto guardado correctamente"
    });

  } catch (error) {
    // Muestra el error en consola del servidor
    console.error("Error en /api/productos:", error);

    // Respuesta de error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error al guardar el producto"
    });
  }
});


// ---------------------------------------------------------------------------------------------------^ GUARDAR PRODUCTO ^---------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------- CARGAR PRODUCTO ---------------------------------------------------------------------


// Ruta para obtener todos los productos desde la base de datos
app.get("/api/productos", async (req, res) => {
  try {
    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Consulta los productos junto con el nombre de su categoría
    const result = await pool.request().query(`
      SELECT 
        P.ID,
        P.NOMBRE,
        P.DESCRIPCION,
        P.PRECIO,
        P.STOCK,
        P.URL_IMAGEN,
        P.ID_CATEGORIA,
        C.NOMBRE AS CATEGORIA
      FROM PRODUCTOS P
      INNER JOIN CATEGORIAS C ON P.ID_CATEGORIA = C.ID
      ORDER BY P.ID ASC
    `);

    // Devuelve los productos al frontend
    res.json({
      ok: true,
      productos: result.recordset
    });

  } catch (error) {
    console.error("Error en /api/productos:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los productos"
    });
  }
});


// ---------------------------------------------------------------------------------------------------^ CARGAR PRODUCTO ^---------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------- ACTUALIZAR PRODUCTO ----------------------------------------------------------------
// Ruta para actualizar un producto existente en la base de datos
app.put("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, imagen, stock, categoriaId } = req.body;

    if (id === null || id === undefined || id === '' || isNaN(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID de producto no válido"
      });
    }

    if (!nombre || precio === undefined || precio === null || !categoriaId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, precio y categoría son obligatorios"
      });
    }

    const pool = await conectarDB();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("descripcion", sql.NVarChar(255), descripcion ? descripcion.trim() : null)
      .input("precio", sql.Decimal(10, 2), precio)
      .input("stock", sql.Int, stock || 0)
      .input("imagen", sql.NVarChar(500), imagen ? imagen.trim() : null)
      .input("categoriaId", sql.Int, categoriaId)
      .query(`
        UPDATE PRODUCTOS
        SET NOMBRE = @nombre,
            DESCRIPCION = @descripcion,
            PRECIO = @precio,
            STOCK = @stock,
            URL_IMAGEN = @imagen,
            ID_CATEGORIA = @categoriaId
        WHERE ID = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró el producto a actualizar"
      });
    }

    res.json({
      ok: true,
      mensaje: "Producto actualizado correctamente"
    });

  } catch (error) {
    console.error("Error en PUT /api/productos/:id:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el producto"
    });
  }
});


// --------------------------------------------------------------------------------------------------- ACTUALIZAR PRODUCTO ----------------------------------------------------------------


// -------------------------------------------------------------------------------------------------- ELIMINAR PRODUCTO ------------------------------------------------------------------
// Ruta para eliminar un producto existente de la base de datos
app.delete("/api/productos/:id", async (req, res) => {
  try {
    // Obtiene el id desde la URL
    const id = parseInt(req.params.id);

    // Valida que el id sea correcto
    if (!id || isNaN(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID de producto no válido"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta el DELETE
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM PRODUCTOS
        WHERE ID = @id
      `);

    // Si no se eliminó ninguna fila, no existía
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró el producto a eliminar"
      });
    }

    // Respuesta exitosa
    res.json({
      ok: true,
      mensaje: "Producto eliminado correctamente"
    });

  } catch (error) {
    console.error("Error en DELETE /api/productos/:id:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar el producto"
    });
  }
});


// --------------------------------------------------------------------------------------------------^ ELIMINAR PRODUCTO ^------------------------------------------------------------------



// ===========================================================================================================^ PRODUCTOS ^==================================================================================



// =========================================================================================================== LOGIN ==================================================================================


// ================= LOGIN CON BASE DE DATOS =================
app.post("/api/login", async (req, res) => {
  try {
    // 1. Obtener datos enviados desde el frontend
    const { identificador, contrasena } = req.body;

    // 2. Validar que vengan los datos
    if (!identificador || !contrasena) {
      return res.status(400).json({
        ok: false,
        mensaje: "Identificador y contraseña son obligatorios"
      });
    }

    // 3. Conectarse a SQL Server
    const pool = await conectarDB();

    // ================= BUSCAR EN USUARIOS (ADMIN) =================
    const usuarioResult = await pool.request()
      .input("nombre", sql.NVarChar(100), identificador) // usuario admin
      .input("contrasena", sql.NVarChar(100), contrasena) // contraseña ya encriptada
      .query(`
        SELECT TOP 1 ID, NOMBRE
        FROM USUARIOS
        WHERE NOMBRE = @nombre AND CONTRASENA = @contrasena
      `);

    // 4. Si lo encuentra como ADMIN
    if (usuarioResult.recordset.length > 0) {
      return res.json({
        ok: true,
        tipo: "admin", // acceso a panel
        usuario: identificador
      });
    }

  // ================= BUSCAR EN CLIENTES =================
// Busca al cliente por CORREO o por NOMBRE para permitir login con cualquiera de los dos


const clienteResult = await pool.request()
  .input("identificador", sql.NVarChar(150), identificador) // puede ser correo o nombre
  .input("contrasena", sql.NVarChar(100), contrasena) // contraseña encriptada
  .query(`
    SELECT TOP 1 ID, NOMBRE, CORREO, CONTRASENA
    FROM CLIENTES
    WHERE (CORREO = @identificador OR NOMBRE = @identificador)
      AND CONTRASENA = @contrasena
  `);

    // 5. Si lo encuentra como CLIENTE
    if (clienteResult.recordset.length > 0) {
      const cliente = clienteResult.recordset[0];

// Desencriptar contraseña guardada
const passwordPlano = Buffer.from(cliente.CONTRASENA, "base64").toString("utf-8");

// Verificar si es temporal
const esTemporal = passwordPlano.startsWith("TEMP_");

   return res.json({
  ok: true,
  tipo: "cliente",
  usuario: cliente.CORREO,   // para que la sesión use el correo real
  id: cliente.ID,
  email: cliente.CORREO,
  nombre: cliente.NOMBRE,
  requiereCambioPassword: esTemporal
});
    }

    // 6. Si no encontró nada
    return res.status(401).json({
      ok: false,
      mensaje: "Usuario o contraseña incorrectos"
    });

  } catch (error) {
    console.error("Error en /api/login:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error en servidor"
    });
  }
});


// ===========================================================================================================^ LOGIN ^==================================================================================


// ================= RECUPERAR CONTRASEÑA CLIENTE =================
app.post("/api/recuperar-password-cliente", async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El correo es obligatorio"
      });
    }

    const pool = await conectarDB();

    // Buscar cliente
    const result = await pool.request()
      .input("correo", sql.NVarChar(150), correo)
      .query(`
        SELECT ID, NOMBRE, CORREO
        FROM CLIENTES
        WHERE CORREO = @correo
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No existe una cuenta con ese correo"
      });
    }

    const cliente = result.recordset[0];

    // Generar nueva contraseña
    const nuevaPassword = "TEMP_" + generarPasswordTemporal(8);
    const passwordEncriptada = encriptarPassword(nuevaPassword);

    // Guardar nueva contraseña
    await pool.request()
      .input("id", sql.Int, cliente.ID)
      .input("contrasena", sql.NVarChar(100), passwordEncriptada)
      .query(`
        UPDATE CLIENTES
        SET CONTRASENA = @contrasena
        WHERE ID = @id
      `);

    // Enviar correo
    await transporter.sendMail({
      from: '"ZUARSE" <zuarzeweb@gmail.com>',
      to: cliente.CORREO,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hola ${cliente.NOMBRE}</p>
        <p>Tu nueva contraseña temporal es:</p>
        <h3>${nuevaPassword}</h3>
        <p>Inicia sesión y cámbiala lo antes posible.</p>
      `
    });

    res.json({
      ok: true,
      mensaje: "Correo enviado correctamente"
    });

  } catch (error) {
    console.error("Error en recuperar contraseña:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al recuperar contraseña"
    });
  }
});


// ================= CAMBIAR CONTRASEÑA =================
app.post("/api/cambiar-password", async (req, res) => {
  try {

    const { usuario, nuevaPassword } = req.body;

    if (!usuario || !nuevaPassword) {
      return res.status(400).json({
        ok: false,
        mensaje: "Datos incompletos"
      });
    }

    const pool = await conectarDB();

    // actualizar por correo o nombre
    const result = await pool.request()
      .input("usuario", sql.NVarChar(150), usuario)
      .input("contrasena", sql.NVarChar(100), nuevaPassword)
      .query(`
        UPDATE CLIENTES
        SET CONTRASENA = @contrasena
        WHERE CORREO = @usuario OR NOMBRE = @usuario
      `);

    res.json({
      ok: true,
      mensaje: "Contraseña actualizada"
    });

  } catch (error) {
    console.error("Error cambiar password:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error en servidor"
    });
  }
});

// ===========================================================================================================^ EMPLEADOS ^==================================================================================

// ================= OBTENER EMPLEADOS =================
app.get("/api/empleados", async (req, res) => {
  try {
    const pool = await conectarDB();

    const result = await pool.request().query(`
      SELECT ID, NOMBRE
      FROM USUARIOS
      ORDER BY ID DESC
    `);

    res.json({
      ok: true,
      empleados: result.recordset
    });

  } catch (error) {
    console.error("Error en /api/empleados:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener empleados"
    });
  }
});

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// =========================================================================================================== EMPLEADOS / USUARIOS ==================================================================================

// ----------------------------------------------------------------------------------------------------------- OBTENER EMPLEADOS -------------------------------------------------------------------------------
// Esta ruta trae todos los empleados desde la tabla USUARIOS.
// Solo devuelve ID y NOMBRE porque por ahora eso es lo único que necesitas mostrar.
app.get("/api/empleados", async (req, res) => {
  try {
    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Consulta los empleados ordenados del más reciente al más antiguo
    const result = await pool.request().query(`
      SELECT ID, NOMBRE
      FROM USUARIOS
      ORDER BY ID DESC
    `);

    // Devuelve los empleados al frontend
    res.json({
      ok: true,
      empleados: result.recordset
    });

  } catch (error) {
    // Muestra el error real en la consola del servidor
    console.error("Error en GET /api/empleados:", error);

    // Respuesta de error al frontend
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener empleados"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- CREAR EMPLEADO ----------------------------------------------------------------------------------
// Esta ruta crea un nuevo empleado en la tabla USUARIOS.
app.post("/api/empleados", async (req, res) => {
  try {
    // Obtiene los datos enviados desde el frontend
    const { nombre, contrasena } = req.body;

    // Validar que el nombre venga
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre de usuario es obligatorio"
      });
    }

    // Validar que la contraseña venga
    if (!contrasena) {
      return res.status(400).json({
        ok: false,
        mensaje: "La contraseña es obligatoria"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Verificar si ya existe un empleado con ese nombre
    const existe = await pool.request()
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .query(`
        SELECT ID
        FROM USUARIOS
        WHERE NOMBRE = @nombre
      `);

    // Si ya existe, devolver error
    if (existe.recordset.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe un empleado con ese nombre"
      });
    }

    // Insertar el nuevo empleado
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("contrasena", sql.NVarChar(255), contrasena)
      .query(`
        INSERT INTO USUARIOS (NOMBRE, CONTRASENA)
        VALUES (@nombre, @contrasena)
      `);

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Empleado creado correctamente"
    });

  } catch (error) {
    console.error("Error en POST /api/empleados:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al crear empleado"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- ACTUALIZAR EMPLEADO -----------------------------------------------------------------------------
// Esta ruta actualiza un empleado existente.
// Puede actualizar:
// 1. solo el nombre
// 2. nombre y contraseña, si se envía una nueva contraseña
app.put("/api/empleados/:id", async (req, res) => {
  try {
    // Obtiene el ID desde la URL
    const { id } = req.params;

    // Obtiene los datos enviados desde el frontend
    const { nombre, contrasena } = req.body;

    // Validar que el nombre venga
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre de usuario es obligatorio"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Verificar si ya existe OTRO empleado con ese mismo nombre
    const existe = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .query(`
        SELECT ID
        FROM USUARIOS
        WHERE NOMBRE = @nombre
          AND ID <> @id
      `);

    // Si existe otro con ese mismo nombre, devolver error
    if (existe.recordset.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ya existe otro empleado con ese nombre"
      });
    }

    // ---------------------------------------------------------------------------------
    // Si viene contraseña nueva, actualizamos nombre y contraseña
    // ---------------------------------------------------------------------------------
    if (contrasena) {
      const result = await pool.request()
        .input("id", sql.Int, id)
        .input("nombre", sql.NVarChar(100), nombre.trim())
        .input("contrasena", sql.NVarChar(255), contrasena)
        .query(`
          UPDATE USUARIOS
          SET 
            NOMBRE = @nombre,
            CONTRASENA = @contrasena
          WHERE ID = @id
        `);

      // Si no encontró fila para actualizar
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Empleado no encontrado"
        });
      }

      return res.json({
        ok: true,
        mensaje: "Empleado actualizado correctamente"
      });
    }

    // ---------------------------------------------------------------------------------
    // Si NO viene contraseña, solo actualizamos nombre
    // ---------------------------------------------------------------------------------
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .query(`
        UPDATE USUARIOS
        SET NOMBRE = @nombre
        WHERE ID = @id
      `);

    // Si no encontró fila para actualizar
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Empleado no encontrado"
      });
    }

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Empleado actualizado correctamente"
    });

  } catch (error) {
    console.error("Error en PUT /api/empleados/:id:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar empleado"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- ELIMINAR EMPLEADO -------------------------------------------------------------------------------
// Esta ruta elimina un empleado por ID desde la tabla USUARIOS.
app.delete("/api/empleados/:id", async (req, res) => {
  try {
    // Obtiene el ID desde la URL
    const { id } = req.params;

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Ejecuta el DELETE
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM USUARIOS
        WHERE ID = @id
      `);

    // Si no eliminó ninguna fila
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Empleado no encontrado"
      });
    }

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Empleado eliminado correctamente"
    });

  } catch (error) {
    console.error("Error en DELETE /api/empleados/:id:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar empleado"
    });
  }
});

// ===========================================================================================================^ EMPLEADOS / USUARIOS ^==================================================================================


// =========================================================================================================== PROVEEDORES ==================================================================================

// ----------------------------------------------------------------------------------------------------------- OBTENER TODOS LOS PROVEEDORES ------------------------------------------------------------------
// Esta ruta trae todos los proveedores desde la tabla PROVEEDORES.
app.get("/api/proveedores", async (req, res) => {
  try {
    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Consulta todos los proveedores
    const result = await pool.request().query(`
      SELECT 
        ID,
        NOMBRE,
        DIRECCION,
        TELEFONO,
        FECHA
      FROM PROVEEDORES
      ORDER BY ID DESC
    `);

    // Devuelve los datos al frontend
    res.json({
      ok: true,
      proveedores: result.recordset
    });

  } catch (error) {
    console.error("Error en GET /api/proveedores:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener proveedores"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- OBTENER UN PROVEEDOR POR ID ---------------------------------------------------------------------
// Esta ruta busca un proveedor específico por su ID.
app.get("/api/proveedores/:id", async (req, res) => {
  try {
    // Obtiene el ID enviado en la URL
    const { id } = req.params;

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Consulta el proveedor por ID
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          ID,
          NOMBRE,
          DIRECCION,
          TELEFONO,
          FECHA
        FROM PROVEEDORES
        WHERE ID = @id
      `);

    // Si no existe, devuelve 404
    if (result.recordset.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Proveedor no encontrado"
      });
    }

    // Devuelve el proveedor encontrado
    res.json(result.recordset[0]);

  } catch (error) {
    console.error("Error en GET /api/proveedores/:id:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener proveedor"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- CREAR PROVEEDOR ----------------------------------------------------------------------------------
// Esta ruta crea un proveedor nuevo en la tabla PROVEEDORES.
app.post("/api/proveedores", async (req, res) => {
  try {
    // Obtiene los datos enviados desde el frontend
    const { nombre, direccion, telefono } = req.body;

    // Validar nombre obligatorio
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre del proveedor es obligatorio"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Inserta el proveedor nuevo
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("direccion", sql.NVarChar(200), direccion ? direccion.trim() : null)
      .input("telefono", sql.NVarChar(20), telefono ? telefono.trim() : null)
      .query(`
        INSERT INTO PROVEEDORES (NOMBRE, DIRECCION, TELEFONO, FECHA)
        VALUES (@nombre, @direccion, @telefono, GETDATE())
      `);

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Proveedor creado correctamente"
    });

  } catch (error) {
    console.error("Error en POST /api/proveedores:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al crear proveedor"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- ACTUALIZAR PROVEEDOR ---------------------------------------------------------------------------
// Esta ruta actualiza un proveedor existente.
app.put("/api/proveedores/:id", async (req, res) => {
  try {
    // Obtiene el ID desde la URL
    const { id } = req.params;

    // Obtiene los datos enviados desde el frontend
    const { nombre, direccion, telefono } = req.body;

    // Validar nombre obligatorio
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre del proveedor es obligatorio"
      });
    }

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Actualiza el proveedor
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), nombre.trim())
      .input("direccion", sql.NVarChar(200), direccion ? direccion.trim() : null)
      .input("telefono", sql.NVarChar(20), telefono ? telefono.trim() : null)
      .query(`
        UPDATE PROVEEDORES
        SET 
          NOMBRE = @nombre,
          DIRECCION = @direccion,
          TELEFONO = @telefono
        WHERE ID = @id
      `);

    // Si no actualizó filas, no existía
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Proveedor no encontrado"
      });
    }

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Proveedor actualizado correctamente"
    });

  } catch (error) {
    console.error("Error en PUT /api/proveedores/:id:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar proveedor"
    });
  }
});

// ----------------------------------------------------------------------------------------------------------- ELIMINAR PROVEEDOR ----------------------------------------------------------------------------
// Esta ruta elimina un proveedor por ID.
app.delete("/api/proveedores/:id", async (req, res) => {
  try {
    // Obtiene el ID desde la URL
    const { id } = req.params;

    // Se conecta a la base de datos
    const pool = await conectarDB();

    // Elimina el proveedor
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM PROVEEDORES
        WHERE ID = @id
      `);

    // Si no eliminó ninguna fila
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Proveedor no encontrado"
      });
    }

    // Respuesta de éxito
    res.json({
      ok: true,
      mensaje: "Proveedor eliminado correctamente"
    });

  } catch (error) {
    console.error("Error en DELETE /api/proveedores/:id:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar proveedor"
    });
  }
});

// ===========================================================================================================^ PROVEEDORES ^==================================================================================




// ============================================================================================================= PEDIDOS ==================================================================================


// -------------------------------------------------------------------------------------------------------------- GUARDAR PEDIDO ---------------------------------------------------------------
app.post('/api/pedidos', async (req, res) => {
    console.log('===== NUEVO PEDIDO =====');
    console.log(req.body);

    try {
        const { id_cliente, fecha, estado, tipo_pago, descripcion, total, productos } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se recibieron productos para actualizar inventario'
            });
        }

        console.log('📦 [PEDIDOS] Datos recibidos:', req.body);

        if (!id_cliente || !fecha || !total) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios para guardar el pedido'
            });
        }

        const pool = await conectarDB();

        // ===============================
        // 1. GUARDAR PEDIDO
        // ===============================
        const resultado = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .input('fecha', sql.Date, fecha)
            .input('estado', sql.NVarChar(50), estado || 'procesando')
            .input('tipo_pago', sql.NVarChar(50), tipo_pago || 'Contado')
            .input('descripcion', sql.NVarChar(sql.MAX), descripcion || '')
            .input('total', sql.Decimal(10, 2), total)
            .query(`
                INSERT INTO PEDIDOS (ID_CLIENTE, FECHA, ESTADO, TIPO_PAGO, DESCRIPCION, TOTAL)
                VALUES (@id_cliente, @fecha, @estado, @tipo_pago, @descripcion, @total);

                SELECT SCOPE_IDENTITY() AS id_pedido;
            `);

        const id_pedido = resultado.recordset[0].id_pedido;

        // ===============================
        // 2. DESCONTAR STOCK 🔥
        // ===============================
        for (const producto of productos) {

            const idProducto = parseInt(producto.id);
            const cantidad = parseInt(producto.cantidad);

            console.log('➡️ Descontando producto:', idProducto, 'Cantidad:', cantidad);

            await pool.request()
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .query(`
                    UPDATE PRODUCTOS
                    SET STOCK = STOCK - @cantidad
                    WHERE ID = @idProducto
                `);
        }

        // ===============================
        // RESPUESTA
        // ===============================
        res.status(201).json({
            mensaje: 'Pedido guardado correctamente',
            id_pedido: id_pedido
        });

    } catch (error) {
        console.error('❌ [PEDIDOS] Error al guardar pedido:', error);
        res.status(500).json({
            mensaje: 'Error al guardar pedido',
            error: error.message
        });
    }
});


// -------------------------------------------------------------------------------------------------------------- GUARDAR PEDIDO ---------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------- OBTENER PEDIDOS ------------------------------------------
app.get('/api/pedidos', async (req, res) => {
    try {
        const pool = await conectarDB();

        const resultado = await pool.request().query(`
            SELECT 
                P.ID,
                C.NOMBRE AS CLIENTE,
                C.CORREO,
                P.FECHA,
                P.TOTAL,
                P.TIPO_PAGO,
                P.ESTADO,
                P.DESCRIPCION
            FROM PEDIDOS P
            INNER JOIN CLIENTES C ON P.ID_CLIENTE = C.ID
            ORDER BY P.ID DESC
        `);

        res.json({
            ok: true,
            pedidos: resultado.recordset
        });

    } catch (error) {
        console.error('❌ Error obteniendo pedidos:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener pedidos'
        });
    }
});

// -------------------------------------------------------------------------------------------------------------- OBTENER PEDIDOS ------------------------------------------

// -------------------------------------------------------------------------------------------------------------- ELIMINAR PEDIDO -----------------------------------------

app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await conectarDB();

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM PEDIDOS
                WHERE ID = @id
            `);

        res.json({
            ok: true,
            mensaje: 'Pedido eliminado correctamente'
        });

    } catch (error) {
        console.error('❌ Error eliminando pedido:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar pedido'
        });
    }
});

// -------------------------------------------------------------------------------------------------------------- ELIMINAR PEDIDO -----------------------------------------


// -------------------------------------------------------------------------------------------------------------- ACTUALIZAR PEDIDO -----------------------------------------


app.put('/api/pedidos/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El estado es obligatorio'
            });
        }

        const pool = await conectarDB();

        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.NVarChar(50), estado)
            .query(`
                UPDATE PEDIDOS
                SET ESTADO = @estado
                WHERE ID = @id
            `);

        res.json({
            ok: true,
            mensaje: 'Estado actualizado correctamente'
        });

    } catch (error) {
        console.error('❌ Error actualizando estado del pedido:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar estado'
        });
    }
});

// -------------------------------------------------------------------------------------------------------------- ACTUALIZAR PEDIDO -----------------------------------------



// -------------------------------------------------------------------------------------------------------------- ENVIAR PEDIDO POR EMAIL -----------------------------------------

app.post('/api/pedidos/enviar-pdf', async (req, res) => {
    try {
        const { to, subject, html, pdfBase64, fileName } = req.body;

        if (!to || !pdfBase64) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Faltan datos para enviar el correo'
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: subject || 'Comprobante de Pedido - ZUARSE',
            html: html || '<p>Adjunto encontrarás el comprobante de tu pedido.</p>',
            attachments: [
                {
                    filename: fileName || 'pedido.pdf',
                    content: pdfBase64,
                    encoding: 'base64'
                }
            ]
        });

        res.json({
            ok: true,
            mensaje: 'Correo enviado correctamente'
        });

    } catch (error) {
        console.error('❌ Error enviando PDF por email:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al enviar el correo'
        });
    }
});

// -------------------------------------------------------------------------------------------------------------- ENVIAR PEDIDO POR EMAIL -----------------------------------------



// =========================================================================================================== INVENTARIO =========================================================

app.get('/api/inventario', async (req, res) => {
    try {
        const pool = await conectarDB();

        const { categoria } = req.query;

        let query = `
            SELECT 
                P.ID,
                P.NOMBRE,
                P.STOCK,
                C.NOMBRE AS CATEGORIA
            FROM PRODUCTOS P
            INNER JOIN CATEGORIAS C ON P.ID_CATEGORIA = C.ID
        `;

        const request = pool.request();

        // filtro por categoría (opcional)
        if (categoria && categoria !== 'todas') {
            query += ` WHERE C.ID = @categoria `;
            request.input('categoria', sql.Int, categoria);
        }

        // ORDEN: menor stock primero 🔥
        query += ` ORDER BY P.STOCK ASC `;

        const result = await request.query(query);

        res.json({
            ok: true,
            inventario: result.recordset
        });

    } catch (error) {
        console.error('Error inventario:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener inventario'
        });
    }
});