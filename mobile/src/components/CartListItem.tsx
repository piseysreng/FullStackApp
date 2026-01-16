import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CartItem, Category } from '@/assets/TYPES'
import { Link } from 'expo-router'
import { products } from '@/assets/Products';
import { useCartStore } from '../store/cart-store';

export default function CartListItem({ cart }: { cart: CartItem }) {
    const product = products.find(dataItem => dataItem.id === Number(cart.id));
    if (!product) {
        return <Text>Item not found or loading...</Text>;
    }
    const { items, incrementItem, decrementItem, removeItem } = useCartStore();
    const cartItem = items.find(item => item.id === product?.id);
    const initialQuantity = cartItem ? cartItem.quantity : 0;
      const [quantity, setQuantity] = useState(initialQuantity);

    const increasementQuantity = () => {
        incrementItem(product.id);
    }
    const decreasementQuantity = () => {
        decrementItem(product.id);
    }

    const deleteFromCart = () => {
        removeItem(product.id);
    }

    return (
        <View style={{ padding: 10, backgroundColor: 'orange', marginTop: 5 }}>
            <View>
                <Text>Image</Text>
            </View>
            <View>
                <Text>${product.price}</Text>
                <Text>{product.name}</Text>
                <Text>{product.kilos} kg</Text>
            </View>
            <View>
                <View>
                    <View>
                        <Pressable onPress={decreasementQuantity}>
                            <Text>-</Text>
                        </Pressable>
                    </View>
                    <View><Text>{initialQuantity}</Text></View>
                    <View>
                        <Pressable onPress={increasementQuantity}>
                            <Text>+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View>
                <Pressable onPress={deleteFromCart}>
                    <Text>Delete</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})