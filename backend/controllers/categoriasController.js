import { poolPromise } from '../db.js';

export const listarCategorias = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CATEGORIAS WHERE ACTIVO = 1');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al listar categorías:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const agregarCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  try {
    const pool = await poolPromise;
    await pool.request().input('nombre', nombre).query(`
      INSERT INTO CATEGORIAS (NOMBRE, ACTIVO) VALUES (@nombre, 1)
    `);
    res.status(201).json({ message: 'Categoría agregada con éxito' });
  } catch (error) {
    console.error('Error al agregar categoría:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  try {
    const pool = await poolPromise;
    await pool.request().input('id', id).input('nombre', nombre).query(`
      UPDATE CATEGORIAS SET NOMBRE = @nombre WHERE ID_CATEGORIA = @id
    `);
    res.status(200).json({ message: 'Categoría actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const desactivarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input('id', id).query(`
      UPDATE CATEGORIAS SET ACTIVO = 0 WHERE ID_CATEGORIA = @id
    `);
    res.status(200).json({ message: 'Categoría desactivada con éxito' });
  } catch (error) {
    console.error('Error al desactivar categoría:', error.message);
    res.status(500).json({ error: error.message });
  }
};