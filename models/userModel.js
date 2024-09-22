const mysql = require('../config/db');

exports.createUser = async (nombre, correo, contraseña, rol) => {
  const connection = await mysql.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contraseña, rol]
    );
    return result;
  } finally {
    await connection.end();
  }
};

exports.findUserByEmail = async (correo) => {
  const connection = await mysql.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0];
  } finally {
    await connection.end();
  }
};

