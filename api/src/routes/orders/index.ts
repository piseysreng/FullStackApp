import { Router } from "express";
import { validateData } from "../../middlewares/validationMiddleware.js";


const router = Router();

router.get('/', (req, res) => { res.send('Order Router') });

// router.get('/',verifyToken, listOrders);
// router.get('/:id',verifyToken, getOrder);
// router.put('/:id',verifyToken, validateData(updateOrderSchema), updateOrder);
// router.post('/' , validateData(insertOrderWithItemsSchema) ,createOrder);

export default router;