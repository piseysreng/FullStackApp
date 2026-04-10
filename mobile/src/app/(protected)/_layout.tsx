import { PaymentProvider } from '@/src/hooks/paymentProvider'
import { useAuth } from '@clerk/clerk-expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Redirect } from 'expo-router'
import { Stack } from 'expo-router/stack'

const queryClient = new QueryClient();

export default function Layout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/(auth)/sign-in'} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaymentProvider>
        <Stack>
          <Stack.Screen name='(tabs)' options={{
            headerShown: true,
          }} />

        </Stack>
      </PaymentProvider>
    </QueryClientProvider>

  );
}