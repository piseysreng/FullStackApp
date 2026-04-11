import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { useCartStore } from '@/src/store/cart-store';
import HomeIcon from '@/src/components/icons/homeIcon';
import UserIcon from '@/src/components/icons/userIcon';
import HeartIcon from '@/src/components/icons/heartIcon';
import CartIcon from '@/src/components/icons/cartIcon';

export default function TabsLayouts() {
    const { getItemCount } = useCartStore();
    const notificationNumber = getItemCount();
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: '#6CC51D',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e2e2e2',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: -4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 20,
                height: 70,
                paddingBottom: 10,
                paddingTop: 10,
            },
        }}>
            <Tabs.Screen name='index' options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <HomeIcon color={color} width={size} height={size} />
                ),
            }} />
            <Tabs.Screen name='account' options={{
                title: 'Account',
                tabBarIcon: ({ color, size }) => (
                    <UserIcon color={color} width={34} height={34} />
                ),
            }} />
            <Tabs.Screen name='favorite' options={{
                title: 'Favorite',
                tabBarIcon: ({ color, size }) => (
                    <HeartIcon color={color} width={33} height={33} />
                ),
            }} />
            <Tabs.Screen name='cart' options={{
                title: 'Cart',
                tabBarBadge: notificationNumber > 0 ? notificationNumber : undefined,
                tabBarBadgeStyle: {
                    backgroundColor: '#6CC51D',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 'bold',
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    
                    textAlign: 'center',
                    textAlignVertical: 'center', 
                    lineHeight: 18,      
                    padding: 0,
                },
                tabBarIcon: ({ color, size }) => (
                    <CartIcon color={color} width={33} height={33} />
                ),
            }} />
        </Tabs>
    )
}