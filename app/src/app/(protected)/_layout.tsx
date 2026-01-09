import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function ProtectedLayout() {

    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Redirect href={'/(auth)/sign-in'} />
    };

    return (
        <Stack>
            <Stack.Screen name='(tabs)' options={{
                title: 'Shop',
                headerShown: false
            }} />
            <Stack.Screen name='category' options={{
                title: 'Category',
                headerShown: false
            }} />
            <Stack.Screen name='product' options={{
                title: 'Product',
                headerShown: false
            }} />
        </Stack>
    )
}

const styles = StyleSheet.create({})