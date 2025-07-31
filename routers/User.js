import { Router } from "express";
import {
    getUsers,           // Controlador para obtener todos los usuarios
    getUserProfile,     // Controlador para obtener el perfil del usuario autenticado
    updateUserProfile,  // Controlador para actualizar el perfil del usuario autenticado
    deleteUser,         // Controlador para eliminar un usuario por su ID
    updateUserRole      // Controlador para cambiar el rol de un usuario por su ID
} from "../controllers/User.js"; // Asegúrate de que esta ruta a tu controlador sea correcta

import { validarJWT } from "../middlewares/validar-jwt.js";        // Middleware para validar el token JWT
import { validateAdmiRole } from "../middlewares/validar-roles.js"; // Middleware para validar el rol de Administrador

const router = Router();

// Listar todos los usuarios.
router.get('/users', validarJWT, validateAdmiRole, getUsers);

//  Obtener el perfil del usuario actualmente autenticado (el que envió el JWT).

router.get('/users/profile', validarJWT, getUserProfile);

// Actualizar el perfil del usuario actualmente autenticado..
router.put('/users/profile', validarJWT, updateUserProfile);


// Eliminar un usuario específico por su ID.
router.delete('/users/:id', validarJWT, validateAdmiRole, deleteUser);

//  Cambiar el rol de un usuario específico por su ID..
router.put('/users/:id/role', validarJWT, validateAdmiRole, updateUserRole);

export default router;