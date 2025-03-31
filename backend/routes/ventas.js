import express from 'express';
import { registrarVenta } from '../controllers/ventasController.js';

const router = express.Router();

// Ruta para registrar una venta
router.post('/registrar', registrarVenta);

export default router;
