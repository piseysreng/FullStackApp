import { Router } from 'express';
import { listProducts } from './productController.js';

const router = Router();
router.get('/', listProducts);

export default router;