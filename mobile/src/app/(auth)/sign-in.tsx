import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import React from 'react'
import SignInWith from '@/src/components/SignInWithGoogle'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)

  // Step 1: Handle Email/Password Sign In
  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(protected)/(tabs)')
      } 
      else if (signInAttempt.status === 'needs_second_factor') {
        // Fix: Use nullish coalescing (?? []) to ensure we are mapping over an array
        // and find the email_code strategy
        const factors = signInAttempt.supportedFirstFactors ?? []
        const emailFactor = factors.find((f) => f.strategy === 'email_code')

        // Type check to ensure emailAddressId exists on this factor
        if (emailFactor && 'emailAddressId' in emailFactor) {
          await signInAttempt.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          })
          setVerifying(true)
        } else {
          Alert.alert("Error", "No email verification method available.")
        }
      }
    } catch (err: any) {
      Alert.alert("Sign In Error", err.errors ? err.errors[0].message : "Something went wrong")
    }
  }

  // Step 2: Handle the 2FA Code Verification
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const attemptVerification = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      })

      if (attemptVerification.status === 'complete') {
        await setActive({ session: attemptVerification.createdSessionId })
        router.replace('/(protected)/(tabs)')
      } else {
        // If it's still not complete, log why (could be 'needs_third_factor' etc)
        console.error(JSON.stringify(attemptVerification, null, 2))
      }
    } catch (err: any) {
      Alert.alert("Verification Error", err.errors ? err.errors[0].message : "Invalid code")
    }
  }

  // --- UI RENDERING ---

  // Verification Screen
  if (verifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>Enter the code sent to {emailAddress}</Text>
        
        <TextInput
          style={styles.input}
          value={code}
          placeholder="6-digit code"
          onChangeText={(code) => setCode(code)}
          keyboardType="number-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>Verify & Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 20, alignItems: 'center' }} 
          onPress={() => setVerifying(false)}
        >
          <Text style={{ color: '#007AFF' }}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Initial Sign In Screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(pass) => setPassword(pass)}
      />

      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Sign up</Text>
        </Link>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={{ marginHorizontal: 10, color: 'gray' }}>Or</Text>
        <View style={styles.line} />
      </View>

      <SignInWith />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
})