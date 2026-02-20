import { Request, Response } from "express";
import { db } from '../../db/index.js';
import crypto from 'crypto';

export async function generateABAHash(req: Request, res: Response) {
    try {

        // 1. Generate Current UTC Time in YYYYMMDDHHmmss
        const now = new Date();
        const req_time = now.getUTCFullYear().toString() +
            (now.getUTCMonth() + 1).toString().padStart(2, '0') +
            now.getUTCDate().toString().padStart(2, '0') +
            now.getUTCHours().toString().padStart(2, '0') +
            now.getUTCMinutes().toString().padStart(2, '0') +
            now.getUTCSeconds().toString().padStart(2, '0');

        console.log(req_time);

        const data = req.body;
        const apiKey = process.env.ABA_API_KEY!;

        // 1. Replicate the concatenation order exactly as the PHP sample
        const b4hash =
            req_time +
            data.merchant_id +
            data.tran_id +
            data.amount +
            data.items +
            data.shipping +
            data.firstname +
            data.lastname +
            data.email +
            data.phone +
            data.type +
            data.payment_option +
            data.return_url +
            data.cancel_url +
            data.continue_success_url +
            data.return_deeplink +
            data.currency +
            data.custom_fields +
            data.return_params +
            data.payout +
            data.lifetime +
            data.additional_params +
            data.google_pay_token +
            data.skip_success_page;

        // 2. Generate HMAC SHA-512 and encode to Base64
        const generatedHash = crypto
            .createHmac('sha512', apiKey)
            .update(b4hash)
            .digest('base64');

        // 3. SEND THE RESULT, NOT THE MODULE
        return res.json({
            success: true,
            hash: generatedHash
        });
    } catch (error) {
        console.error('Error with GerenateHashedKey ', error)
        return res.status(400).send('Error with GeneratedHashedKey')
    }


}


export async function createPayment(req: Request, res: Response) {
    try {

        // 1. Generate Current UTC Time in YYYYMMDDHHmmss
        const now = new Date();
        const req_time = now.getUTCFullYear().toString() +
            (now.getUTCMonth() + 1).toString().padStart(2, '0') +
            now.getUTCDate().toString().padStart(2, '0') +
            now.getUTCHours().toString().padStart(2, '0') +
            now.getUTCMinutes().toString().padStart(2, '0') +
            now.getUTCSeconds().toString().padStart(2, '0');

        console.log(req_time);

        const data = req.body;
        const apiKey = process.env.ABA_API_KEY!;

        // 1. Replicate the concatenation order exactly as the PHP sample
        const b4hash =
            req_time +
            data.merchant_id +
            data.tran_id +
            data.amount +
            data.items +
            data.shipping +
            data.firstname +
            data.lastname +
            data.email +
            data.phone +
            data.type +
            data.payment_option +
            data.return_url +
            data.cancel_url +
            data.continue_success_url +
            data.return_deeplink +
            data.currency +
            data.custom_fields +
            data.return_params +
            data.payout +
            data.lifetime +
            data.additional_params +
            data.google_pay_token +
            data.skip_success_page;

        // 2. Generate HMAC SHA-512 and encode to Base64
        const generatedHash = crypto
            .createHmac('sha512', apiKey)
            .update(b4hash)
            .digest('base64');

        // 3. SEND THE RESULT, NOT THE MODULE
        return res.json({
            success: true,
            hash: generatedHash
        });
    } catch (error) {
        console.error('Error with GerenateHashedKey ', error)
        return res.status(400).send('Error with GeneratedHashedKey')
    }


}