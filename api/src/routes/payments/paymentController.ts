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

        const abaStatus = response.data.status;
        const statusCode = abaStatus?.code;

        // 🟢 STEP 1: Check if the API call was successful
        // Use '==' to allow both string "0"/"00" and number 0
        if (statusCode == "0" || statusCode == "00") {

            // 🟢 STEP 2: Check if QR Data actually exists
            if (response.data.qrString) {
                return res.status(200).json({
                    success: true,
                    qrString: response.data.qrString,
                    deeplink: response.data.abapay_deeplink,
                    orderNumber: order.orderNumber
                });
            } else {
                // This is where "Method Disabled" actually happens: 
                // The API worked, but didn't return a QR code for your specific Merchant ID.
                return res.status(200).json({
                    success: false,
                    error_type: "METHOD_DISABLED",
                    message: "KHQR is not enabled for this account."
                });
            }
        }

        // 🔴 STEP 3: Handle Actual Bank Errors
        console.error("❌ ABA API Error:", abaStatus?.message);
        return res.status(200).json({
            success: false,
            error_type: "BANK_ERROR",
            message: abaStatus?.message || "We can process with KHQRCode now, please help choose another methods"
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


export async function paymentAlipay(req: Request, res: Response) {
    const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
    const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
    const API_KEY = process.env.ABA_API_KEY;

    if (!MERCHANT_ID || !API_KEY) {
        return res.status(500).json({ error: "Server configuration missing: ABA Keys not found." });
    }

    const { orderNumber } = req.body;
    if (!orderNumber) {
        return res.status(400).json({ error: "Order Number is required." });
    }

    try {
        // 1. Fetch real order data
        const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.orderNumber, String(orderNumber)));

        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        // 2. Prepare Data (Matching your initial logic + KHQR structure)
        const tran_id = order.orderNumber.substring(0, 20);
        const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const amount = order.totalAmount;

        const rawWebhookUrl = "https://sthenic-inferably-ashlee.ngrok-free.dev/payment/aba/webhook";

        const paymentData = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id,
            amount,
            items: Buffer.from(JSON.stringify([])).toString('base64'),
            shipping: "0",
            firstname: "John",
            lastname: "Doe",
            email: "test@example.com",
            phone: "012345678",
            type: "purchase",
            payment_option: "alipay", // Back to your original choice
            return_url: Buffer.from(rawWebhookUrl).toString('base64'),
            cancel_url: "",
            continue_success_url: "",
            return_deeplink: "",
            currency: "USD",
            custom_fields: "",
            return_params: "",
            payout: "",
            lifetime: "45",
            additional_params: "",
            google_pay_token: "",
            skip_success_page: "0",
            view_type: "hosted_view"
        };

        // 3. Strict Concatenation for Hash
        const b4hash: string =
            paymentData.req_time + paymentData.merchant_id + paymentData.tran_id +
            paymentData.amount + paymentData.items + paymentData.shipping +
            paymentData.firstname + paymentData.lastname + paymentData.email +
            paymentData.phone + paymentData.type + paymentData.payment_option +
            paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url +
            paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields +
            paymentData.return_params + paymentData.payout + paymentData.lifetime +
            paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

        const hash = CryptoJS.HmacSHA512(b4hash, API_KEY).toString(CryptoJS.enc.Base64);

        // 4. API CALL
        const formData = new URLSearchParams({ ...paymentData, hash });

        const response = await axios.post(API_URL, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const abaStatus = response.data.status;

        // 5. Handle Response (Alipay Hosted View)
        if (abaStatus?.code == "0" || abaStatus?.code == "00") {
            // For Alipay Hosted View, Payway usually returns a payment_url
            // Or if you are using mobile, it might provide a QR/Deeplink
            return res.status(200).json({
                success: true,
                payment_url: response.data.payment_url,
                orderNumber: order.orderNumber
            });
        }

        return res.status(200).json({
            success: false,
            error_type: "BANK_ERROR",
            message: abaStatus?.message || "Alipay method currently unavailable."
        });

    } catch (error: any) {
        console.error("Alipay Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error." });
    }
}



