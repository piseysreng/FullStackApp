import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getOnboardingStatus } from '../components/onBoardingScreen';

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const ClerkSyncedProvider = ({ children }: React.PropsWithChildren) => {
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
  const colorScheme = useColorScheme();

  const [onboardingComplete, setOnboardingCompleteStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const status = await getOnboardingStatus();
      setOnboardingCompleteStatus(status);
      setIsLoading(false);
      // SplashScreen.hideAsync(); // Hide splash screen once status is determined
    };

    checkOnboarding();
  }, []);


  useEffect(() => {
    if (!isLoading) {
      if (onboardingComplete) {
        // Redirect to home if onboarding is done
        // SplashScreen.hideAsync();
        router.replace('/(protected)/(tabs)');
      } else {
        // Redirect to onboarding if not done
        router.replace('/');
      }
    }
  }, [isLoading, onboardingComplete, router]);

  if (isLoading) {
    // Show a loading screen or splash screen while checking storage
    // SplashScreen.hideAsync();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ClerkSyncedProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Welcome', headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkSyncedProvider>
    </ClerkProvider>
  );
}
