import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Category } from '@/assets/TYPES'
import { Link } from 'expo-router'
import FontCustomRegular from './fonts/FontCustomRegular'

export default function CategoryListItem({ category, Icon }: { category: Category , Icon: any}) {
  return (
    <Link href={`/(protected)/category/${category.id.toString()}`} >
      <View style={styles.container}>
        <View>
          {Icon ? <Icon /> : <View style={{ width: 20, height: 20, backgroundColor: 'gray' }} />}
        </View>
        <FontCustomRegular style={styles.text}>{category.name}</FontCustomRegular>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'grey',
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 9,
    color: 'grey'
  }
})