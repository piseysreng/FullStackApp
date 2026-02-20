// import React, { useState } from 'react';
// import { StyleSheet, View, Button, Text, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import CryptoJS from 'crypto-js';
// import { Model } from '@/src/types/abaType';

// const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
// const MERCHANT_ID = 'ec000262';
// const API_KEY = '308f1c5f450ff6d971bf8a805b4d18a6ef142464';

// interface ABAQRResponse {
//   abapay_deeplink: string;
//   qrImage: string; // This is the base64 string
//   qrString: string;
//   status: {
//     code: string;
//     message: string;
//   };
// }

// const [qrData, setQrData] = useState<ABAQRResponse | null>(null);

// export default function KHQRPayment() {
//     const [loading, setLoading] = useState(false);
//     const [qrData, setQrData] = useState<{ qrString: string; deeplink: string } | null>(null);

//     const generateHash = (dataString: string, apiKey: string) => {
//         return CryptoJS.HmacSHA512(dataString, apiKey).toString(CryptoJS.enc.Base64);
//     };

//     const startKHQRPayment = async () => {
//         setLoading(true);
//         const tran_id = "T-" + Date.now();
//         const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

//         const paymentData: Model = {
//             req_time,
//             merchant_id: MERCHANT_ID,
//             tran_id,
//             amount: 100,
//             items: "",
//             shipping: 0,
//             firstname: "John",
//             lastname: "Doe",
//             email: "test@example.com",
//             phone: "012345678",
//             type: "purchase",
//             payment_option: "abapay_khqr",
//             return_url: "",
//             cancel_url: "",
//             continue_success_url: "",
//             return_deeplink: "",
//             currency: "KHR",
//             custom_fields: "",
//             return_params: "",
//             payout: "",
//             lifetime: 0,
//             additional_params: "",
//             google_pay_token: "",
//             skip_success_page: 0,
//             view_type: "hosted_view"
//         };

//         // Construct Hash (Ensure order matches PayWay sequence exactly as before)
//         const b4hash =
//             paymentData.req_time + paymentData.merchant_id + paymentData.tran_id +
//             paymentData.amount + paymentData.items + paymentData.shipping +
//             paymentData.firstname + paymentData.lastname + paymentData.email +
//             paymentData.phone + paymentData.type + paymentData.payment_option +
//             paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url +
//             paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields +
//             paymentData.return_params + paymentData.payout + paymentData.lifetime +
//             paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

//         const hash = generateHash(b4hash, API_KEY);

//         // Prepare Form Data
//         const formData = new URLSearchParams();

//         Object.entries({ ...paymentData, hash }).forEach(([key, val]) => {
//             // Ensure the value is converted to a string to satisfy TypeScript
//             const stringValue = val !== null && val !== undefined ? val.toString() : "";
//             formData.append(key, stringValue);
//         });

//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 body: formData.toString(),
//             });

//             const result = await response.json();
//             console.log(result);

//             if (result.status === 0) {
//                 // status 0 usually means success in PayWay JSON responses
//                 setQrData({
//                     qrString: result.qrString,
//                     deeplink: result.abapay_deeplink
//                 });
//             } else {
//                 alert("Error: " + result.description);
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Failed to initiate payment");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const openABAMobile = () => {
//         if (qrData?.deeplink) {
//             Linking.openURL(qrData.deeplink).catch(() => {
//                 alert("ABA Mobile app is not installed.");
//             });
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {loading && <ActivityIndicator size="large" />}

//             {!qrData && !loading && (
//                 <Button title="Pay with KHQR" onPress={startKHQRPayment} />
//             )}

//             {qrData && (
//                 <View style={styles.qrContainer}>
//                     <Text style={styles.title}>Scan to Pay</Text>
//                     <View style={styles.qrWrapper}>
//                         <QRCode value={qrData.qrString} size={250} />
//                     </View>

//                     <TouchableOpacity style={styles.abaButton} onPress={openABAMobile}>
//                         <Text style={styles.abaButtonText}>Open ABA Mobile</Text>
//                     </TouchableOpacity>

//                     <Button title="Cancel" color="red" onPress={() => setQrData(null)} />
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
//     qrContainer: { alignItems: 'center', padding: 20 },
//     qrWrapper: { padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 5 },
//     title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
//     abaButton: {
//         backgroundColor: '#005a9c', // ABA Brand Color
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//         marginTop: 30,
//         marginBottom: 10
//     },
//     abaButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
// });

