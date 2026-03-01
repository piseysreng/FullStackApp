import { Request, Response } from "express";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { ordersTable } from "../../../src/db/oldSchema.js";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import crypto from 'crypto';

export async function paymentKHQrcode(req: Request, res: Response) {
    const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
    const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
    const API_KEY = process.env.ABA_API_KEY;

    if (!MERCHANT_ID || !API_KEY) {
        return res.status(500).json({ error: "Server configuration missing: ABA Keys not found." });
    }

    // Capture orderId from body
    const { orderNumber } = req.body;
    if (!orderNumber) {
        return res.status(400).json({ error: "Order ID is required." });
    }

    try {
        // 1. Fetch the order from the DB
        // We use orderNumber because your frontend passes the TRN string or the ID
        // Note: ensure orderId is cast to string to match orderNumber schema
        const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.orderNumber, String(orderNumber)));

        if (!order) {
            return res.status(404).json({ error: "Order not found in database." });
        }

        // 2. Use real data from the database order
        // Use the existing orderNumber as the tran_id (max 20 chars)
        const tran_id: string = order.orderNumber.substring(0, 20);
        const req_time: string = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const amount: string = order.totalAmount; // Use DB amount, not hardcoded "1.50"

        const paymentData = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id,
            amount,
            items: "", // Usually Base64 encoded items if required by ABA
            shipping: "0",
            firstname: "John", // Consider saving user info in ordersTable to use here
            lastname: "Doe",
            email: "test@example.com",
            phone: "012345678",
            type: "purchase",
            payment_option: "abapay_khqr",
            return_url: "",
            cancel_url: "",
            continue_success_url: "",
            return_deeplink: "",
            currency: "USD",
            custom_fields: "",
            return_params: "",
            payout: "",
            lifetime: "0",
            additional_params: "",
            google_pay_token: "",
            skip_success_page: "0",
            view_type: "hosted_view"
        };

        // Helper: Generate ABA Hash
        const generateHash = (dataString: string, apiKey: string) => {
            return CryptoJS.HmacSHA512(dataString, apiKey).toString(CryptoJS.enc.Base64);
        };

        // --- 3. Strict Concatenation for Hash ---
        const b4hash: string =
            paymentData.req_time + paymentData.merchant_id + paymentData.tran_id +
            paymentData.amount + paymentData.items + paymentData.shipping +
            paymentData.firstname + paymentData.lastname + paymentData.email +
            paymentData.phone + paymentData.type + paymentData.payment_option +
            paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url +
            paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields +
            paymentData.return_params + paymentData.payout + paymentData.lifetime +
            paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

        const hash = generateHash(b4hash, API_KEY);

        // --- 4. API CALL ---
        const formData = new URLSearchParams({ ...paymentData, hash });

        const response = await axios.post(API_URL, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Output to console for easy debugging
        console.log("ABA Response Status:", response.data.status);

        res.status(200).json({
            success: true,
            status: response.data.status,
            qrString: response.data.qrString,
            deeplink: response.data.abapay_deeplink
        });

    } catch (error: any) {
        console.error("Error details:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error during payment generation." });
    }
}

export interface Model {
    amount: number;
    merchant_id: string;
    tran_id: string;
    req_time: string;
    // hash: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    type?: string;
    payment_option?: string;
    currency?: string;
    shipping?: number;
    items?: string;
    return_url?: string;
    cancel_url?: string;
    continue_success_url?: string;
    return_deeplink?: string;
    custom_fields?: string;
    return_params?: string;
    payout?: string;
    lifetime?: number;
    additional_params?: string;
    google_pay_token?: string;
    skip_success_page?: number;
    view_type?: string;
    [property: string]: any;
}

export async function paymentCreditCard(req: Request, res: Response) {
    // --- PAYWAY CONFIG ---
    const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
    const MERCHANT_ID = 'ec463658';
    const API_KEY = 'caf065bfd0b7bd65f1e1614eb36884ffa92d0525';

    const pad = (n:number) => (n < 10 ? `0${n}` : n);
    const now = new Date();
    const req_time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    // According to your Interface: A unique transaction identifier
    const tran_id = "T" + Date.now();

    const paymentData : Model= {
        req_time,
        merchant_id: MERCHANT_ID,
        tran_id,
        amount: 100.00, // Number as per your interface
        items: Buffer.from(JSON.stringify([])).toString('base64'),
        shipping: 0,
        firstname: "John",
        lastname: "Doe",
        email: "test@example.com",
        phone: "012345678",
        type: "purchase",
        payment_option: "cards",
        return_url: Buffer.from("https://yourdomain.com/success").toString('base64'),
        cancel_url: Buffer.from("https://yourdomain.com/cancel").toString('base64'),
        continue_success_url: "",
        return_deeplink: "",
        currency: "USD",
        custom_fields: "",
        return_params: "",
        payout: "",
        lifetime: 45, // Minutes
        additional_params: "",
        google_pay_token: "",
        skip_success_page: 0,
        view_type: "hosted_view"
    };

    // THE STRICT HASH CHAIN ORDER FROM YOUR INTERFACE
    const hashChain = [
        'req_time', 'merchant_id', 'tran_id', 'amount', 'items', 'shipping',
        'firstname', 'lastname', 'email', 'phone', 'type', 'payment_option',
        'return_url', 'cancel_url', 'continue_success_url', 'return_deeplink',
        'currency', 'custom_fields', 'return_params', 'payout', 'lifetime',
        'additional_params', 'google_pay_token', 'skip_success_page'
    ];

    const b4hash = hashChain.map(key => {
        const val = paymentData[key];
        return (val !== undefined && val !== null) ? val.toString() : "";
    }).join("");

    const hash = crypto
        .createHmac('sha512', API_KEY)
        .update(b4hash)
        .digest('base64');

    res.json({
        url: API_URL,
        params: { ...paymentData, hash }
    });
}