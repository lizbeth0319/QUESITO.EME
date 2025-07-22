import { Router } from 'express';
import * as StateController from '../controllers/state.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Crear estado
router.post('/', authMiddleware, StateController.createState);

// Obtener todos los estados
router.get('/', authMiddleware, StateController.getAllStates);

// Obtener estado por ID
router.get('/:stateId', authMiddleware, StateController.getStateById);

// Actualizar estado
router.put('/:stateId', authMiddleware, StateController.updateState);

// Eliminar estado
router.delete('/:stateId', authMiddleware, StateController.deleteState);

// Validar transición
router.post('/validate-transition', authMiddleware, StateController.validateTransition);

export default router;