import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    Linking, 
    Alert, 
    SafeAreaView, 
    Platform 
} from 'react-native';
import CryptoJS from 'crypto-js';

// Configuration
const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
const MERCHANT_ID = 'ec000262';
const API_KEY = '308f1c5f450ff6d971bf8a805b4d18a6ef142464';
// const MERCHANT_ID = 'ec463658';
// const API_KEY = 'caf065bfd0b7bd65f1e1614eb36884ffa92d0525';

export default function KHQRPayment() {
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<{ 
        qrString: string; 
        deeplink: string; 
        qrImage: string;
        playStore: string;
        appStore: string;
    } | null>(null);

    const generateHash = (dataString: string, apiKey: string) => {
        return CryptoJS.HmacSHA512(dataString, apiKey).toString(CryptoJS.enc.Base64);
    };

    const startKHQRPayment = async () => {
        setLoading(true);
        const tran_id = "T-" + Date.now();
        const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

        const paymentData = {
            req_time,
            merchant_id: MERCHANT_ID,
            tran_id,
            amount: 100,
            items: "",
            shipping: 0,
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
            lifetime: 0,
            additional_params: "",
            google_pay_token: "",
            skip_success_page: 0,
            view_type: "hosted_view"
        };

        // PRESERVED: Your specific working Hash logic
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
            const stringValue = val !== null && val !== undefined ? val.toString() : "";
            formData.append(key, stringValue);
        });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });

            const result = await response.json();

            if (result.status && result.status.code === "00") {
                setQrData({
                    qrString: result.qrString,
                    deeplink: result.abapay_deeplink,
                    qrImage: result.qrImage,
                    playStore: result.play_store,
                    appStore: result.app_store
                });
            } else {
                Alert.alert("Error", result.description || "Failed to initialize");
            }
        } catch (error) {
            Alert.alert("Error", "Network connection failed");
        } finally {
            setLoading(false);
        }
    };

    const openABAMobile = async () => {
        if (!qrData) return;

        const url = decodeURIComponent(qrData.deeplink);
        const storeUrl = Platform.OS === 'ios' ? qrData.appStore : qrData.playStore;

        try {
            // "Try First" approach:
            // This is better for Expo Go because it bypasses the scheme check
            // that often fails (returns false) even if the app exists.
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                // If canOpenURL fails, we still try to openURL as a last ditch effort
                // If that also fails, it will trigger the catch block.
                await Linking.openURL(url);
            }
        } catch (err) {
            // App is definitely not installed or link is broken
            Alert.alert(
                "ABA App Not Found",
                "Would you like to download the ABA Mobile app to continue?",
                [
                    { text: "No", style: "cancel" },
                    { text: "Download", onPress: () => Linking.openURL(storeUrl) }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#005a9c" />}

            {!qrData && !loading && (
                <TouchableOpacity style={styles.payButton} onPress={startKHQRPayment}>
                    <Text style={styles.buttonText}>Pay 100 KHR with ABA</Text>
                </TouchableOpacity>
            )}

            {qrData && (
                <View style={styles.qrContainer}>
                    <Text style={styles.title}>Scan to Pay</Text>
                    
                    <View style={styles.qrWrapper}>
                        {/* Branded ABA QR with Currency Symbol */}
                        <Image 
                            source={{ uri: qrData.qrImage }} 
                            style={styles.qrImageStyle} 
                            resizeMode="contain"
                        />
                    </View>

                    <TouchableOpacity style={styles.abaButton} onPress={openABAMobile}>
                        <Text style={styles.buttonText}>Open ABA Mobile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={() => setQrData(null)}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    qrContainer: { alignItems: 'center', padding: 20, width: '100%' },
    qrWrapper: { 
        padding: 10, 
        backgroundColor: 'white', 
        borderRadius: 15, 
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    qrImageStyle: { width: 280, height: 280 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    payButton: { backgroundColor: '#005a9c', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
    abaButton: {
        backgroundColor: '#005a9c', 
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 30,
        width: 280,
        alignItems: 'center'
    },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { marginTop: 20, padding: 10 },
    cancelText: { color: '#FF3B30', fontSize: 15, fontWeight: '600' }
});