import { categories } from '@/assets/Categories';
import { products } from '@/assets/Products';
import { fetchCategoryById, listProductsByCategoryID } from '@/src/api/categories';
import ProductListItem from '@/src/components/ProductListItem';
import { Tables } from '@/src/types/database';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

export default function CategoryById() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // 1. All hooks at the TOP
    const {
        data: category,
        isLoading: isCategoryLoading,
        error: errorCategory
    } = useQuery<Tables<'categories'>>({
        queryKey: ['categories', id],
        queryFn: () => fetchCategoryById(Number(id)),
        enabled: !!id
    });

    const {
        data: productByID,
        isLoading: isLoadingProduct,
        error: errorProduct
    } = useQuery<Tables<'products'>[]>({ // Changed to Array type
        queryKey: ['products', id],
        queryFn: () => listProductsByCategoryID(Number(id)),
        // Optional: Only fetch products once the category is successfully loaded
        enabled: !!id && !!category
    });

    // 2. Conditional returns AFTER all hooks
    if (isCategoryLoading || isLoadingProduct) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (errorCategory || errorProduct) {
        return <Text>Error loading data...</Text>;
    }

    if (!category) {
        return <Text>Category not found</Text>;
    }

    const jsonString = JSON.stringify(productByID, null, 2);
    return (
        <View>
            <View>
                <Text>Category ID is : {id}</Text>
                <Text>Category Name is : {category.name}</Text>
            </View>

            <View style={{ paddingTop: 30 }} />
            <View>
                <Text>List of Product in this Category</Text>
                {/* <Text>{jsonString}</Text> */}
                <FlatList
                    data={productByID}
                    renderItem={({ item }) =>
                        <View style={{ width: '48%' }}>
                            <ProductListItem product={item} />
                        </View>
                    }
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    // contentContainerStyle={styles.flatListContent}
                    // columnWrapperStyle={styles.flatListColumn}
                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                />

            </View>
        </View>

    )
}

const styles = StyleSheet.create({})