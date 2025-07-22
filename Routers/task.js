import { Router } from 'express';
import * as TaskController from '../controllers/task.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Crear tarea en un proyecto
router.post('/:projectId/tasks', authMiddleware, TaskController.createTask);

// Obtener tareas de un proyecto
router.get('/:projectId/tasks', authMiddleware, TaskController.getTasksByProject);

// Obtener tarea por ID
router.get('/tasks/:taskId', authMiddleware, TaskController.getTaskById);

// Asignar tarea
router.put('/tasks/:taskId/assign', authMiddleware, TaskController.assignTask);

// Actualizar estado de tarea
router.patch('/tasks/:taskId/status', authMiddleware, TaskController.updateTaskStatus);

// Establecer dependencias
router.put('/tasks/:taskId/dependencies', authMiddleware, TaskController.setDependencies);

// Eliminar tarea
router.delete('/tasks/:taskId', authMiddleware, TaskController.deleteTask);

export default router;
