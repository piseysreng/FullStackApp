import React, { useState } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import CryptoJS from 'crypto-js';
import { Model } from '@/src/types/abaType';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

// --- PAYWAY CONFIG ---
const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
// const MERCHANT_ID = 'ec000262'; // <--- Change this
const MERCHANT_ID = 'ec463658'; // <--- Change this
// const API_KEY = '308f1c5f450ff6d971bf8a805b4d18a6ef142464';         // <--- Change this
const API_KEY = 'caf065bfd0b7bd65f1e1614eb36884ffa92d0525';         // <--- Change this

export default function App() {
    const [paymentHtml, setPaymentHtml] = useState<WebViewSource | null>(null);
    const [loading, setLoading] = useState(false);

    const generateHash = (dataString: string, apiKey: string) => {
        const hmac = CryptoJS.HmacSHA512(dataString, apiKey);
        return CryptoJS.enc.Base64.stringify(hmac);
    };

    const startPayment = () => {
        setLoading(true);


        const uniqueTranId = "T" + Date.now();
        const now = new Date();
        const req_time = now.getFullYear().toString() +
            (now.getMonth() + 1).toString().padStart(2, '0') +
            now.getDate().toString().padStart(2, '0') +
            now.getHours().toString().padStart(2, '0') +
            now.getMinutes().toString().padStart(2, '0') +
            now.getSeconds().toString().padStart(2, '0');


        // 1. Prepare Transaction Data
        const paymentData: Model = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id: uniqueTranId,
            amount: 100,
            items: "",
            shipping: 0,
            firstname: "John",
            lastname: "Doe",
            email: "test@example.com",
            phone: "012345678",
            type: "purchase",
            payment_option: "cards",
            return_url: "",
            cancel_url: "",
            continue_success_url: "",
            return_deeplink: "",
            currency: "USD",
            custom_fields: "",
            return_params: "",
            payout: "",
            lifetime: 0,
            additional_params: "",
            google_pay_token: "",
            skip_success_page: 0,
            view_type: "hosted_view"
        };

        // 2. Construct the Hash Chain (EXACT ORDER IS REQUIRED)
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

        // Convert paymentData + hash into a URL-encoded string
        const bodyParams = { ...paymentData, hash };
        const formBody = Object.keys(bodyParams)
            .map(key => {
                const value = bodyParams[key as keyof typeof bodyParams];
                return encodeURIComponent(key) + '=' + encodeURIComponent(value !== null && value !== undefined ? value.toString() : "");
            })
            .join('&');

        // 5. Set the WebView Source
        setPaymentHtml({
            uri: API_URL,
            method: 'POST',
            body: formBody, // Use the string, not the FormData object
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        setLoading(false);
    };

    if (paymentHtml) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <WebView
                    source={paymentHtml}
                    onNavigationStateChange={(navState) => {
                        console.log("Current URL:", navState.url);
                        // Close WebView if return_url or cancel_url is reached
                        if (navState.url.includes('yourdomain.com/success') || navState.url.includes('yourdomain.com/cancel')) {
                            setPaymentHtml(null);
                            alert("Transaction finished or cancelled.");
                        }
                    }}
                />
                <Button title="Close Payment" onPress={() => setPaymentHtml(null)} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Pay $1.00 with Alipay" onPress={startPayment} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    safeArea: { flex: 1, backgroundColor: '#fff' }
});