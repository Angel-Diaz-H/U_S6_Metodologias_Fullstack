import express from 'express';
import { agregarProducto } from '../controllers/productosController.js';

const router = express.Router();

// Ruta para agregar un producto
router.post('/agregar', agregarProducto);

export default router;
