import { Router } from 'express';
import {
    createComment,
    createCommentOnTask, 
    getCommentsByProject,
    getCommentsByTask,
    updateComment,
    deleteComment
} from '../controllers/Comment.js';

import { validarJWT } from "../middlewares/validar-jwt.js";           
import { validateAdmiRole } from "../middlewares/validar-roles.js";   
// Importa otros middlewares de roles si los tienes, ej:
// import { validateProjectMember, validateProjectManager } from "../middlewares/validar-roles.js";

const router = Router();

// Crear un comentario en un proyecto específico.
router.post('/projects/:projectId/comments', validarJWT, createComment); // Considera añadir `validateProjectMember`

//  Obtener todos los comentarios de un proyecto específico.
router.get('/projects/:projectId/comments', validarJWT, getCommentsByProject); // Considera añadir `validateProjectMember`

// Crear un comentario en una tarea específica.
router.post('/tasks/:taskId/comments', validarJWT, createCommentOnTask); // Considera añadir `validateTaskMember`

// Obtener todos los comentarios de una tarea específica.
router.get('/tasks/:taskId/comments', validarJWT, getCommentsByTask); // Considera añadir `validateTaskMember`

//  Editar un comentario existente.
// Solo el autor del comentario o un Admin/ProjectManager.
router.put('/comments/:id', validarJWT, updateComment);

//  Eliminar un comentario existente.
// Solo el autor del comentario o un Admin/ProjectManager.
router.delete('/comments/:id', validarJWT, deleteComment);

export default router;