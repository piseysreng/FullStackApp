import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SignOutButton } from '@/src/components/SignOutButton'
import { resetOnboardingStatus } from '@/src/components/onBoardingScreen';

export default function FavoritePage() {
  const clearWelcomeScreen = async () => {
    await resetOnboardingStatus();
    Alert.alert('Clear Already');
  }
  return (
    <View>
      <Text>FavoritePage</Text>
      <View style={{ paddingTop: 50, }}>
        <SignOutButton />
        <Pressable onPress={clearWelcomeScreen}>
          <Text>Clear Welcome Screen</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})