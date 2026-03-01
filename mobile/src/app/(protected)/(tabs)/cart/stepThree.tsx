import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView,
    Alert, ActivityIndicator, SafeAreaView, Modal, Image, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useCartStore } from '@/src/store/cart-store';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/src/api/orders';
import { useAuth } from '@clerk/clerk-expo';
import { OrdersItems } from '@/assets/TYPES';
import { orderItems } from '@/assets/Orders';
import { paymentCreditCard, paymentKQCode } from '@/src/api/payments';
import QRCode from 'react-native-qrcode-svg';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

// --- Types ---
interface SavedMethod {
    id: string;
    type: 'aba' | 'card';
    lastDigits: string;
    brand?: string;
}

interface OrderItem {
    productId: string | number;
    quantity: number;
    // price: number;
}

interface WebViewPostSource {
    uri: string;
    method: 'POST';
    body: string;
    headers: { 'Content-Type': string };
}

const SAVED_METHODS: SavedMethod[] = [
    { id: 'save_1', type: 'aba', lastDigits: '789' },
    { id: 'save_2', type: 'card', lastDigits: '4242', brand: 'Visa' },
];

export default function StepThree() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('');
    const { getToken } = useAuth();
    const [qrVisible, setQrVisible] = useState(false);
    const [qrData, setQrData] = useState<{ qrString: string, deeplink: string } | null>(null);
    const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);
    const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
    const [showWebView, setShowWebView] = useState(false);
    const [webViewSource, setWebViewSource] = useState<WebViewPostSource | null>(null);

    // Pulling store data
    const { items, delivery, getTotalPrice, getSubtotal, shippingDetails } = useCartStore();

    useEffect(() => {
        let interval: any;

        if (qrVisible && qrData) {
            const startTime = Date.now();

            interval = setInterval(async () => {
                const elapsedSeconds = (Date.now() - startTime) / 1000;

                // 2. Stop polling after 5 minutes (300 seconds)
                if (elapsedSeconds > 60) {
                    clearInterval(interval);
                    setQrVisible(false);
                    Alert.alert("Session Expired", "Payment time limit reached. Please try again.");
                    return;
                }

                try {
                    console.log(`Checking status... (${Math.round(elapsedSeconds)}s)`);

                    // Replace with your actual API call to check status
                    // const res = await checkPaymentStatus(qrData.orderNumber); 

                    // Mocking a success condition:
                    const paymentIsDone = false; // logic from res.status === 'PAID'

                    if (paymentIsDone) {
                        handlePaymentSuccess();
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [qrVisible, qrData]);

    const handlePaymentSuccess = () => {
        // 1. Close any open modals
        setQrVisible(false);
        setShowWebView(false);
        setQrData(null);
        setWebViewSource(null);

        // 2. Clear Cart or State if necessary
        // useCartStore.getState().clearCart(); 

        // 3. Navigate to success screen
        Alert.alert("Success", "Payment completed successfully!");
        // router.push('/(protected)/(tabs)/cart/success'); // Adjust path to your success screen
    };

    const payWithQRCodeMutation = useMutation({
        mutationFn: async (orderNumber: string) => {
            return await paymentKQCode(orderNumber);
        },
        onSuccess: (data) => {
            console.log('✅ Payment with QRCode Successful:', data);
            if (data.success && data.qrString) {
                // Store the data and open the modal
                setQrData({
                    qrString: data.qrString,
                    deeplink: data.deeplink
                });
                setQrVisible(true);
            }
        },
        onError: (error) => {
            Alert.alert("Payment Error", "Could not generate KHQR code.");
        },
    });

    const payWithCardMutation = useMutation({
        mutationFn: async (orderNumber: string) => {
            return await paymentCreditCard(orderNumber);
        },
        onSuccess: (data) => {
            console.log('✅ Card Payment Data Received:', data);

            if (data.url && data.params) {
                // 1. Format body as x-www-form-urlencoded (Same as your Test Code)
                const formBody = Object.keys(data.params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data.params[key])}`)
                    .join('&');

                // 2. Set the source object for WebView
                setWebViewSource({
                    uri: data.url,
                    method: 'POST',
                    body: formBody,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                // 3. Open the WebView Modal
                setShowWebView(true);
            } else {
                Alert.alert("Error", "Invalid payment data received from server.");
            }
        },
        onError: (error) => {
            Alert.alert("Payment Error", "Failed to load card payment.");
        },
    });

    // --- Mutation Setup ---
    const createOrderMutation = useMutation({
        // Updated to include shippingAddress in the arguments
        mutationFn: async ({ itemsData, shippingAddress, deliveryOption, paymentMethod, token }: {
            itemsData: any[],
            shippingAddress: any,
            deliveryOption: any,
            paymentMethod: string, // <--- Add this
            token: string
        }) => {
            return await createOrder(itemsData, shippingAddress, deliveryOption, paymentMethod, token);
        },
        onSuccess: async (data) => {
            console.log('✅ Order & Items created:', data);
            // Start Payment API
            if (selectedId === 'new_aba') {
                // Call ABA KHQRCode API
                Alert.alert("Success", "ABA KRCode API Start Running");
                payWithQRCodeMutation.mutate(data.orderNumber);
            } else if (selectedId === 'new_card') {
                Alert.alert("Success", "Card API Start Running");
                payWithCardMutation.mutate(data.orderNumber);
            } else if (SAVED_METHODS.some(method => method.id === selectedId)) {
                const savedMethod = SAVED_METHODS.find(m => m.id === selectedId);

                // 1. Call your "Charge Saved Method" API here
                // const chargeResult = await chargeSavedMethod(data.orderNumber, savedMethod.id);

                // 2. If successful:
                handlePaymentSuccess();
            }
            else {
                Alert.alert("Error", "Invalid selection. Please select a payment method.");
            }
        },
        onError: (error) => {
            console.error('❌ Order creation failed:', error);
        },
    });

    // --- Logic ---
    const handlePay = async () => {
        if (!selectedId) return Alert.alert("Selection Required", "Please select a payment method.");

        setLoading(true);

        try {
            const token = await getToken();
            if (!token) throw new Error("No token found");

            // --- NEW LOGIC: Determine Payment Method Label ---
            let paymentMethodLabel = "";
            if (selectedId === 'new_aba') {
                paymentMethodLabel = "ABA KHQR";
            } else if (selectedId === 'new_card') {
                paymentMethodLabel = "Credit Card";
            } else {
                // Find the saved method label
                const saved = SAVED_METHODS.find(m => m.id === selectedId);
                paymentMethodLabel = saved ? `Saved ${saved.type} (***${saved.lastDigits})` : "Saved Method";
            }

            const itemsData = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const shippingAddress = {
                customerName: shippingDetails.fullName,
                email: shippingDetails.email,
                phone: shippingDetails.phoneNumber,
                addressLine: shippingDetails.address,
                city: shippingDetails.city,
            };

            const deliveryOption = {
                title: delivery.title,
                fee: delivery.price
            };

            // 3. Execute Mutation with paymentMethod
            await createOrderMutation.mutateAsync({
                itemsData,
                shippingAddress,
                deliveryOption,
                paymentMethod: paymentMethodLabel, // <--- Pass it here
                token
            });

            // if (selectedId === 'new_aba') {
            //     router.push('/(protected)/(tabs)/cart/abaQrDisplay');
            // } else {
            //     Alert.alert("Success", "Order placed successfully!");
            // }

        } catch (error) {
            Alert.alert("Order Error", "Failed to process items.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Total Amount Card */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total Payment</Text>
                    <Text style={styles.amountValue}>${getTotalPrice()}</Text>
                </View>

                {/* New Methods */}
                <Text style={styles.sectionTitle}>Add New Method</Text>
                <TouchableOpacity
                    style={[styles.methodCard, selectedId === 'new_aba' && styles.selectedCard]}
                    onPress={() => setSelectedId('new_aba')}
                >
                    <Ionicons name="qr-code-outline" size={24} color={selectedId === 'new_aba' ? "#005a9c" : "#555"} />
                    <Text style={[styles.methodTitle, selectedId === 'new_aba' && styles.selectedText]}>ABA KHQR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.methodCard, selectedId === 'new_card' && styles.selectedCard]}
                    onPress={() => setSelectedId('new_card')}
                >
                    <FontAwesome name="credit-card" size={20} color={selectedId === 'new_card' ? "#005a9c" : "#555"} />
                    <Text style={[styles.methodTitle, selectedId === 'new_card' && styles.selectedText]}>New Credit Card</Text>
                </TouchableOpacity>

                {/* Saved Methods */}
                {SAVED_METHODS.length > 0 && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
                        {SAVED_METHODS.map((item) => {
                            const isSelected = selectedId === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.methodCard, isSelected && styles.selectedCard]}
                                    onPress={() => setSelectedId(item.id)}
                                >
                                    <Ionicons name={item.type === 'aba' ? "wallet-outline" : "card-outline"} size={24} color={isSelected ? "#005a9c" : "#555"} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={[styles.methodTitle, isSelected && styles.selectedText]}>
                                            {item.type === 'aba' ? `ABA Bank (***${item.lastDigits})` : `${item.brand} (**** ${item.lastDigits})`}
                                        </Text>
                                    </View>
                                    <View style={[styles.radioCircle, isSelected && styles.selectedRadio]}>
                                        {isSelected && <View style={styles.radioDot} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={qrVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setQrVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.qrContainer}>
                        <View style={styles.qrHeader}>
                            <Text style={styles.qrTitle}>Scan to Pay (KHQR)</Text>
                            <TouchableOpacity onPress={() => setQrVisible(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.qrBox}>
                            {qrData?.qrString ? (
                                <QRCode
                                    value={qrData.qrString}
                                    size={220}
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#005a9c" />
                            )}
                        </View>

                        <Text style={styles.qrInstruction}>
                            Screenshot this QR or scan it with your ABA Mobile app to complete payment.
                        </Text>

                        {/* Optional: Deep Link Button for Mobile Banking */}
                        <TouchableOpacity
                            style={styles.deeplinkButton}
                            onPress={async () => {
                                if (qrData?.deeplink) {
                                    try {
                                        // Check if the link is supported (ABA app is installed)
                                        const supported = await Linking.canOpenURL(qrData.deeplink);

                                        if (supported) {
                                            await Linking.openURL(qrData.deeplink);
                                        } else {
                                            Alert.alert(
                                                "ABA App Not Found",
                                                "Please install the ABA Mobile app or scan the QR code manually."
                                            );
                                        }
                                    } catch (error) {
                                        console.error("Failed to open deeplink:", error);
                                        Alert.alert("Error", "Could not open the ABA app.");
                                    }
                                }
                            }}
                        >
                            <Text style={styles.deeplinkText}>Open ABA App</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showWebView} animationType="slide">
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        {/* Added a Close button that clears the source to prevent ghost loading */}
                        <TouchableOpacity onPress={() => {
                            setShowWebView(false);
                            setWebViewSource(null);
                        }}>
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Secure Payment</Text>
                    </View>

                    {webViewSource ? (
                        <WebView
                            source={webViewSource}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onNavigationStateChange={(navState) => {
                                // Check if the URL contains your backend's success redirect keyword
                                if (navState.url.includes('success')) {
                                    handlePaymentSuccess();
                                } else if (navState.url.includes('cancel') || navState.url.includes('fail')) {
                                    setShowWebView(false);
                                    Alert.alert("Payment Failed", "The transaction was declined or cancelled.");
                                }
                            }}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <ActivityIndicator
                                    style={{ position: 'absolute', top: '50%', left: '45%' }}
                                    size="large"
                                />
                            )}
                        />
                    ) : (
                        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
                    )}
                </SafeAreaView>
            </Modal>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, !selectedId && styles.disabledButton]}
                    onPress={handlePay}
                    disabled={!selectedId || loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Pay Now</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    content: { padding: 20 },
    amountCard: { backgroundColor: '#005a9c', padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 30 },
    amountLabel: { color: '#e0e0e0', fontSize: 12 },
    amountValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
    methodCard: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
    selectedCard: { borderColor: '#005a9c', backgroundColor: '#f5faff', borderWidth: 2 },
    methodTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 12 },
    selectedText: { color: '#005a9c' },
    radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
    selectedRadio: { borderColor: '#005a9c' },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#005a9c' },
    footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    payButton: { backgroundColor: '#005a9c', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { backgroundColor: '#ccc' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    qrContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    qrHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005a9c'
    },
    qrBox: {
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    qrInstruction: {
        marginTop: 20,
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        lineHeight: 20
    },
    deeplinkButton: {
        marginTop: 20,
        backgroundColor: '#005a9c',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25
    },
    deeplinkText: {
        color: 'white',
        fontWeight: 'bold'
    }
});