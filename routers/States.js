import { Router } from 'express';
import * as StateController from '../controllers/state.js';
import validarJWT from "../middlewares/validar-jwt.js"

const router = Router();

// Crear estado
router.post('/api/', validarJWT, StateController.createState);

// Obtener todos los estados
router.get('/api/', validarJWT, StateController.getAllStates);

// Obtener estado por ID
router.get('/api/:stateId', validarJWT, StateController.getStateById);

// Actualizar estado
router.put('/api/:stateId', validarJWT, StateController.updateState);

// Eliminar estado
router.delete('/api/:stateId', validarJWT, StateController.deleteState);

// Validar transición
router.post('/api/validate-transition', validarJWT, StateController.validateTransition);

export default router;