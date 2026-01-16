import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
export default function AuthLayout() {

  const { isSignedIn, isLoaded } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/(protected)/(tabs)'} />
  }

  if (!isLoaded) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
    SplashScreen.hideAsync();
  }

  return (
    <Stack>
      <Stack.Screen name='sign-in' options={{
        headerShown: false
      }} />
      <Stack.Screen name='sign-up' options={{
        headerShown: false
      }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})