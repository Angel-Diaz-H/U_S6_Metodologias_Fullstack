// db.js
const { Connection, Request } = require('tedious');

const config = {
  server: 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'Sql2019$', // Cambia esto por tu contraseña
    },
  },
  options: {
    database: 'sqlserver2019_PVPapeleria', // Nombre de la base de datos
    encrypt: false,
    trustServerCertificate: true,
  },
};

const connection = new Connection(config);

connection.on('connect', (err) => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conectado a SQL Server');
  }
});

module.exports = connection;