export async function paymentCreditCard(req: Request, res: Response) {
    const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
    const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
    const API_KEY = process.env.ABA_API_KEY;
    const generateHash = (dataString: string, apiKey: string) => {
        const hmac = CryptoJS.HmacSHA512(dataString, apiKey);
        return CryptoJS.enc.Base64.stringify(hmac);
    };

    if (!MERCHANT_ID || !API_KEY) {
        return res.status(500).json({ error: "Server configuration missing: ABA Keys not found." });
    }
    const { tran_id } = req.body;
    if (!tran_id) {
        return res.status(400).json({ error: "Order ID is required." });
    }
    try {
        const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.orderNumber, String(tran_id)));
        if (!order) {
            return res.status(404).json({ error: "Order not found in database." });
        }
        const amount: string = order.totalAmount;

        ///
        const pad = (n: number) => (n < 10 ? `0${n}` : n);
        const now = new Date();
        const req_time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

        const DOMAIN = process.env.API_DOMAIN;
        const APP_SCHEME = "mobile";
        const continue_success_url = Buffer.from(`${APP_SCHEME}://success`).toString('base64');
        const cancel_url = Buffer.from(`${APP_SCHEME}://cancel`).toString('base64');
        const rawUrl = "https://sthenic-inferably-ashlee.ngrok-free.dev/payment/aba/webhook";

        const paymentData = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id,
            amount, // Number as per your interface
            items: Buffer.from(JSON.stringify([])).toString('base64'),
            shipping: 0,
            firstname: "John",
            lastname: "Doe",
            email: "test@example.com",
            phone: "012345678",
            type: "purchase",
            payment_option: "alipay",
            // return_url: Buffer.from(`${DOMAIN}/payment/aba/webhook`).toString('base64'),
            return_url: Buffer.from(rawUrl).toString('base64'),
            cancel_url,
            continue_success_url,
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

        const b4hash =
            paymentData.req_time + paymentData.merchant_id + paymentData.tran_id +
            paymentData.amount + paymentData.items + paymentData.shipping +
            paymentData.firstname + paymentData.lastname + paymentData.email +
            paymentData.phone + paymentData.type + paymentData.payment_option +
            paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url +
            paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields +
            paymentData.return_params + paymentData.payout + paymentData.lifetime +
            paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

        const hash = generateHash(b4hash, API_KEY);
        res.json({
            ...paymentData,
            hash,
            payment_url: API_URL
        });
    } catch (error: any) {
        console.error("Error details:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error during payment generation." });
    }
}

// export async function paymentCreditCard(req: Request, res: Response) {
//     // --- PAYWAY CONFIG ---
//     const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
//     const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
//     const API_KEY = process.env.ABA_API_KEY;

//     if (!MERCHANT_ID || !API_KEY) {
//         return res.status(500).json({ error: "Server configuration missing: ABA Keys not found." });
//     }

//     const pad = (n: number) => (n < 10 ? `0${n}` : n);
//     const now = new Date();
//     const req_time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

//     // According to your Interface: A unique transaction identifier
//     const tran_id = "T" + Date.now();

//     const DOMAIN = process.env.API_DOMAIN;
//     const APP_SCHEME = "mobile";

//     const continue_success_url = Buffer.from(`${APP_SCHEME}://success`).toString('base64');
//     const cancel_url = Buffer.from(`${APP_SCHEME}://cancel`).toString('base64');
//     const rawUrl = "https://sthenic-inferably-ashlee.ngrok-free.dev/payment/aba/webhook";

//     const paymentData: Model = {
//         req_time,
//         merchant_id: MERCHANT_ID,
//         tran_id,
//         amount: 100.00, // Number as per your interface
//         items: Buffer.from(JSON.stringify([])).toString('base64'),
//         shipping: 0,
//         firstname: "John",
//         lastname: "Doe",
//         email: "test@example.com",
//         phone: "012345678",
//         type: "purchase",
//         payment_option: "alipay",
//         // return_url: Buffer.from(`${DOMAIN}/payment/aba/webhook`).toString('base64'),
//         return_url: Buffer.from(rawUrl).toString('base64'),
//         cancel_url,
//         continue_success_url,
//         return_deeplink: "",
//         currency: "USD",
//         custom_fields: "",
//         return_params: "",
//         payout: "",
//         lifetime: 45, // Minutes
//         additional_params: "",
//         google_pay_token: "",
//         skip_success_page: 0,
//         view_type: "hosted_view"
//     };

//     // 3. Strict Concatenation for Hash
//     const b4hash: string =
//         paymentData.req_time + paymentData.merchant_id + paymentData.tran_id +
//         paymentData.amount + paymentData.items + paymentData.shipping +
//         paymentData.firstname + paymentData.lastname + paymentData.email +
//         paymentData.phone + paymentData.type + paymentData.payment_option +
//         paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url +
//         paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields +
//         paymentData.return_params + paymentData.payout + paymentData.lifetime +
//         paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

//     const hash = CryptoJS.HmacSHA512(b4hash, API_KEY).toString(CryptoJS.enc.Base64);
//     try {
//         // 3. API CALL (Every value in the spread is now a string, resolving the TS error)
//         const formData = new URLSearchParams({ ...paymentData, hash });

//         const response = await axios.post(API_URL, formData.toString(), {
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         });

//         const abaStatus = response.data.status;

