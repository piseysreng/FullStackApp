import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image';
import { PlusIcon } from '../components/tabIcons';
import { Link } from 'expo-router';

const productListItem = ({ item }) => {
  const imageUrl = 'https://www.solarelli.it/wp-content/uploads/2017/03/arance_500x500pixel-300x300.png';
  return (
    <Link asChild href={`/product/${item.id}`}>
      <Pressable style={{ width: '47.5%' }} >
        <View style={styles.productItemContainer}>
          <View style={styles.productItemContainerImage}>
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: 100 }}
            />
          </View>
          <Text style={styles.productItemContainerTitle}>{item.name}</Text>
          <Text style={styles.productItemContainerCalories}>{item.calories} cal</Text>
          <View style={styles.productItemContainerBottom}>
            <Text style={styles.productItemContainerBottomPrice}>${item.price.toFixed(2)}<Text style={{ fontWeight: '200' }}>/</Text><Text style={styles.productItemContainerBottomKilo}>Kg</Text></Text>
            <View style={styles.productItemContainerBottomPlusButton}>
              <Pressable onPress={() => { console.log('Plus Button Clicked') }}>
                <PlusIcon color={'#ca6608ff'} width={30} height={30} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

export default productListItem

const styles = StyleSheet.create({
  productItemContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f3f3f3ff',
    borderRadius: 15
  },
  productItemContainerImage: {
    display: 'flex',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productItemContainerTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#272626ff',
    marginBottom: 2
  },
  productItemContainerCalories: {
    color: '#747272ff',
    fontSize: 12,
    marginBottom: 0
  },
  productItemContainerBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  productItemContainerBottomPrice: {
    fontWeight: 'bold',
    color: '#ca6608ff',
    fontSize: 18
  },
  productItemContainerBottomKilo: {
    fontSize: 10,
    fontWeight: '400'
  },
  productItemContainerBottomPlusButton: {}
})