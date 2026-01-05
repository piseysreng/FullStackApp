import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { productData } from '../../../assets/PRODUCTS';
import HomeSecondContainer from './homeSecondContainer';
import productListItem from '../productListItem';

export default function HomeProductContainer() {
  const numColumn = 2;

  return (
    <View style={styles.productContainer}>
      <View style={styles.productContainerList}>
        <FlatList
          data={productData}
          renderItem={productListItem}
          ListHeaderComponent={HomeSecondContainer}
          keyExtractor={item => item.id}
          numColumns={numColumn}
          contentContainerStyle={{ gap: 20, width: '100%' }}
          columnWrapperStyle={{ gap: '5%' }}
          showsVerticalScrollIndicator={false} 
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productContainer: {
    marginBottom: 30
  },
  productContainerList: {
    marginTop: 25,
  },
  
})