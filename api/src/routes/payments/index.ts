import { Router } from "express";
import { paymentCreditCard, paymentKHQrcode } from "./paymentController.js";

const router = Router();

router.get('/', (req, res) => { res.send('Payment Router') });
router.post('/aba/qrcode',paymentKHQrcode);
router.post('/aba/card',paymentCreditCard);

export default router;