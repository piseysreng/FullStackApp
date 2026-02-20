import React, { useState } from 'react';
import { 
    StyleSheet, View, Text, TouchableOpacity, ScrollView, 
    Alert, ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useCartStore } from '@/src/store/cart-store';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/src/api/orders';

interface SavedMethod {
    id: string;
    type: 'aba' | 'card';
    lastDigits: string;
    brand?: string; 
}

const SAVED_METHODS: SavedMethod[] = [
    { id: 'save_1', type: 'aba', lastDigits: '789' },
    { id: 'save_2', type: 'card', lastDigits: '4242', brand: 'Visa' },
];

export default function StepThree() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('');
    
    // Pulling EVERYTHING from the store
    const { items, delivery, getTotalPrice, getSubtotal, shippingDetails } = useCartStore();

    const createOrderMutation = useMutation({
        // Add Detail to Cart Database
        mutationFn: () => createOrder(
            items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        ),
        onSuccess: (data) => {
            console.log('Successful Add to Cart Table')
            // Start Call Payment API
            // resetCart();
            // router.push(`/orders/${data.id}`);
        },
        onError: (error) => { console.log(error) },
    });
    

    const handlePay = async () => {
        if (!selectedId) return;
        setLoading(true);

        const savedMatch = SAVED_METHODS.find(m => m.id === selectedId);
        
        // --- CONSOLE LOGS (Now using real data) ---
        console.log("------- CHECKOUT DATA REVIEW -------");
        
        console.log("📦 ITEMS LIST:", items.map(i => ({
            product_id: i.id,
            quantity: i.quantity,
            unit_price: `$${i.price}`
        })));

        console.log("👤 CUSTOMER DETAIL:", {
            name: shippingDetails.fullName,
            email: shippingDetails.email,
            phone: shippingDetails.phoneNumber,
            address: `${shippingDetails.address}, ${shippingDetails.city}`
        });

        console.log("🚚 DELIVERY OPTION:", {
            title: delivery.title,
            fee: `$${delivery.price.toFixed(2)}`
        });

        console.log("💳 PAYMENT OPTION:", {
            id: selectedId,
            type: savedMatch ? `Saved ${savedMatch.type}` : selectedId
        });
        
        console.log("💰 SUMMARY:", {
            subtotal: `$${getSubtotal()}`,
            delivery: `$${delivery.price.toFixed(2)}`,
            total: `$${getTotalPrice()}`
        });
        console.log("------------------------------------");

        try {
            // Prepare Payload for Single Backend Endpoint
            const orderPayload = {
                items: items,
                customer_details: shippingDetails, // ACTUAL DATA FROM STEP 2
                delivery: delivery,
                payment: {
                    method: selectedId,
                    is_saved: !!savedMatch,
                    amount: getTotalPrice()
                }
            };

            // API Call placeholder: await axios.post('/api/order', orderPayload);

            setTimeout(() => {
                setLoading(false);
                if (selectedId === 'new_aba') {
                    router.push('/(protected)/(tabs)/cart/abaQrDisplay');
                } else if (selectedId === 'new_card') {
                    router.push('/(protected)/(tabs)/cart/creditCardForm');
                } else {
                    Alert.alert("Success", "Payment Initiated Successfully!");
                }
            }, 1500);

        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Payment failed to initialize.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total Payment</Text>
                    <Text style={styles.amountValue}>${getTotalPrice()}</Text>
                </View>

                <Text style={styles.sectionTitle}>Add New Method</Text>
                <TouchableOpacity style={[styles.methodCard, selectedId === 'new_aba' && styles.selectedCard]} onPress={() => setSelectedId('new_aba')}>
                    <Ionicons name="qr-code-outline" size={24} color={selectedId === 'new_aba' ? "#005a9c" : "#555"} />
                    <Text style={[styles.methodTitle, selectedId === 'new_aba' && styles.selectedText]}>ABA KHQR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.methodCard, selectedId === 'new_card' && styles.selectedCard]} onPress={() => setSelectedId('new_card')}>
                    <FontAwesome name="credit-card" size={20} color={selectedId === 'new_card' ? "#005a9c" : "#555"} />
                    <Text style={[styles.methodTitle, selectedId === 'new_card' && styles.selectedText]}>New Credit Card</Text>
                </TouchableOpacity>

                {SAVED_METHODS.length > 0 && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
                        {SAVED_METHODS.map((item) => {
                            const isSelected = selectedId === item.id;
                            return (
                                <TouchableOpacity key={item.id} style={[styles.methodCard, isSelected && styles.selectedCard]} onPress={() => setSelectedId(item.id)}>
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
});