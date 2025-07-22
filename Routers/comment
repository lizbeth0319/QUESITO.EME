import { Router } from 'express';
import * as CommentController from '../controllers/commentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Crear comentario en proyecto
router.post('/:projectId/comments', authMiddleware, CommentController.createComment);

// Obtener comentarios de un proyecto
router.get('/:projectId/comments', authMiddleware, CommentController.getCommentsByProject);

// Crear comentario en tarea
router.post('/tasks/:taskId/comments', authMiddleware, CommentController.createCommentOnTask);

// Obtener comentarios de una tarea
router.get('/tasks/:taskId/comments', authMiddleware, CommentController.getCommentsByTask);

// Editar comentario
router.put('/comments/:commentId', authMiddleware, CommentController.updateComment);

// Eliminar comentario
router.delete('/comments/:commentId', authMiddleware, CommentController.deleteComment);

export default router;
