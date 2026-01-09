import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

// function App() {
//   return <Animated.View entering={FadeIn} exiting={FadeOut} />;
// }

const onBoardingSteps = [
  {
    icon: 'people-arrows',
    title: 'Welcome to December',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor',
  },
  {
    icon: 'snowflake',
    title: 'Track Every Transaction',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor',
  },
  {
    icon: 'star',
    title: 'Learn and Grow Together',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor',
  },
];

export default function WelcomeScreen() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [screenIndex, setScreenIndex] = useState(0);
  const data = onBoardingSteps[screenIndex];
  const onContinue = () => {
    const isLastScreen = screenIndex === onBoardingSteps.length - 1;
    if (isLastScreen) {
      router.replace('/(auth)/sign-in');
    } else {
      setScreenIndex(screenIndex + 1);
    }
  }
  const onContinueSwipe = () => {
    const isLastScreen = screenIndex === onBoardingSteps.length - 1;
    if (isLastScreen) {
      setScreenIndex(0);
    } else {
      setScreenIndex(screenIndex + 1);
    }
  }

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnBoarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  }
  const onBackSwipe = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      setScreenIndex(onBoardingSteps.length - 1);
    } else {
      setScreenIndex(screenIndex - 1);
    }
  }

  const endOnBoarding = () => {
    router.replace('/(auth)/sign-in');
    setScreenIndex(0);
  }

  const swipeForward = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(onContinueSwipe);
    // .onEnd(onContinue);

  const swipeBack = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(onBackSwipe);
    // .onEnd(onBack);

  const swipes = Gesture.Simultaneous(swipeBack, swipeForward);
  return (
    <GestureDetector gesture={swipes}>
      <SafeAreaView style={styles.page}>
        <Animated.View style={styles.pageContent} entering={FadeIn} exiting={FadeOut} key={screenIndex} >
          <View style={styles.stepIndicatorContainer}>
            {onBoardingSteps.map((step, index) => (
              <View key={index} style={[styles.stepIndicator, { backgroundColor: index === screenIndex ? 'orange' : 'grey' }]} />
            ))}
          </View>
          <FontAwesome5 style={styles.image} name={data.icon} size={100} color="orange" />
          <View style={styles.footer}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>
          <View style={styles.buttonRow}>
            <Text onPress={endOnBoarding} style={styles.buttonText}>Skip</Text>
            <Pressable onPress={onContinue} style={styles.buttonNext}>
              <Text style={styles.buttonNextText}>Continue</Text>
            </Pressable>
          </View>
          {/* {isSignedIn && <Link href='/(tabs)'><Text>Go Home Screen</Text></Link> || <Link href='/(auth)/sign-in'><Text>Go to Login</Text></Link>} */}
        </Animated.View>


      </SafeAreaView>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#15141a',
  },
  pageContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  image: {
    alignSelf: 'center',
    margin: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  title: {
    color: '#fdfdfd',
    marginVertical: 20,
    fontSize: 46,
    fontWeight: 'bold'
  },
  description: {
    color: 'grey',
    fontSize: 20,
    lineHeight: 25
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  buttonNext: {
    backgroundColor: 'grey',
    flex: 1,
    borderRadius: 50
  },
  buttonNextText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    gap: 3
  },
  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'gray',
    borderRadius: 10
  },
});