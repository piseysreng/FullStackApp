import { categories } from '@/assets/Categories';
import { products } from '@/assets/Products';
import ProductListItem from '@/src/components/ProductListItem';
import { useCartStore } from '@/src/store/cart-store';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native'

export default function CategoryById() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const category = categories.find(dataItem => dataItem.id === Number(id));
    if (!category) {
        return <Text>Item not found or loading...</Text>;
    }
    const productByID = products.filter(dataItem => dataItem.category_id === Number(category.id));

    if (!productByID) {
        console.log('No Products in this category');
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