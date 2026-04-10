// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
// import { useLocalSearchParams } from "expo-router";
// import { paymentCreditCard } from '@/src/api/payments';

// export default function CardPayment() {
//     const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
    
//     const [loading, setLoading] = useState(true);
//     const [apiResponse, setApiResponse] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function testPaymentApi() {
//             if (!orderNumber) {
//                 setError("No order number found in params.");
//                 setLoading(false);
//                 return;
//             }

//             console.log(`📡 Calling API for Order: ${orderNumber}...`);

//             try {
//                 // 1. Call your API method
//                 const data = await paymentCreditCard(orderNumber);
                
//                 // 2. Log the full response to your terminal/debugger
//                 console.log("✅ API Response Success:", JSON.stringify(data, null, 2));
                
//                 // 3. Store it to display on the phone screen for easy debugging
//                 setApiResponse(data);
//             } catch (err: any) {
//                 console.error("❌ API Response Error:", err.message);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         testPaymentApi();
//     }, [orderNumber]);

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.headerText}>API Connection Test</Text>
//                 <Text style={styles.subText}>Order ID: {orderNumber}</Text>
//             </View>

//             {loading ? (
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color="#005a9c" />
//                     <Text style={{ marginTop: 10 }}>Fetching Gateway Data...</Text>
//                 </View>
//             ) : error ? (
//                 <View style={styles.center}>
//                     <Text style={styles.errorText}>Error: {error}</Text>
//                 </View>
//             ) : (
//                 <ScrollView style={styles.responseBox}>
//                     <Text style={styles.label}>Full JSON Response:</Text>
//                     <Text style={styles.codeBlock}>
//                         {JSON.stringify(apiResponse, null, 2)}
//                     </Text>
//                 </ScrollView>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
//     header: { marginBottom: 20, marginTop: 40 },
//     headerText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//     subText: { fontSize: 16, color: '#666' },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     errorText: { color: 'red', fontWeight: 'bold', textAlign: 'center' },
//     responseBox: { 
//         backgroundColor: '#1e1e1e', 
//         padding: 15, 
//         borderRadius: 8,
//         flex: 1 
//     },
//     label: { color: '#aaa', marginBottom: 10, fontSize: 12, fontWeight: 'bold' },
//     codeBlock: { 
//         color: '#00ff00', 
//         fontFamily: 'monospace', 
//         fontSize: 12 
//     }
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { paymentCreditCard } from '@/src/api/payments';
// import { WebView } from 'react-native-webview';

// export default function CardPayment() {
//     const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
//     const router = useRouter();
    
//     const [loading, setLoading] = useState(true);
//     const [paymentSource, setPaymentSource] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function initiatePayment() {
//             if (!orderNumber) {
//                 setError("No order number found.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 // 1. Get the signed payment data from your Express Backend
//                 const data = await paymentCreditCard(orderNumber);
                
//                 // 2. Prepare the Form Body for the WebView (POST request)
//                 const formBody = Object.keys(data)
//                     .filter(key => key !== 'payment_url')
//                     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? ""))
//                     .join('&');

//                 // 3. Set the source for the WebView
//                 setPaymentSource({
//                     uri: data.payment_url,
//                     method: 'POST',
//                     body: formBody,
//                     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//                 });
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         initiatePayment();
//     }, [orderNumber]);

//     // --- RENDER WEBVIEW ---
//     if (paymentSource) {
//         return (
//             <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//                 <View style={styles.webviewHeader}>
//                     <TouchableOpacity onPress={() => setPaymentSource(null)}>
//                         <Text style={{ color: '#005a9c', fontWeight: 'bold' }}>Cancel Payment</Text>
//                     </TouchableOpacity>
//                     <Text style={{ fontWeight: 'bold' }}>Secure Checkout</Text>
//                     <View style={{ width: 50 }} /> 
//                 </View>
//                 <WebView
//                     source={paymentSource}
//                     originWhitelist={['*']}
//                     onNavigationStateChange={(navState) => {
//                         // Logic to detect success/cancel based on your return_url
//                         if (navState.url.includes('success')) {
//                             setPaymentSource(null);
//                             Alert.alert('Payment Successfull');
//                             // router.replace('/(tabs)/orders'); // Or your success screen
//                         }
//                     }}
//                 />
//             </SafeAreaView>
//         );
//     }

//     // --- RENDER LOADING OR ERROR ---
//     return (
//         <View style={styles.container}>
//             {loading ? (
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color="#005a9c" />
//                     <Text style={styles.loadingText}>Connecting to ABA PayWay...</Text>
//                 </View>
//             ) : (
//                 <View style={styles.center}>
//                     <Text style={styles.errorText}>❌ {error}</Text>
//                     <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
//                         <Text style={{ color: '#fff' }}>Go Back</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff', padding: 20 },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     loadingText: { marginTop: 15, fontSize: 16, color: '#555' },
//     errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 20 },
//     webviewHeader: {
//         height: 50,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee'
//     },
//     retryBtn: {
//         backgroundColor: '#005a9c',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 5
//     }
// });

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { paymentCreditCard } from '@/src/api/payments';
import { WebView } from 'react-native-webview';
import { usePaymentStatus } from '@/src/hooks/paymentProvider'; // Import your hook
import { Ionicons } from '@expo/vector-icons';

export default function CardPayment() {
    const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
    const router = useRouter();
    
    // Use the same polling logic as StepThree
    const { startPolling, isPaid } = usePaymentStatus();

    const [loading, setLoading] = useState(true);
    const [paymentSource, setPaymentSource] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Effect 1: Start Polling when orderNumber is available
    useEffect(() => {
        if (orderNumber) {
            startPolling(orderNumber, 'new_card');
        }
    }, [orderNumber]);

    // Effect 2: Watch for success from the Polling Provider
    useEffect(() => {
        if (isPaid) {
            // Alert.alert("Success", "Card Payment Verified!");
            setPaymentSource(null);
            router.replace('/(protected)/(tabs)/cart/success'); // Redirect to success page
        }
    }, [isPaid]);

    // Effect 3: Initial API call to get PayWay Link
    useEffect(() => {
        async function initiatePayment() {
            if (!orderNumber) {
                setError("No order number found.");
                setLoading(false);
                return;
            }

            try {
                const data = await paymentCreditCard(orderNumber);
                
                const formBody = Object.keys(data)
                    .filter(key => key !== 'payment_url')
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? ""))
                    .join('&');

                setPaymentSource({
                    uri: data.payment_url,
                    method: 'POST',
                    body: formBody,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        initiatePayment();
    }, [orderNumber]);

    const handleNavigationStateChange = (navState: any) => {
        const { url } = navState;
        
        // This matches the Buffer string you created in Express: mobile://success
        if (url.includes('mobile://success')) {
            console.log("🚀 Redirecting via continue_success_url...");
            setPaymentSource(null);
            router.replace('/(protected)/(tabs)/cart/success');
        }

        // Handle cancel if needed
        if (url.includes('mobile://cancel')) {
            router.back();
        }
    };

    if (paymentSource) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.webviewHeader}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#005a9c" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Credit Card Payment</Text>
                    <View style={{ width: 24 }} />
                </View>
                <WebView
                    source={paymentSource}
                    originWhitelist={['*']}
                    // We don't necessarily need navState logic anymore because 
                    // the Polling will detect the success from the server side!
                />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#005a9c" />
            <Text style={styles.loadingText}>Connecting to Secure Gateway...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    webviewHeader: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold' },
    loadingText: { marginTop: 15, color: '#666' }
});