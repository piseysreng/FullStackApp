import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Orders } from '@/assets/TYPES'
import { Link } from 'expo-router'

export default function OrderListItem({ order }: { order: Orders }) {
    return (
        <Link style={{backgroundColor: 'lightgrey', padding: 10, marginTop: 5}} href={`/(protected)/(tabs)/account/orders/${order.order_id}`}>
            <View>
                <Text>Order #{order.order_id}</Text>
                <Text>Items: ${order.total_amount}</Text>
                <Text>Items :{order.total_quantity}</Text>
                <Text>Placed on:  {order.placed_at}</Text>
                <Text>Status:  {order.current_status}</Text>
                <View style={{paddingTop: 5}}/>
                <View>
                    <Text>Order Placed : {order.placed_at}</Text>
                    <Text>Order Confirmed : {order.confirmed_at}</Text>
                    <Text>Order Shipped : {order.shipped_at}</Text>
                    <Text>Out for Delivery : {order.out_for_delivery_at}</Text>
                    <Text>Order Delivered : {order.delivered_at}</Text>
                </View>
            </View>
        </Link>
    )
}

const styles = StyleSheet.create({})