import { Router } from 'express';
import {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,          
    assignTask,
    updateTaskStatus, 
    deleteTask,
    getMyTasks 
} from '../controllers/Task.js';

import { validarJWT } from "../middlewares/validar-jwt.js";                
import { validateAdmiRole } from "../middlewares/validar-roles.js";     
// Importa otros middlewares de roles si los tienes, ej:
// import { validateProjectMember, validateProjectManager } from "../middlewares/validar-roles.js";

const router = Router();

//  Crear una nueva tarea para un proyecto específico.
router.post('/projects/:projectId/tasks', validarJWT, validateAdmiRole, createTask); // Puedes cambiar `validateAdmiRole` por `validateProjectManager`

//  Listar todas las tareas de un proyecto específico.
router.get('/projects/:projectId/tasks', validarJWT, getTasksByProject); // Puedes añadir `validateProjectMember`

//  Obtener los detalles de una tarea específica por su ID.
router.get('/tasks/:id', validarJWT, getTaskById);

// Actualizar los detalles generales de una tarea por su ID.
router.put('/tasks/:id', validarJWT, updateTask); // Esta es para actualización general de tarea

//  Cambiar el estado de una tarea específica.
router.put('/tasks/:id/status', validarJWT, updateTaskStatus);

//  Asignar una tarea a un usuario.
router.put('/tasks/:id/assign', validarJWT, validateAdmiRole, assignTask); // Puedes cambiar `validateAdmiRole` por `validateProjectManager`

//  Eliminar una tarea por su ID.
router.delete('/tasks/:id', validarJWT, validateAdmiRole, deleteTask); // Puedes cambiar `validateAdmiRole`

//  Listar tareas asignadas al usuario autenticado.
router.get('/tasks/my-tasks', validarJWT, getMyTasks);

// (Ruta setDependencies no está en la lista final que pediste, pero la dejo comentada si la necesitas)
// router.put('/tasks/:taskId/dependencies', validarJWT, validateAdmiRole, setDependencies);

export default router;