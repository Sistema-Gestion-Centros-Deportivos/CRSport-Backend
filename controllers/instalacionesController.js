const instalacionesModel = require('../models/instalacionesModel');
const multer = require('multer');
const bucket = require('../config/firebaseConfig');

// Configuración de multer para recibir archivos
const storage = multer.memoryStorage(); // Guardar archivo en memoria temporal
const upload = multer({ storage: storage });

// Obtener todas las instalaciones
exports.obtenerInstalaciones = async (req, res) => {
  try {
    const instalaciones = await instalacionesModel.getAllInstalaciones();
    res.json(instalaciones);
  } catch (error) {
    console.error('Error al obtener instalaciones:', error);
    res.status(500).json({ error: 'Error al obtener instalaciones' });
  }
};

// Obtener una instalación por ID
exports.obtenerInstalacion = async (req, res) => {
  const { id } = req.params;
  try {
    const instalacion = await instalacionesModel.getInstalacionById(id);
    if (!instalacion) {
      return res.status(404).json({ error: 'Instalación no encontrada' });
    }
    res.json(instalacion);
  } catch (error) {
    console.error('Error al obtener la instalación:', error);
    res.status(500).json({ error: 'Error al obtener la instalación' });
  }
};

// Crear una nueva instalación con imagen
exports.crearInstalacion = async (req, res) => {
  const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;
  const imagen = req.file ? req.file.originalname : null; // Si se subió una imagen, obtener su nombre de archivo

  try {
    const nuevaInstalacion = await instalacionesModel.createInstalacion(
      nombre,
      descripcion,
      ubicacion,
      disponible_desde,
      disponible_hasta,
      imagen // Pasamos la imagen al modelo
    );
    res.status(201).json(nuevaInstalacion);
  } catch (error) {
    console.error('Error al crear la instalación:', error);
    res.status(500).json({ error: 'Error al crear la instalación' });
  }
};

// Actualizar una instalación con imagen o cualquier otro campo
exports.actualizarInstalacion = async (req, res) => {
  const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta, imagen_url } = req.body;

  const updates = {
    nombre,
    descripcion,
    ubicacion,
    disponible_desde,
    disponible_hasta,
    imagen: imagen_url // Almacenar la URL de la imagen
  };

  // Eliminar los campos que no fueron proporcionados (null o undefined)
  Object.keys(updates).forEach(key => {
    if (updates[key] === undefined || updates[key] === null) {
      delete updates[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
  }

  try {
    const instalacionActualizada = await instalacionesModel.updateInstalacion(req.params.id, updates);
    res.status(200).json(instalacionActualizada);
  } catch (error) {
    console.error('Error al actualizar la instalación:', error);
    res.status(500).json({ error: 'Error al actualizar la instalación' });
  }
};


// Eliminar una instalación
exports.eliminarInstalacion = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await dbConfig.getConnection();
    const query = 'DELETE FROM instalaciones WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    await connection.end(); // Liberar la conexión manualmente

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instalación no encontrada' });
    }

    res.json({ message: 'Instalación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la instalación:', error);
    res.status(500).json({ error: 'Error al eliminar la instalación' });
  }
};

// Subir imágenes a Firebase Storage
exports.subirImagenFirebase = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  const blob = bucket.file(Date.now() + '-' + req.file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).send({ message: 'Imagen subida exitosamente', imageUrl: publicUrl });
  });

  blobStream.end(req.file.buffer);
};

// Exportar la configuración de multer
exports.upload = upload;
