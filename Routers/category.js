import { Router } from "express";
import * as CategoryController from "../controllers/category.js";

const router = Router();

router.get('/api/categories', CategoryController.getCategories);
router.post('/api/categories', CategoryController.createCategory);
router.put('/api/categories/:id', CategoryController.updateCategory);
router.delete('/api/categories/:id', CategoryController.deleteCategory);

export default router;