//         if (abaStatus?.code == "0" || abaStatus?.code == "00") {
//             return res.status(200).json({
//                 success: true,
//                 payment_url: response.data.payment_url,
//                 tran_id: paymentData.tran_id
//             });
//         }

//         return res.status(400).json({
//             success: false,
//             message: abaStatus?.message || "Payment initiation failed."
//         });
//     } catch (error: any) {
//         console.error("Alipay Error:", error.response?.data || error.message);
//         return res.status(500).json({ error: "Internal server error." });
//     }



//     // // THE STRICT HASH CHAIN ORDER FROM YOUR INTERFACE
//     // const hashChain = [
//     //     'req_time', 'merchant_id', 'tran_id', 'amount', 'items', 'shipping',
//     //     'firstname', 'lastname', 'email', 'phone', 'type', 'payment_option',
//     //     'return_url', 'cancel_url', 'continue_success_url', 'return_deeplink',
//     //     'currency', 'custom_fields', 'return_params', 'payout', 'lifetime',
//     //     'additional_params', 'google_pay_token', 'skip_success_page'
//     // ];

//     // const b4hash = hashChain.map(key => {
//     //     const val = paymentData[key];
//     //     return (val !== undefined && val !== null) ? val.toString() : "";
//     // }).join("");

//     // const hash = crypto
//     //     .createHmac('sha512', API_KEY)
//     //     .update(b4hash)
//     //     .digest('base64');

//     // res.json({
//     //     url: API_URL,
//     //     params: { ...paymentData, hash }
//     // });
// }

export async function handlePaymentSuccessRedirect(req: Request, res: Response) {
    const { tran_id } = req.query;

    // Here, you don't update the DB yet (wait for Webhook), 
    // just show a nice "Payment Received" message for the WebView to catch.
    res.send(`
        <html>
            <body style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
                <div style="text-align:center;">
                    <h1>Payment Success!</h1>
                    <p>Transaction: ${tran_id}</p>
                    <p>You can close this window now.</p>
                </div>
            </body>
        </html>
    `);
}

export async function handlePayWayWebhook(req: Request, res: Response) {
    // 1. Immediately log that something hit this URL
    console.log("------------------------------------------");
    console.log("🔔 [ABA WEBHOOK] I WAS HIT!");
    console.log("TIME:", new Date().toISOString());

    // This will show you exactly what ABA sends (tran_id, status, etc.)
    console.log("RECEIVED DATA:", req.body);
    console.log("------------------------------------------");

    // ABA expects a response to stop trying to send this specific notification
    res.status(200).send('OK');
}

export async function handleCheckPaymentStatus(req: Request, res: Response) {
    try {
        const { orderNumber } = req.params;

        const CHECK_API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction';
        const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
        const API_KEY = process.env.ABA_API_KEY;

        if (!MERCHANT_ID || !API_KEY) {
            return res.status(500).json({ success: false, message: "ABA configuration missing on server." });
        }

        // 2. Generate req_time (YYYYMMDDHHMMSS)
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const req_time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

        // 3. Create Hash for Check Transaction
        // String format: req_time + merchant_id + tran_id
        const dataString = req_time + MERCHANT_ID + orderNumber;
        const hash = CryptoJS.HmacSHA512(dataString, API_KEY).toString(CryptoJS.enc.Base64);

        // 4. Call ABA PayWay Check Transaction API
        const formData = new URLSearchParams();
        formData.append('req_time', req_time);
        formData.append('merchant_id', MERCHANT_ID);
        formData.append('tran_id', orderNumber);
        formData.append('hash', hash);

        const response = await axios.post(CHECK_API_URL, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const abaData = response.data;

        /**
         * ABA Status Codes for Check Transaction:
         * 0  - Success (The transaction is completed and paid)
         * 1  - Approved (Transaction approved but maybe not finalized)
         * 2  - Pending (User hasn't paid yet)
         * 3  - Declined
         * 4  - Refunded/Voided
         * 5  - Cancelled
         */

        if (abaData.status === 0 || abaData.status === "0") {
            // SUCCESS: Payment is verified
            // This is where you would normally update your DB:
            await db.update(ordersTable).set({ status: 'PAID' }).where(eq(ordersTable.orderNumber, orderNumber));

            return res.json({
                success: true,
                orderNumber,
                status: 'PAID',
                message: 'Payment was successful!'
            });
        } else if (abaData.status === 2 || abaData.status === "2") {
            // PENDING: User still looking at the QR or typing card details
            return res.json({
                success: true,
                orderNumber,
                status: 'PENDING',
                message: 'Waiting for customer payment...'
            });
        } else {
            // FAILED or CANCELLED
            return res.json({
                success: false,
                orderNumber,
                status: 'FAILED',
                message: abaData.description || 'Transaction failed or was cancelled.'
            });
        }

    } catch (error) {
        console.error('Status Check Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

