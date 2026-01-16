import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { cart } from '@/assets/Carts'
import CartListItem from '@/src/components/CartListItem'
import { useCartStore } from '@/src/store/cart-store'

export default function Cart() {
    const { items, getTotalPrice, getItemCount, resetCart } = useCartStore();
    const shippingCharge = 1.9;

    const getSubTotalCheckOutPrice = ()=>{
        return getTotalPrice();
    };
    const getTotalCheckOutPrice = ()=>{
        return Number(getTotalPrice()) + shippingCharge;
    };

    const onCheckOut = ()=>{
        console.log('Start CheckOut');
    }
    const clearCart = ()=>{
        resetCart();
    }

    const checkOutContainer = () => {
        return (
            <View>
                <View>
                    <Text>Total Item: </Text>
                    <Text>{getItemCount()}</Text>
                </View>
                <View>
                    <Text>SubTotal: </Text>
                    <Text>${getSubTotalCheckOutPrice()}</Text>
                </View>
                <View>
                    <Text>Shipping Charge: </Text>
                    <Text>${shippingCharge}</Text>
                </View>
                <View>
                    <Text>Total: </Text>
                    <Text>${getTotalCheckOutPrice().toFixed(2)}</Text>
                </View>
                <View>
                    <Pressable onPress={onCheckOut}>
                        <Text>Check Out</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={clearCart}>
                        <Text>Clear Cart</Text>
                    </Pressable>
                </View>
                <View style={{ paddingTop: 50 }} />
            </View>
        )
    }
    return (
        <View>
            <Text>Cart</Text>
            <FlatList
                data={items}
                renderItem={({ item }) =>
                    <View style={{ width: '45%' }}>
                        <CartListItem cart={item} />
                    </View>
                }
                keyExtractor={item => item.id.toString()}
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                ListFooterComponent={checkOutContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
