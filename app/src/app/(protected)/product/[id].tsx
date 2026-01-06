import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function Product() {
  const {id} = useLocalSearchParams();
  // Query the Detail of Single Product
  
  return (
    <View>
      <Text>Product ID: {id}</Text>
    </View>
  )
}