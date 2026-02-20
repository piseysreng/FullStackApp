import React, { useState } from 'react';
import { 
    StyleSheet, View, Text, TextInput, TouchableOpacity, 
    ScrollView, KeyboardAvoidingView, Platform, Switch 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/src/store/cart-store';

export default function StepTwo() {
    const router = useRouter();
    const setShippingDetails = useCartStore((state) => state.setShippingDetails);
    
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        zipCode: '12000',
        city: 'Phnom Penh',
        country: 'Cambodia'
    });

    const [saveAddress, setSaveAddress] = useState(false);

    const handleNext = () => {
        // Save local form state to global Zustand store
        setShippingDetails(form);
        router.push('/(protected)/(tabs)/cart/stepThree'); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shipping Details</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="John Doe" 
                        value={form.fullName} 
                        onChangeText={(text) => setForm({...form, fullName: text})} 
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="example@mail.com" 
                        keyboardType="email-address" 
                        value={form.email} 
                        onChangeText={(text) => setForm({...form, email: text})} 
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="012 345 678" 
                        keyboardType="phone-pad" 
                        value={form.phoneNumber} 
                        onChangeText={(text) => setForm({...form, phoneNumber: text})} 
                    />

                    <Text style={styles.label}>Full Address</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        placeholder="House No, Street Name..." 
                        multiline 
                        value={form.address} 
                        onChangeText={(text) => setForm({...form, address: text})} 
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>Zip Code</Text>
                            <TextInput style={styles.input} value={form.zipCode} keyboardType="numeric" onChangeText={(text) => setForm({...form, zipCode: text})} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>City</Text>
                            <TextInput style={styles.input} value={form.city} onChangeText={(text) => setForm({...form, city: text})} />
                        </View>
                    </View>

                    <Text style={styles.label}>Country</Text>
                    <TextInput style={[styles.input, { backgroundColor: '#f0f0f0' }]} value={form.country} editable={false} />

                    <View style={styles.toggleContainer}>
                        <View>
                            <Text style={styles.toggleLabel}>Save this address</Text>
                            <Text style={styles.toggleSubLabel}>Use this for my future purchases</Text>
                        </View>
                        <Switch value={saveAddress} onValueChange={setSaveAddress} trackColor={{ false: "#767577", true: "#005a9c" }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>Continue to Payment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
    scrollContent: { padding: 20 },
    label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
    input: { backgroundColor: '#fcfcfc', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, marginBottom: 18 },
    row: { flexDirection: 'row' },
    textArea: { height: 70, textAlignVertical: 'top' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    toggleLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
    toggleSubLabel: { fontSize: 12, color: '#888' },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    nextButton: { backgroundColor: '#005a9c', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});