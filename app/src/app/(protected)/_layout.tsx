import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {

    const { isSignedIn, isLoaded } = useAuth()

    if (!isSignedIn) {
        return <Redirect href={'/(auth)/sign-in'} />
    };

    if (!isLoaded) {
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        SplashScreen.hideAsync();
    }

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