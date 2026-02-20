import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/src/store/cart-store';

// Define the options locally for the UI
const DELIVERY_OPTIONS = [
    { id: '1', title: 'Standard Delivery', price: 3, time: '3-5 Working Days' },
    { id: '2', title: 'Next Day Delivery', price: 5, time: 'Delivered Tomorrow' },
    { id: '3', title: 'Nominated Delivery', price: 10, time: 'Choose your specific slot' },
];

export default function stepOne() {
    const router = useRouter();
    
    // Connect to your Zustand store
    const { delivery, setDelivery, getSubtotal, getTotalPrice } = useCartStore();

    const handleNext = () => {
        console.log('Delivery Set:', delivery);
        // Navigate to the next step: Address Information
        router.push('/(protected)/(tabs)/cart/stepTwo'); 
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Delivery Method</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>How would you like to receive your order?</Text>

                {DELIVERY_OPTIONS.map((option) => {
                    // Check if this option is the one currently in the store
                    const isSelected = delivery.title === option.title;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            activeOpacity={0.8}
                            style={[
                                styles.optionCard,
                                isSelected && styles.selectedCard
                            ]}
                            onPress={() => setDelivery({ title: option.title, price: option.price })}
                        >
                            <View style={[styles.radioCircle, isSelected && styles.selectedRadio]}>
                                {isSelected && <View style={styles.radioDot} />}
                            </View>
                            
                            <View style={styles.textContainer}>
                                <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
                                    {option.title}
                                </Text>
                                <Text style={styles.optionTime}>{option.time}</Text>
                            </View>

                            <Text style={[styles.optionPrice, isSelected && styles.selectedText]}>
                                ${option.price.toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Price Summary Box */}
                <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${getSubtotal()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>${delivery.price.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${getTotalPrice()}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>Continue to Address</Text>
                    <Ionicons name="chevron-forward" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 15, color: '#333' },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 15, color: '#666', marginBottom: 20, lineHeight: 22 },
    
    // Option Cards
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 15,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        // Shadow for Android
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#005a9c',
        backgroundColor: '#f0f7ff',
        borderWidth: 2,
    },
    
    // Custom Radio UI
    radioCircle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRadio: { borderColor: '#005a9c' },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#005a9c',
    },

    textContainer: { flex: 1, marginLeft: 15 },
    optionTitle: { fontSize: 16, fontWeight: '600', color: '#444' },
    selectedText: { color: '#005a9c' },
    optionTime: { fontSize: 13, color: '#888', marginTop: 3 },
    optionPrice: { fontSize: 16, fontWeight: '700', color: '#333' },

    // Summary Section
    summaryBox: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { color: '#888', fontSize: 14 },
    summaryValue: { color: '#333', fontWeight: '600' },
    totalRow: { marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#005a9c' },

    // Footer
    footer: { 
        padding: 20, 
        backgroundColor: '#fff',
        borderTopWidth: 1, 
        borderTopColor: '#f0f0f0' 
    },
    nextButton: {
        backgroundColor: '#005a9c',
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { color: 'white', fontWeight: '700', fontSize: 16, marginRight: 8 },
});