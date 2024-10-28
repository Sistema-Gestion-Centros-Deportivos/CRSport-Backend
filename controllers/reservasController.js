// reservasController.js
const reservasModel = require('../models/reservasModel');

// Controlador para crear una nueva reserva
exports.crearReserva = async (req, res) => {
  const { usuario_id, instalacion_bloque_semanal_id, fecha_reserva, estado_id } = req.body;

  if (!usuario_id || !instalacion_bloque_semanal_id || !fecha_reserva || !estado_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const nuevaReserva = await reservasModel.createReserva(
      usuario_id,
      instalacion_bloque_semanal_id,
      fecha_reserva,
      estado_id
    );
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservasModel.getAllReservas();
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ error: 'Error al obtener las reservas.' });
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

// Controlador para eliminar una reserva
exports.eliminarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    const reservaEliminada = await reservasModel.eliminarReserva(id);

    if (!reservaEliminada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada exitosamente', reserva: reservaEliminada });
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
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