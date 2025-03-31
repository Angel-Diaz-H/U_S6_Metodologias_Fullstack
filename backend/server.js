import express from 'express';
import { poolPromise } from './db.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS prueba');
    res.json({ message: 'Conexión exitosa', result: result.recordset });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

import productosRoutes from './routes/productos.js';

app.use('/productos', productosRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
