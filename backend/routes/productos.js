import express from 'express';
import { agregarProducto, listarProductos } from '../controllers/productosController.js';

const router = express.Router();

// Ruta para agregar un producto
router.post('/agregar', agregarProducto);

// Ruta para listar productos
router.get('/listar', listarProductos);

export default router;