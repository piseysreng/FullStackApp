import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeProductContainer from '../../../components/HomeScreen/homeProductContainer';


export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={styles.safeViewStyle}>
          <View style={styles.container}>
            <HomeProductContainer />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeViewStyle: {
    backgroundColor: 'white',
    minHeight: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
});


