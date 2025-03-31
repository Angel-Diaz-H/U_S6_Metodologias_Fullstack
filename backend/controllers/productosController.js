import { poolPromise } from '../db.js';

export const agregarProducto = async (req, res) => {
  const { nombre, descripcion, precio, cantidad, id_categoria } = req.body;

  if (!nombre || !descripcion || !precio || !cantidad || !id_categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('precio', precio)
      .input('cantidad', cantidad)
      .input('id_categoria', id_categoria)
      .query(`
        INSERT INTO BDPVPAPELERIA.dbo.PRODUCTOS (NOMBRE, DESCRIPCION, PRECIO, CANTIDAD, ID_CATEGORIA)
        VALUES (@nombre, @descripcion, @precio, @cantidad, @id_categoria)
      `);
    res.status(201).json({ message: 'Producto agregado con éxito', result });
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    res.status(500).json({ error: error.message });
  }
};
