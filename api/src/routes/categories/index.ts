import { Router } from 'express';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createCategory, deleteCategory, getCatetoryById, listCategories, updateCategory } from './categoriesController.js';
import { CreateCategorySchema, UpdateCategorySchema } from './../../schema/schema.js';

const router = Router();
router.get('/', listCategories);
router.get('/:id',getCatetoryById);
router.post('/',validateData(CreateCategorySchema),createCategory);
router.put('/:id',validateData(UpdateCategorySchema),updateCategory);
router.delete('/:id',deleteCategory);

export default router;