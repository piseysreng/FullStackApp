import { Router } from 'express';
import {createProduct, deleteProduct, getProductById, listProducts, updateProduct } from './productController.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { CreateProductSchema, UpdateProductSchema } from './../../schema/schema.js';


const router = Router();
router.get('/', listProducts);
router.get('/:id',getProductById);
router.post('/',validateData(CreateProductSchema),createProduct);
router.put('/:id',validateData(UpdateProductSchema),updateProduct);
router.delete('/:id',deleteProduct);

export default router;