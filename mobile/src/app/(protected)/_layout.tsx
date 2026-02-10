import { useAuth } from '@clerk/clerk-expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Redirect } from 'expo-router'
import { Stack } from 'expo-router/stack'

export default function Layout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/(auth)/sign-in'} />
  }

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{
          headerShown: true,
        }} />
      </Stack>
    </QueryClientProvider>

  );
}