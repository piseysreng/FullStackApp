import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { orderItems, orders } from '@/assets/Orders';
import { products } from '@/assets/Products';
import ProductListItem from '@/src/components/ProductListItem';

export default function OrderById() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const order = orders.find(dataItem => dataItem.order_id === Number(id));
    if (!order) {
        return <Text>Item not found or loading...</Text>;
    }

    const productByID = orderItems.filter(dataItem => dataItem.order_id === Number(order.order_id));


    if (!productByID) {
        console.log('No Products in this category');
    }

    const jsonString = JSON.stringify(productByID, null, 2);
    return (
        <View>
            <View>
                <Text>Order #{order.order_id}</Text>
                <Text>Items: ${order.total_amount}</Text>
                <Text>Items :{order.total_quantity}</Text>
                <Text>Placed on:  {order.placed_at}</Text>
                <Text>Status:  {order.current_status}</Text>
                <View style={{ paddingTop: 5 }} />
                <View>
                    <Text>Order Placed : {order.placed_at}</Text>
                    <Text>Order Confirmed : {order.confirmed_at}</Text>
                    <Text>Order Shipped : {order.shipped_at}</Text>
                    <Text>Out for Delivery : {order.out_for_delivery_at}</Text>
                    <Text>Order Delivered : {order.delivered_at}</Text>
                </View>
            </View>
            <View style={{ paddingTop: 50 }} />
            <View>
                <Text>Product Details</Text>
                <Text>{jsonString}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})