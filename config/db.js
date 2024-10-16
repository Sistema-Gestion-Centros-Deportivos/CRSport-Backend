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
    rejectUnauthorized: false, // Permitir conexiones seguras sin verificar el certificado
  },
  max: 10, // Limitar el número máximo de conexiones simultáneas
  idleTimeoutMillis: 30000, // Tiempo máximo de inactividad antes de cerrar la conexión
  connectionTimeoutMillis: 2000, // Tiempo de espera para obtener una nueva conexión
});

// Función para obtener una conexión del Pool
const getConnection = async () => {
  try {
    console.log('Intentando conectar a la base de datos...');
  
    const client = await pool.connect();
    console.log('Conexión exitosa a la base de datos');
    return client;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error; // Relanzar el error para que pueda ser manejado en otros lugares
  }
};

// Exportar la función de conexión
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
