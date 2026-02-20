import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import CryptoJS from 'crypto-js';

// Internal Project Imports (Ensure these paths are correct for your project)
import CartListItem from '@/src/components/CartListItem';
import { useCartStore } from '@/src/store/cart-store';
import { Model } from '@/src/types/abaType';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Cart() {
    const items = useCartStore((state) => state.items);
    const resetCart = useCartStore((state) => state.resetCart);

    // This is the KEY FIX: This line makes the component "listen" 
    // to changes in the calculation result.
    const totalPrice = useCartStore((state) => state.getSubtotal());
    const router = useRouter();

    const startCheckOut = () => {
        if (items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        console.log('Navigating to Delivery Options...');

        // 3. Navigate to your delivery page
        // Change '/delivery' to the actual path or name of your delivery screen
        router.push('/(protected)/(tabs)/cart/stepOne');
        // navigation.navigate('DeliveryOptions'); // If using React Navigation
    };

    return (
        <View style={styles.container}>
            <Text>My Cart</Text>
            <FlatList
                data={items}
                // extraData forces the list to re-render when the items array contents change
                extraData={items}
                renderItem={({ item }) => <CartListItem cart={item} />}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={
                    <View style={styles.footerContainer}>
                        {/* Use the totalPrice variable here */}
                        <Text style={styles.footerText}>Total: ${totalPrice}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={startCheckOut}
                            >
                                <Text style={styles.buttonText}>Checkout</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.resetButton} onPress={resetCart}>
                                <Text style={styles.resetText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    footerContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'right', // Aligns total to the right
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center', // Centers vertically
        justifyContent: 'space-between', // Puts space between if needed, or use 'flex-start'
    },
    checkoutButton: {
        backgroundColor: '#005a9c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1, // Makes checkout take most of the space
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resetButton: {
        marginLeft: 10, // Small gap from the checkout button
        padding: 5,
    },
    resetText: {
        color: '#FF3B30', // Red color
        fontSize: 12,    // Very small font
        fontWeight: '600',
        textDecorationLine: 'underline', // Makes it look like a secondary action
    },

});