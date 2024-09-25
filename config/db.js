// db.js
const { Pool } = require('pg');

// Configuración del Pool de conexión a PostgreSQL con Supabase
const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  database: process.env.SUPABASE_DB,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  port: process.env.SUPABASE_PORT,
  ssl: {
    rejectUnauthorized: false, // Requiere configuración SSL para conexiones seguras
  },
});

// Función para obtener una conexión del Pool
const getConnection = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

module.exports = { getConnection };

// const mysql = require('mysql2/promise');
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'gestion'
// };

// exports.getConnection = () => {
//   return mysql.createConnection(dbConfig);
// };
