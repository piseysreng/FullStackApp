import { Router } from "express";
import { handleCheckPaymentStatus, handlePaymentSuccessRedirect, handlePayWayWebhook, paymentCreditCard, paymentKHQrcode } from "./paymentController.js";
import multer from 'multer';
const upload = multer();

const router = Router();

router.get('/', (req, res) => { res.send('Payment Router') });
router.post('/aba/qrcode',paymentKHQrcode);
router.post('/aba/card',paymentCreditCard);
router.get('/aba/success',handlePaymentSuccessRedirect);
// router.post('/aba/webhook',upload.none(),handlePayWayWebhook);
router.post('/aba/check-status/:orderNumber', handleCheckPaymentStatus);

export default router;