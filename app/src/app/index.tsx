import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '../providers/AuthProvider'
import { SignOutButton } from '../components/SignOutButton';

export default function WelcomeScreen() {

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30}}>
      <Text>Welcome Screen</Text>
      <SignOutButton/>
      <Link href='/(auth)/sign-in'>
        <Text>Go to Login</Text>
      </Link>
      <Link href='/(tabs)'>
        <Text>Go Home Screen</Text>
      </Link>
    </View>
  )
}