import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    Modal,
    SafeAreaView,
    Image,
    Dimensions
} from 'react-native';
import CryptoJS from 'crypto-js';

// Internal Project Imports (Ensure these paths are correct for your project)
import CartListItem from '@/src/components/CartListItem';
import { useCartStore } from '@/src/store/cart-store';
import { Model } from '@/src/types/abaType';

const { width } = Dimensions.get('window');

export default function Cart() {
    const { items, getTotalPrice, resetCart } = useCartStore();
    const shippingCharge = 0;

    // --- State for the QR Popup ---
    const [modalVisible, setModalVisible] = useState(false);
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getTotalCheckOutPrice = () => Number(getTotalPrice()) + shippingCharge;

    const generateHash = (dataString: string, apiKey: string) => {
        const hmac = CryptoJS.HmacSHA512(dataString, apiKey);
        return CryptoJS.enc.Base64.stringify(hmac);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Replace with your actual sandbox/production API Key
            const API_KEY = "308f1c5f450ff6d971bf8a805b4d18a6ef142464"; 
            const uniqueTranId = "T" + Date.now();
            const now = new Date();
            const req_time = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');

            const paymentData: Model = {
                req_time,
                merchant_id: "ec000262",
                tran_id: uniqueTranId,
                amount: 100, 
                items: "", 
                shipping: 0,
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "012345678",
                type: "purchase",
                payment_option: "alipay", // Requesting QR/Deeplink
                return_url: "",
                cancel_url: "",
                continue_success_url: "",
                return_deeplink: "",
                currency: "KHR",
                custom_fields: "",
                return_params: "",
                payout: "",
                lifetime: 0,
                additional_params: "",
                google_pay_token: "",
                skip_success_page: 0,
                view_type: "hosted_view"
            };

            // Calculate Hash
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

            const formData = new FormData();
            Object.keys(paymentData).forEach((key) => {
                const value = paymentData[key as keyof typeof paymentData];
                formData.append(key, value.toString());
            });
            formData.append("hash", hash);

            const response = await fetch("https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase", {
                method: 'POST',
                body: formData,
            });

            console.log(response);

            // Parse response as JSON
            const result = await response.json();
            
            if (result.status && result.status.code === "00") {
                setQrCodeBase64(result.qrImage);
                setModalVisible(true);
            } else {
                Alert.alert("Payment Error", result.status?.message || "Failed to generate QR");
            }

        } catch (error) {
            console.error('Payment Error:', error);
            Alert.alert("Error", "Could not initialize payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>My Cart</Text>
            
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 10 }}>
                        <CartListItem cart={item} />
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>Total Amount:</Text>
                            <Text style={styles.totalPrice}>${getTotalCheckOutPrice().toFixed(2)}</Text>
                        </View>
                        <Pressable 
                            onPress={handlePayment} 
                            disabled={loading}
                            style={[styles.checkoutButton, loading && { opacity: 0.7 }]}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Processing..." : "Check Out"}
                            </Text>
                        </Pressable>
                    </View>
                }
            />

            {/* --- QR CODE MODAL --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.qrCard}>
                        <Text style={styles.abaHeader}>ABA PAY</Text>
                        <Text style={styles.scanText}>Scan the QR code to pay</Text>
                        
                        {qrCodeBase64 && (
                            <View style={styles.qrWrapper}>
                                <Image 
                                    source={{ uri: qrCodeBase64 }} 
                                    style={styles.qrImage}
                                />
                            </View>
                        )}

                        <Text style={styles.amountText}>
                            Total: ${getTotalCheckOutPrice().toFixed(2)}
                        </Text>

                        <Pressable 
                            style={styles.closeButton} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        color: '#333'
    },
    footer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 20
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    totalLabel: {
        fontSize: 18,
        color: '#666'
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    checkoutButton: {
        backgroundColor: '#005aab',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Dim background
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrCard: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    abaHeader: {
        fontSize: 22,
        fontWeight: '800',
        color: '#005aab',
        marginBottom: 5
    },
    scanText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20
    },
    qrWrapper: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    qrImage: {
        width: 220,
        height: 220,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20
    },
    closeButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        alignItems: 'center'
    },
    closeButtonText: {
        color: '#333',
        fontWeight: '600'
    }
});