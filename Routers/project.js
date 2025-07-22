import { Router } from "express";
import * as ProjectController from "../controllers/projectController.js";

const router = Router();

router.get('/api/projects', ProjectController.getProjects);
router.get('/api/projects/:id', ProjectController.getProjectById);
router.post('/api/projects', ProjectController.createProject);
router.post('/api/projects/:id/members', ProjectController.addProjectMember);
router.put('/api/projects/:id', ProjectController.updateProject);
router.put('/api/projects/:id/status', ProjectController.updateProjectStatus);
router.delete('/api/projects/:id', ProjectController.deleteProject);
router.delete('/api/projects/:id/members/:userId', ProjectController.removeProjectMember);

export default router;
