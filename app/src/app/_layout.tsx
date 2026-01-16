import { Redirect, Slot, SplashScreen, Stack, useRouter } from 'expo-router'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { getOnboardingStatus } from '../components/onBoardingStatus';

SplashScreen.preventAutoHideAsync();

const ClerkSyncedProvider = ({ children }) => {
  const { isLoaded } = useAuth(); // Clerk's hook to check if auth state is loaded

  useEffect(() => {
    if (isLoaded) {
      // Hide the splash screen once authentication state is determined
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return children;
};

export default function RootLayout() {


  const [onboardingComplete, setOnboardingCompleteStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const checkOnboarding = async () => {
      const status = await getOnboardingStatus();
      setOnboardingCompleteStatus(status);
      setIsLoading(false);
      SplashScreen.hideAsync(); // Hide splash screen once status is determined
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (onboardingComplete) {
        // Redirect to home if onboarding is done
        SplashScreen.hideAsync();
        router.replace('/(protected)/(tabs)');
      } else {
        // Redirect to onboarding if not done
        router.replace('/welcome');
      }
    }
  }, [isLoading, onboardingComplete, router]);

  if (isLoading) {
    // Show a loading screen or splash screen while checking storage
    SplashScreen.hideAsync();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (

    <ClerkProvider tokenCache={tokenCache}>
      <ClerkSyncedProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack></Stack>
        </GestureHandlerRootView>
      </ClerkSyncedProvider>
    </ClerkProvider>

  )
}