import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { categories } from '@/assets/Categories'
import CategoryListItem from '@/src/components/CategoryListItem'
import { useQuery } from '@tanstack/react-query';
import { listCategories } from '@/src/api/categories';

export default function AllCategoryPage() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories
  });
  if (isLoading) { return <ActivityIndicator /> };
  if (error) { return <Text>Error Fetching Categories</Text> };
  // console.log(data);
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