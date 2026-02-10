import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Link, useRouter } from 'expo-router';
import { resetOnboardingStatus } from '@/src/components/onBoardingScreen';
import { SignOutButton } from '@/src/components/SignOutButton';
// import { products } from '@/assets/Products';
import ProductListItem from '@/src/components/ProductListItem';
import HomeSecondContainer from '@/src/components/HomeSecondContainer';
import {useQuery} from '@tanstack/react-query';
import { listProducts } from '@/src/api/products';


export default function ShopPage() {
    const router = useRouter();
    const {data: products , isLoading, error} = useQuery({
        queryKey: ['products'],
        queryFn: listProducts
    });
    if (isLoading) {return <ActivityIndicator />};
    if (error) {return <Text>Error Fetching Products</Text>};
    
    console.log(products);
    
    return (
        <View>
            <View>
                <FlatList
                    data={products}
                    renderItem={({ item }) =>
                        <View style={{ width: '48%' }}>
                            <ProductListItem product={item} />
                        </View>
                    }
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    ListHeaderComponent={<HomeSecondContainer />}
                    // contentContainerStyle={styles.flatListContent}
                    // columnWrapperStyle={styles.flatListColumn}
                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})