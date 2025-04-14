import express from 'express';
import {
  listarCategorias,
  agregarCategoria,
  actualizarCategoria,
  desactivarCategoria,
} from '../controllers/categoriasController.js';

const router = express.Router();

router.get('/listar', listarCategorias);
router.post('/agregar', agregarCategoria);
router.put('/actualizar/:id', actualizarCategoria);
router.put('/desactivar/:id', desactivarCategoria);

export default router;