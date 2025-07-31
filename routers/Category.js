import { Router } from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/Category.js"; 

import { validarJWT } from "../middlewares/validar-jwt.js";       
import { validateAdmiRole } from "../middlewares/validar-roles.js"; 

const router = Router();

//  Listar todas las categorías (activas ).
router.get('/categories', getCategories);

//  Crear una nueva categoría.
router.post('/categories', validarJWT, validateAdmiRole, createCategory);

// Actualizar una categoría existente por su ID.
router.put('/categories/:name', validarJWT, validateAdmiRole, updateCategory);

// Eliminar una categoría por su ID.
router.delete('/categories/:name', validarJWT, validateAdmiRole, deleteCategory);

export default router;