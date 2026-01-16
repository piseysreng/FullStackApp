import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { useCartStore } from '@/src/store/cart-store';

export default function TabsLayouts() {
    const { getItemCount } = useCartStore();
    const notificationNumber = getItemCount();
    return (
        <Tabs>
            <Tabs.Screen name='index' options={{
                title: 'Home',
            }} />
            <Tabs.Screen name='account' options={{
                title: 'Account',
            }} />
            <Tabs.Screen name='favorite' options={{
                title: 'Favorite',
            }} />
            <Tabs.Screen name='cart' options={{
                title: 'Cart',
                tabBarBadge: notificationNumber > 0 ? notificationNumber : undefined,
            }} />
        </Tabs>
    )
}