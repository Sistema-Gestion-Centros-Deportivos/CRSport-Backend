const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'gestion'
};

exports.getConnection = () => {
  return mysql.createConnection(dbConfig);
};
