import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../../providers/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href='/(tabs)' />
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