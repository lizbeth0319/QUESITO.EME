import { Router } from "express";
import * as RoleController from "../controllers/role.js";

const router = Router();

router.get('/api/roles', RoleController.getRoles);
router.post('/api/roles', RoleController.createRole);
router.put('/api/roles/:id', RoleController.updateRole);
router.delete('/api/roles/:id', RoleController.deleteRole);

export default router;