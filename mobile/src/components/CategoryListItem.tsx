import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Category } from '@/assets/TYPES'
import { Link } from 'expo-router'

export default function CategoryListItem({ category }: { category: Category }) {
  return (
    <Link href={`/(protected)/category/${category.id.toString()}`} style={{ padding: 10, backgroundColor: 'grey'}}>
      <View style={styles.container}>
        <Text>Image</Text>
        <Text>{category.name}</Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue'
  }
})