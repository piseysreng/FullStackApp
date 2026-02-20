import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity, 
    Linking, 
    Alert, 
    SafeAreaView 
} from 'react-native';
import CryptoJS from 'crypto-js';
import QRCode from 'react-native-qrcode-svg';

// Configuration
const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
const MERCHANT_ID = 'ec000262';
const API_KEY = '308f1c5f450ff6d971bf8a805b4d18a6ef142464';

// High-quality Base64 USD Icon (Circular Blue Background)
const USD_BASE64_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAABy0lEQVR4nO3dy0pCURSG4X9G0SBE0SBEo0Y9S6Meo0Y9S6Meo0Y9S6Meo0Y9S6Meo6pBUIuC6vY6YI6ZNo77O+v7YIisXvOatVfBy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/v7/sLp7UHzG2XmO0AAAAASUVORK5CYII=';
// Note: Using a standard placeholder above. For a real icon, you can use any 64x64 PNG converted to Base64.

export default function KHQRPaymentUSD() {
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<{ qrString: string; deeplink: string } | null>(null);

    const generateHash = (dataString: string, apiKey: string) => {
        return CryptoJS.HmacSHA512(dataString, apiKey).toString(CryptoJS.enc.Base64);
    };

    const startKHQRPayment = async () => {
        setLoading(true);
        
        const tran_id = "T-" + Date.now();
        const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const amount = "1.00"; 

        const paymentData = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id,
            amount,
            items: "",
            shipping: "0",
            firstname: "John",
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

        const formData = new URLSearchParams();
        Object.entries({ ...paymentData, hash }).forEach(([key, val]) => {
            formData.append(key, val.toString());
        });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });

            const result = await response.json();

            if (result.status && (result.status.code === "00" || result.status === 0)) {
                setQrData({
                    qrString: result.qrString,
                    deeplink: result.abapay_deeplink
                });
            } else {
                Alert.alert("Payment Error", result.description || "API Error");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to PayWay API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#005a9c" />}

            {!qrData && !loading && (
                <TouchableOpacity style={styles.payButton} onPress={startKHQRPayment}>
                    <Text style={styles.buttonText}>Generate USD KHQR</Text>
                </TouchableOpacity>
            )}

            {qrData && (
                <View style={styles.qrContainer}>
                    <Text style={styles.title}>Scan to Pay $1.00</Text>
                    
                    <View style={styles.qrWrapper}>
                        <QRCode 
                            value={qrData.qrString}
                            size={260}
                            // Using Base64 ensures the logo loads instantly
                            logo={{ uri: USD_BASE64_LOGO }}
                            logoSize={50}
                            logoBackgroundColor="white"
                            logoBorderRadius={25}
                            logoMargin={2}
                            // ECL 'H' is required when placing a logo in the center
                            ecl="H" 
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.abaButton} 
                        onPress={() => Linking.openURL(qrData.deeplink)}
                    >
                        <Text style={styles.buttonText}>Open ABA Mobile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setQrData(null)} style={{ marginTop: 20 }}>
                        <Text style={{ color: 'red' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    qrContainer: { alignItems: 'center', padding: 20 },
    qrWrapper: { 
        padding: 15, 
        backgroundColor: 'white', 
        borderRadius: 20,
        // Add styling to make it look like a real KHQR stand
        borderWidth: 1,
        borderColor: '#ddd'
    },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, color: '#005a9c' },
    payButton: { backgroundColor: '#005a9c', paddingVertical: 18, paddingHorizontal: 60, borderRadius: 15 },
    buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
    abaButton: { backgroundColor: '#005a9c', paddingVertical: 16, borderRadius: 12, marginTop: 40, width: 280, alignItems: 'center' },
});