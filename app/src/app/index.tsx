import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo';

export default function WelcomeScreen() {
  const { isSignedIn } = useAuth();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30}}>
      <Text>Welcome Screen</Text>
      {isSignedIn && <Link href='/(tabs)'><Text>Go Home Screen</Text></Link> || <Link href='/(auth)/sign-in'><Text>Go to Login</Text></Link>}
    </View>
  )
}