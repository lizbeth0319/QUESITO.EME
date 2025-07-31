import { Router } from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    addProjectMember,
    updateProject,
    updateProjectStatus,
    deleteProject,
    removeProjectMember,
} from "../controllers/Project.js";

import { validarJWT } from "../middlewares/validar-jwt.js";            
import { validateAdmiRole } from "../middlewares/validar-roles.js";   
import { validateProjectRole } from "../middlewares/validar-roles.js"; 

const router = Router();

// --- Rutas de Proyectos ---

// Listar todos los proyectos activos.
router.get('/projects', validarJWT, getProjects); 

// Objetivo: Obtener los detalles de un proyecto específico por su ID.
router.get('/projects/:id', validarJWT, getProjectById);

//  Crear un nuevo proyecto.
router.post('/projects', validarJWT, validateAdmiRole, createProject); 

//  Añadir un miembro a un proyecto específico.
router.post('/projects/:id/members', validarJWT, validateAdmiRole, addProjectMember); 

//  Actualizar los detalles de un proyecto existente por su ID.
router.put('/projects/:id', validarJWT, validateAdmiRole, updateProject); 

//  Actualizar el estado de un proyecto específico.
router.put('/projects/:id/status', validarJWT, validateAdmiRole, updateProjectStatus); 

// Eliminar un proyecto por su ID.
router.delete('/projects/:id', validarJWT, validateAdmiRole, deleteProject);

//  Eliminar un miembro de un proyecto específico.
router.delete('/projects/:id/members/:userId', validarJWT, validateAdmiRole, removeProjectMember); 

export default router;