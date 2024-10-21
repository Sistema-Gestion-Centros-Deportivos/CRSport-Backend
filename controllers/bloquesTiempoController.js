// bloquesTiempoController.js
const bloquesTiempoModel = require('../models/bloquesTiempoModel');

// bloquesTiempoController.js
exports.crearBloqueTiempo = async (req, res) => {
    const { instalacion_id, bloque, hora_inicio, hora_fin, disponible } = req.body;
    try {
      // Validar los datos de entrada
      if (!bloque || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: 'Los campos bloque, hora_inicio y hora_fin son obligatorios.' });
      }
  
      // Intentar crear el bloque de tiempo
      const nuevoBloque = await bloquesTiempoModel.createBloqueTiempo(instalacion_id, bloque, hora_inicio, hora_fin, disponible);
      res.status(201).json({ message: 'Bloque de tiempo creado exitosamente', bloque: nuevoBloque });
    } catch (error) {
      console.error('Error al crear el bloque de tiempo:', error);
      if (error.message.includes('El bloque de tiempo ya existe.')) {
        return res.status(400).json({ error: 'El bloque de tiempo ya existe con esos parámetros.' });
      }
      res.status(500).json({ error: 'Error al crear el bloque de tiempo' });
    }
  };


// Obtener todos los bloques de tiempo
exports.obtenerBloquesTiempo = async (req, res) => {
    try {
        const bloques = await bloquesTiempoModel.getAllBloquesTiempo();
        res.json(bloques);
    } catch (error) {
        console.error('Error al obtener los bloques de tiempo:', error);
        res.status(500).json({ error: 'Error al obtener los bloques de tiempo' });
    }
};

// Obtener todos los bloques de una instalación
exports.obtenerBloquesPorInstalacion = async (req, res) => {
    const { instalacion_id } = req.params;
    try {
        const bloques = await bloquesTiempoModel.getBloquesByInstalacion(instalacion_id);
        res.json(bloques);
    } catch (error) {
        console.error('Error al obtener los bloques de tiempo:', error);
        res.status(500).json({ error: 'Error al obtener los bloques de tiempo' });
    }
};

// bloquesTiempoController.js
exports.actualizarBloqueTiempo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Obteniendo los campos a actualizar desde el cuerpo de la solicitud
  
    try {
      // Llamar al modelo para actualizar el bloque de tiempo
      const bloqueActualizado = await bloquesTiempoModel.updateBloqueTiempo(id, updates);
      if (!bloqueActualizado) {
        return res.status(404).json({ error: 'Bloque de tiempo no encontrado' });
      }
      res.json({ message: 'Bloque de tiempo actualizado exitosamente', bloque: bloqueActualizado });
    } catch (error) {
      console.error('Error al actualizar el bloque de tiempo:', error);
      res.status(500).json({ error: 'Error al actualizar el bloque de tiempo' });
    }
  };

// Eliminar un bloque de tiempo
exports.eliminarBloqueTiempo = async (req, res) => {
    const { id } = req.params;
    try {
      const bloqueEliminado = await bloquesTiempoModel.deleteBloqueTiempo(id);
      if (!bloqueEliminado) {
        return res.status(404).json({ error: 'Bloque de tiempo no encontrado' });
      }
      res.json({ message: 'Bloque de tiempo eliminado exitosamente', bloque: bloqueEliminado });
    } catch (error) {
      console.error('Error al eliminar el bloque de tiempo:', error);
      res.status(500).json({ error: 'Error al eliminar el bloque de tiempo' });
    }
  };