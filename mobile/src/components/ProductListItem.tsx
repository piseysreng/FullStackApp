import { Product } from '@/assets/TYPES'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native'
import { useCartStore } from '../store/cart-store';
import { useState } from 'react';
import { Tables } from '../types/database';
import { TEST_IMAGES } from '@/assets/images/ImageArray';
import FontCustomRegular from './fonts/FontCustomRegular';
import { Ionicons } from '@expo/vector-icons';
import FontCustomMedium from './fonts/FontCustomMedium';
import FontCustomBold from './fonts/FontCustomBold';
import AddToCartIcon from './icons/addToCartIcon';
import DeleteIcon from './icons/deleteIcon';
import MinusIcon from './icons/minusIcon';
import PlusIcon from './icons/plusIcon';

export default function ProductListItem({ product, index }: { product: Tables<'products'>, index: number }) {
  const { items, addItem, incrementItem, decrementItem, removeItem } = useCartStore();
  const cartItem = items.find(item => item.id === product?.id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const favoritedProduct = false;
  const imageSource = TEST_IMAGES[index % TEST_IMAGES.length];

  const increasementQuantity = () => {
    incrementItem(product.id);
  }
  const decreasementQuantity = () => {
    decrementItem(product.id);
  }

  const deleteFromCart = () => {
    removeItem(product.id);
  }

  const addToCart = () => {
    addItem({
      id: product.id,
      quantity: quantity + 1,
      price: product.price,
      maxQuantity: product.stockQuantity ?? 0
    });
  }

  return (
    <Link
      style={{
        // flex: 1,
        width: '48%',
        backgroundColor: 'white', padding: 0, margin: 0, // --- iOS Shadow ---
        ...Platform.select({
          ios: {
            shadowColor: 'rgb(149, 157, 165)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 24,
          },
          android: {
            elevation: 8, // Android is less granular; 8 provides a medium-soft lift
          },
        }),
      }} href={`/(protected)/product/${product.id.toString()}`}
      asChild>
      <Pressable style={{}}>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'lightgreen', paddingHorizontal: 10, paddingVertical: 1 }}>
              <FontCustomRegular style={{ textTransform: 'uppercase', fontSize: 10, color: 'green' }}>New</FontCustomRegular>
            </View>
            <View style={styles.favoriteContainer}>
              <TouchableOpacity onPress={() => { console.log('Favorite Click') }}>
                <Ionicons
                  name={favoritedProduct ? "heart" : "heart-outline"}
                  size={20}
                  color={favoritedProduct ? "#FF4444" : "#888"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <FontCustomMedium style={{ color: '#6CC51D', fontSize: 14, textAlign: 'center' }}>${Number(product.price).toFixed(2)}</FontCustomMedium>
          </View>
          <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            <FontCustomBold style={{ textAlign: 'center', fontSize: 14 }}>
              {product.name}
            </FontCustomBold>
          </View>
          {/* <Text>Weight: {product.kilos} kg</Text> */}
          <View style={{ borderTopColor: '#EBEBEB', borderTopWidth: 1, padding: 10 }}>
            <View>
              {!cartItem
                &&
                <View style={{ alignItems: 'center' }}>
                  <Pressable onPress={addToCart}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <AddToCartIcon />
                      <FontCustomMedium>Add to cart</FontCustomMedium>
                    </View>
                  </Pressable>
                </View>
                ||
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{display: 'flex', flexDirection: 'row', gap: 25, alignItems: 'center'}}>
                    <View>
                      <Pressable onPress={decreasementQuantity}>
                        <MinusIcon/>
                      </Pressable>
                    </View>
                    <View>
                      <FontCustomMedium>{initialQuantity}</FontCustomMedium>
                      </View>
                    <View>
                      <Pressable onPress={increasementQuantity}>
                        <PlusIcon/>
                      </Pressable>
                    </View>
                  </View>
                  <View>
                    <Pressable onPress={deleteFromCart}>
                      <DeleteIcon/>
                    </Pressable>
                  </View>
                </View>
              }
            </View>
          </View>
        </View>
      </Pressable>

    </Link>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  productImage: {
    width: 100,
    height: 100
  },
  favoriteContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1, // Ensure it stays on top of the image
  },
})