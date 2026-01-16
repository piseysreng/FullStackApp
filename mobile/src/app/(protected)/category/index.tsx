import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { categories } from '@/assets/Categories'
import CategoryListItem from '@/src/components/CategoryListItem'

export default function AllCategoryPage() {
  return (
    <View>
      <Text>AllCategoryPage</Text>
      <View>
        <FlatList
          data={categories}
          renderItem={({ item }) =>
            <View style={{ width: '48%' }}>
              <CategoryListItem category={item} />
            </View>
          }
          keyExtractor={item => item.id.toString()}
          style={{ paddingHorizontal: 10, paddingVertical: 5 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})