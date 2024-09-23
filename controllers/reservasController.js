const dbConfig = require('../config/db');

// Crear una reserva
exports.crearReserva = async (req, res) => {
    try {
      const { instalacion_id, fecha_reserva, hora_inicio, hora_fin } = req.body;
      const usuario_id = req.user.userId;
  
      if (!instalacion_id || !fecha_reserva || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      const connection = await dbConfig.getConnection();
      const query = `
        INSERT INTO reservas (usuario_id, instalacion_id, fecha_reserva, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [usuario_id, instalacion_id, fecha_reserva, hora_inicio, hora_fin]);
      await connection.end(); // Cerrar la conexión manualmente
      res.status(201).json({ message: 'Reserva creada exitosamente', reservaId: result.insertId });
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      res.status(500).json({ error: 'Error al crear la reserva' });
    }
  };

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
    try {
      const connection = await dbConfig.getConnection();
      const [reservas] = await connection.execute('SELECT * FROM reservas');
      await connection.end(); // Liberar la conexión manualmente
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ error: 'Error al obtener reservas' });
    }
  };

// Obtener una reserva por ID
exports.obtenerReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await dbConfig.getConnection();
      const [reservas] = await connection.execute('SELECT * FROM reservas WHERE id = ?', [id]);
      await connection.end(); // Liberar la conexión manualmente
  
      if (reservas.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
  
      res.json(reservas[0]);
    } catch (error) {
      console.error('Error al obtener la reserva:', error);
      res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

// Actualizar una reserva
exports.actualizarReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const { instalacion_id, fecha_reserva, hora_inicio, hora_fin, estado_id } = req.body;
  
      // Verificar si al menos un campo está presente
      if (!instalacion_id && !fecha_reserva && !hora_inicio && !hora_fin && !estado_id) {
        return res.status(400).json({ error: 'Al menos un campo debe ser proporcionado para actualizar' });
      }
  
      const fields = [];
      const values = [];
  
      if (instalacion_id) {
        fields.push('instalacion_id = ?');
        values.push(instalacion_id);
      }
      if (fecha_reserva) {
        fields.push('fecha_reserva = ?');
        values.push(fecha_reserva);
      }
      if (hora_inicio) {
        fields.push('hora_inicio = ?');
        values.push(hora_inicio);
      }
      if (hora_fin) {
        fields.push('hora_fin = ?');
        values.push(hora_fin);
      }
      if (estado_id) {
        fields.push('estado_id = ?');
        values.push(estado_id);
      }
  
      values.push(id); // Agregar el ID al final de los valores
  
      const query = `
        UPDATE reservas
        SET ${fields.join(', ')}
        WHERE id = ?
      `;
  
      const connection = await dbConfig.getConnection();
      const [result] = await connection.execute(query, values);
      await connection.end(); // Liberar la conexión manualmente
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
  
      res.json({ message: 'Reserva actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};

// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await dbConfig.getConnection();
      const [result] = await connection.execute('DELETE FROM reservas WHERE id = ?', [id]);
      await connection.end(); // Liberar la conexión manualmente
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
  
      res.json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};
