import { Router } from "express";
import  AuthenticationController from "../controllers/authentication.js"



const router = Router();

//registrar usuario
router.post('/api/auth/register',AuthenticationController.createAuthentication)

//incio de sesion 
router.post('/api/auth/login',AuthenticationController.Login)
/* router.post('/api/auth/refresh')
router.post('/api/auth/logout')
router.post('/api/auth/forgot-password')
router.post('/api/auth/reset-password') */

export default router;


