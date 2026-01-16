import { View, Text, Pressable } from 'react-native'
import { SignOutButton } from '../../../components/SignOutButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { resetOnboardingStatus } from '../../../components/onBoardingStatus';


export default function More() {
  const router = useRouter();
  const clearWelcomeScreen = async ()=>{
    await resetOnboardingStatus();
    router.replace('/welcome');
  };
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Account Name</Text>
      <Text>Sign In</Text>
      <SignOutButton/>
      <Pressable onPress={clearWelcomeScreen}>
        <Text>Clear Welcome Screen</Text>
      </Pressable>
    </View>
  )
}