import express from 'express';
import { poolPromise } from './db.js';
import productosRoutes from './routes/productos.js'; // Importa las rutas de productos
import ventasRoutes from './routes/ventas.js'; // Importa las rutas de ventas

const app = express();
app.use(express.json());

// Ruta base para verificar conexión
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

// Usa las rutas de productos
app.use('/productos', productosRoutes);

// Usa las rutas de ventas
app.use('/ventas', ventasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});