import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Link, useRouter } from 'expo-router';
import { resetOnboardingStatus } from '@/src/components/onBoardingScreen';
import { SignOutButton } from '@/src/components/SignOutButton';
// import { products } from '@/assets/Products';
import ProductListItem from '@/src/components/ProductListItem';
import HomeSecondContainer from '@/src/components/HomeSecondContainer';
import { useQuery } from '@tanstack/react-query';
import { listProducts } from '@/src/api/products';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';


export default function ShopPage() {
    const router = useRouter();
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: listProducts
    });
    if (isLoading) { return <ActivityIndicator /> };
    if (error) { return <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'white'}}><Text>Error Fetching Products</Text></View> };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            <View style={{backgroundColor: 'transparent', flex: 1}}>
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
                    contentContainerStyle={styles.flatListContent}
                    // columnWrapperStyle={styles.flatListColumn}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFCFD',
        // backgroundColor: 'orange',
    },
    flatListContent: {
        // backgroundColor: 'lightgrey',
        paddingHorizontal: 15,
        paddingBottom: 50, // This ensures the last item isn't hidden by the Tab Bar
    }
})