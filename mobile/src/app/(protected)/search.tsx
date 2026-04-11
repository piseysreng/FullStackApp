import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';

export default function SearchPage() {

  const { q,category,featured } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ backgroundColor: 'orange' }}>
        <Text>SearchPage</Text>
        <Text>Keywords: {q}</Text>
        <Text>Category: {category}</Text>
        <Text>Featured: {featured}</Text>
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F9',
    },
})