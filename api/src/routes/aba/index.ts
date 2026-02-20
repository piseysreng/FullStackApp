import { Router } from 'express';
import express from 'express'
import { createPayment, generateABAHash } from './abaController.js';
import crypto from 'crypto';


// Function to generate ABA Hash
function createAbaHash(data : any) {
    const apiKey = process.env.ABA_API_KEY!;
    
    // ABA requires a specific string concatenation order:
    // req_time + merchant_id + tran_id + amount + items + shipping + ... (follow ABA docs)
    const rawStr = data.req_time + data.merchant_id + data.tran_id + data.amount + 
                   data.items + data.shipping + data.currency + data.type + 
                   data.payment_option + data.return_url + data.cancel_url;

    return crypto.createHmac('sha512', apiKey).update(rawStr).digest('base64');
}

const router = Router();

router.post('/api/create-aba-payment', (req, res) => {
    const paymentData = {
        ...req.body,
        req_time: new Date().getTime().toString(), // Must be string
        merchant_id: 'ec463658',
    };

    paymentData.hash = createAbaHash(paymentData);
    
    // You can either fetch ABA from here or send the hash back to Expo
    res.json(paymentData);
});


// router.get('/', (req, res) => {res.send('ABA Gateway');});
// router.post('/generateabahash', generateABAHash);
// router.post('/payment', createPayment);

export default router;