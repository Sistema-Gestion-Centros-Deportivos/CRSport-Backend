// const mysql = require('mysql2/promise');
// const dbConfig = require('../config/db');
const instalacionesModel = require('../models/instalacionesModel');

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

// Crear una nueva instalación
exports.crearInstalacion = async (req, res) => {
  const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;
  try {
    const nuevaInstalacion = await instalacionesModel.createInstalacion(
      nombre,
      descripcion,
      ubicacion,
      disponible_desde,
      disponible_hasta
    );
    res.status(201).json({ message: 'Instalación creada exitosamente', instalacion: nuevaInstalacion });
  } catch (error) {
    console.error('Error al crear la instalación:', error);
    res.status(500).json({ error: 'Error al crear la instalación' });
  }
};

// Actualizar una instalación
exports.actualizarInstalacion = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const instalacionActualizada = await instalacionesModel.updateInstalacion(id, updates);
    if (!instalacionActualizada) {
      return res.status(404).json({ error: 'Instalación no encontrada' });
    }
    res.json({ message: 'Instalación actualizada exitosamente', instalacion: instalacionActualizada });
  } catch (error) {
    console.error('Error al actualizar la instalación:', error);
    res.status(500).json({ error: 'Error al actualizar la instalación' });
  }
};

// Eliminar una instalación
exports.eliminarInstalacion = async (req, res) => {
  const { id } = req.params;
  try {
    const instalacionEliminada = await instalacionesModel.deleteInstalacion(id);
    if (!instalacionEliminada) {
      return res.status(404).json({ error: 'Instalación no encontrada' });
    }
    res.json({ message: 'Instalación eliminada exitosamente', instalacion: instalacionEliminada });
  } catch (error) {
    console.error('Error al eliminar la instalación:', error);
    res.status(500).json({ error: 'Error al eliminar la instalación' });
  }
};




// // Crear instalación
// exports.crearInstalacion = async (req, res) => {
//   try {
//     const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;

//     // Validar formato de fecha y hora
//     const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
//     if (!datetimeRegex.test(disponible_desde) || !datetimeRegex.test(disponible_hasta)) {
//       return res.status(400).json({ error: 'Formato de fecha y hora inválido. Debe ser YYYY-MM-DD HH:MM:SS' });
//     }

//     const connection = await dbConfig.getConnection();

//     await connection.execute(
//       'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) VALUES (?, ?, ?, ?, ?)',
//       [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta]
//     );
//     res.status(201).json({ message: 'Instalación creada exitosamente' });
//   } catch (error) {
//     console.error('Error al crear la instalación:', error.message);  // Agregar más detalles del error
//     res.status(500).json({ error: `Error al crear la instalación: ${error.message}` });
//   }
// };

// // Obtener todas las instalaciones
// exports.obtenerInstalaciones = async (req, res) => {
//   try {
//     const connection = await dbConfig.getConnection();
//     const [rows] = await connection.execute('SELECT * FROM instalaciones');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error al obtener las instalaciones:', error);
//     res.status(500).json({ error: 'Error al obtener las instalaciones' });
//   }
// };

// // Obtener una instalación por ID
// exports.obtenerInstalacion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await dbConfig.getConnection();
//     const [rows] = await connection.execute('SELECT * FROM instalaciones WHERE id = ?', [id]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Instalación no encontrada' });
//     }
    
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener la instalación' });
//   }
// };

// // Actualizar instalación
// exports.actualizarInstalacion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;

//     // Crear un array para almacenar los campos a actualizar y sus valores
//     let fields = [];
//     let values = [];

//     if (nombre) {
//       fields.push('nombre = ?');
//       values.push(nombre);
//     }
//     if (descripcion) {
//       fields.push('descripcion = ?');
//       values.push(descripcion);
//     }
//     if (ubicacion) {
//       fields.push('ubicacion = ?');
//       values.push(ubicacion);
//     }
//     if (disponible_desde) {
//       fields.push('disponible_desde = ?');
//       values.push(disponible_desde);
//     }
//     if (disponible_hasta) {
//       fields.push('disponible_hasta = ?');
//       values.push(disponible_hasta);
//     }

//     // Asegurarse de que hay al menos un campo para actualizar
//     if (fields.length === 0) {
//       return res.status(400).json({ error: 'No hay campos para actualizar' });
//     }

//     // Construir la consulta SQL
//     const sql = `UPDATE instalaciones SET ${fields.join(', ')} WHERE id = ?`;
//     values.push(id);

//     // Obtener la conexión y ejecutar la consulta
//     const connection = await dbConfig.getConnection();
//     await connection.execute(sql, values);

//     res.status(200).json({ message: 'Instalación actualizada correctamente' });
//   } catch (error) {
//     console.error('Error al actualizar la instalación:', error);
//     res.status(500).json({ error: 'Error al actualizar la instalación' });
//   }
// };

// // Eliminar instalación
// exports.eliminarInstalacion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await dbConfig.getConnection();
//     await connection.execute('DELETE FROM instalaciones WHERE id = ?', [id]);
//     res.json({ message: 'Instalación eliminada exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar la instalación' });
//   }
// };
