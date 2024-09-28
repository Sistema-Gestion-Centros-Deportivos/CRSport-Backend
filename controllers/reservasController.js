// reservasController.js
const reservasModel = require('../models/reservasModel');

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  const { usuario_id, instalacion_id, fecha_reserva, bloque_tiempo_id, estado_id } = req.body;
  try {
    const nuevaReserva = await reservasModel.createReserva(
      usuario_id,
      instalacion_id,
      fecha_reserva,
      bloque_tiempo_id,
      estado_id
    );
    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una reserva
exports.actualizarReserva = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const reservaActualizada = await reservasModel.updateReserva(id, updates);
    if (!reservaActualizada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva actualizada exitosamente', reserva: reservaActualizada });
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reservaEliminada = await reservasModel.deleteReserva(id);
    if (!reservaEliminada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva eliminada exitosamente', reserva: reservaEliminada });
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservasModel.getAllReservas();
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Obtener una reserva por ID
exports.obtenerReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await reservasModel.getReservaById(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(reserva);
  } catch (error) {
    console.error('Error al obtener la reserva:', error);
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};