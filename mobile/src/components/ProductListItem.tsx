import { Product } from '@/assets/TYPES'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCartStore } from '../store/cart-store';
import { useState } from 'react';

export default function ProductListItem({ product }: { product: Product }) {
  const { items, addItem, incrementItem, decrementItem, removeItem } = useCartStore();
  const cartItem = items.find(item => item.id === product?.id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const favoritedProduct = product.favorites;

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
      maxQuantity: product.quantity
    });
  }

  return (
    <Link style={{ backgroundColor: 'green', padding: 10, margin: 5 }} href={`/(protected)/product/${product.id.toString()}`}>
      <View>
        <View>
          <Text>Status: New</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => { console.log('Favorite Click') }}>
            <Text>Favorited: {favoritedProduct && 'Yes' || 'No'}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>Image</Text>
        </View>
        <View>
          <Text>Price: ${product.price}</Text>
        </View>
        <Text>{product.name}</Text>
        <Text>Weight: {product.kilos} kg</Text>
        <View>
          <View>
            {!cartItem
              &&
              <View>
                <Pressable onPress={addToCart}><Text>Add To Cart</Text></Pressable>
              </View>
              ||
              <View>
                <View>
                  <Pressable onPress={decreasementQuantity}>
                    <Text>-</Text>
                  </Pressable>
                </View>
                <View><Text>{initialQuantity}</Text></View>
                <View>
                  <Pressable onPress={increasementQuantity}>
                    <Text>+</Text>
                  </Pressable>
                </View>
                <View>
                  <Pressable onPress={deleteFromCart}>
                    <Text>Delete</Text>
                  </Pressable>
                </View>
              </View>
            }
          </View>
        </View>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({})