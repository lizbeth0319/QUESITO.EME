import { Router } from "express";
import * as UserController from "../controllers/user.js";

const router = Router();

router.get('/api/users', UserController.getUsers);
router.get('/api/users/profile', UserController.getUserProfile);
router.put('/api/users/profile', UserController.updateUserProfile);
router.put('/api/users/:id/role', UserController.updateUserRole);
router.post('/api/users/create', UserController.createUser);
router.delete('/api/users/:id', UserController.deleteUser);

export default router;
