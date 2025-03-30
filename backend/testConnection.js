import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    enableArithAbort: true,
  },
};

async function testConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Conexión exitosa a SQL Server');
    await pool.close();
  } catch (err) {
    console.error('❌ Error al conectar a SQL Server:', err);
  }
}

testConnection();