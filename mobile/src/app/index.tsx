import { setOnboardingComplete } from '../components/onBoardingScreen';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = () => {
  const router = useRouter();
  return (
    <Onboarding
      pages={[
        {
          backgroundColor: '#fff',
          image: <View><Text>Image 1</Text></View>,
          title: 'Connect with the World',
          subtitle: 'A new way to connect with people around the globe.',
        },
        {
          backgroundColor: '#fe6e58',
          image: <View><Text>Image 2</Text></View>,
          title: 'Share Your Favorites',
          subtitle: 'Share your thoughts and favorite items easily.',
        },
        {
          backgroundColor: '#999',
          image: <View><Text>Image 3</Text></View>,
          title: 'Experience Seamlessness',
          subtitle: 'Jump into the app and start exploring!',
        },
      ]}
      onSkip={async () => {
        await setOnboardingComplete();
        router.replace('/(protected)/(tabs)')
      }} 
      onDone={async() => {
        await setOnboardingComplete();
        router.replace('/(protected)/(tabs)')
      }} 
    />
  );
};

export default OnboardingScreen;
