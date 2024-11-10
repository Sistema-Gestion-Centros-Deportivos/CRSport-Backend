// reservasController.js
const reservasModel = require('../models/reservasModel');

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  const { usuario_id, instalacion_bloque_periodico_id } = req.body;

  try {
      const reservaId = await reservasModel.crearReserva(usuario_id, instalacion_bloque_periodico_id);

      res.status(201).json({ message: 'Reserva creada exitosamente', reservaId });
  } catch (error) {
      console.error('Error al crear la reserva:', error);
      res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

// Obtener todas las reservas
exports.obtenerTodasLasReservas = async (req, res) => {
  try {
      const reservas = await reservasModel.getAllReservas();
      res.json(reservas);
  } catch (error) {
      console.error('Error al obtener todas las reservas:', error);
      res.status(500).json({ error: 'Error al obtener todas las reservas' });
  }
};

// Obtener reservas por usuario
exports.obtenerReservasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
      const reservas = await reservasModel.getReservasByUsuarioId(usuarioId);
      res.json(reservas);
  } catch (error) {
      console.error('Error al obtener reservas por usuario:', error);
      res.status(500).json({ error: 'Error al obtener reservas por usuario' });
  }
};

// Obtener reservas por instalación y fecha
exports.obtenerReservasPorInstalacionYFecha = async (req, res) => {
  const { instalacionId, fecha } = req.params;
  try {
      const reservas = await reservasModel.getReservasPorInstalacionYFecha(instalacionId, fecha);
      res.json(reservas);
  } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Modificar una reserva existente
exports.modificarReserva = async (req, res) => {
  const { reservaId } = req.params;
  const { bloque_tiempo_id, fecha } = req.body;
  try {
      await reservasModel.modificarReserva(reservaId, bloque_tiempo_id, fecha);
      res.status(200).json({ message: 'Reserva modificada exitosamente' });
  } catch (error) {
      console.error('Error al modificar reserva:', error);
      res.status(500).json({ error: 'Error al modificar reserva' });
  }
};

// Eliminar una reserva para administradores
exports.eliminarReserva = async (req, res) => {
  const { reservaId } = req.params;
  try {
      await reservasModel.eliminarReserva(reservaId);
      res.json({ message: 'Reserva eliminada y bloque liberado exitosamente' });
  } catch (error) {
      console.error('Error al eliminar reserva:', error);
      res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};

// Cancelar y liberar una reserva
exports.eliminarYLiberarReserva = async (req, res) => {
  const { reservaId } = req.params;

  try {
    await reservasModel.eliminarYLiberarReserva(reservaId);
    res.status(200).json({ message: 'Reserva eliminada y bloque liberado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar y liberar la reserva:', error);
    res.status(500).json({ error: 'Error al eliminar y liberar la reserva' });
  }
};


// Obtener disponibilidad de una instalación en un rango de fechas
exports.obtenerDisponibilidadPorRango = async (req, res) => {
  const { instalacionId } = req.params;
  const { start_date, end_date } = req.query;
  try {
      const disponibilidad = await reservasModel.getDisponibilidadPorRango(instalacionId, start_date, end_date);
      res.json(disponibilidad);
  } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
      res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};
