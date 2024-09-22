const mysql = require('../config/db');

exports.getAll = async () => {
  const connection = await mysql.getConnection();
  const [rows] = await connection.execute('SELECT * FROM instalaciones');
  return rows;
};

exports.create = async (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) => {
  const connection = await mysql.getConnection();
  const [result] = await connection.execute(
    'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta]
  );
  return result;
};
