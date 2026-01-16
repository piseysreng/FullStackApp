import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Category } from '@/assets/TYPES'
import { categories } from '@/assets/Categories'
import CategoryListItem from './CategoryListItem'

export default function HomeSecondContainer() {
    const renderItem: ListRenderItem<Category> = ({ item }) => {
        return (
            <Link href={`/(protected)/category/${item.id.toString()}`}>
                <View>
                    <Text>{item.name}</Text>
                </View>
            </Link>
        );
    };
    return (
        <View>
            <View>
                <Text>Search Section</Text>
                <Link href='/(protected)/search'>
                    <Text style={{ color: 'orange', }}>Go To Search Page</Text>
                </Link>
            </View>
            <View>
                <Text>Banner</Text>
            </View>
            <View style={{ paddingTop: 30 }} />
            <View>
                <View>
                    <Text>Category</Text>
                    <Link href='/(protected)/category'>
                        <Text style={{ color: 'orange', }}>View All Category</Text>
                    </Link>
                </View>
                <View>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) =>
                            <View style={{ width: '30%' }}>
                                <CategoryListItem category={item} />
                            </View>
                        }
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})