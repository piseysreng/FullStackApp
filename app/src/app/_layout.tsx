import { Stack } from 'expo-router'
import { AuthProvider } from '../providers/AuthProvider'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false, title: 'Welcome' }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false, title: 'Auth' }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false, title: 'Shop' }} />
        <Stack.Screen name='category' options={{ headerShown: false, title: 'Category' }} />
        <Stack.Screen name='product' options={{ headerShown: false, title: 'Product' }} />
      </Stack>
    </AuthProvider>
  )
}