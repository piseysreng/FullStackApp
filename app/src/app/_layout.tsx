import { Stack } from 'expo-router'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache}>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false, title: 'Welcome' }} />
          <Stack.Screen name='(auth)' options={{ headerShown: false, title: 'Auth' }} />
          <Stack.Screen name='(protected)' options={{ headerShown: false, title: 'Protected' }} />
        </Stack>
      </ClerkProvider>
    </GestureHandlerRootView>
  )
}