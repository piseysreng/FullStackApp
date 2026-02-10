import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router';
import { products } from '@/assets/Products';
import { useCartStore } from '@/src/store/cart-store';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/src/api/products';
import { Database, Tables } from '@/src/types/database';

export default function ProductByID() {
  const { id } = useLocalSearchParams<{ id: string }>();





  // const product = products.find(dataItem => dataItem.id === Number(id));
  const { data: product, isLoading, error } = useQuery<Tables<'products'>>({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(Number(id))
  });

  const { items, addItem, incrementItem, decrementItem, removeItem } = useCartStore();
  const cartItem = items.find(item => item.id === Number(id));
  const initialQuantity = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const favoritedProduct = false;



  if (isLoading) { return <ActivityIndicator /> };
  if (error) { return <Text>Error Fetching Products</Text> };

  // console.log(data);

  if (!product) {
    return <Text>Item not found or loading...</Text>;
  }


  const increasementQuantity = () => {
    incrementItem(product?.id);
  }
  const decreasementQuantity = () => {
    decrementItem(product.id);
  }

  const deleteFromCart = () => {
    removeItem(product.id);
  }

  const addToCart = () => {
    console.log('Add To Cart Pressed');
    addItem({
      id: product.id,
      quantity: quantity + 1,
      price: product.price,
      maxQuantity: product.stockQuantity ?? 0
    });
  }
  return (
    <View>
      <View>
        <Text>Image: {product.featureImage}</Text>
      </View>
      <View style={{ paddingTop: 10 }} />
      <View>
        <Text>Price: ${product.price}</Text>
        <Text>Name: {product.name}</Text>
        {/* <Text>Weight: {product.kilos} kg</Text> */}
      </View>
      <View>
        <Pressable onPress={() => { console.log('Favorite Press') }}>
          <Text>Favorited: {favoritedProduct && 'Yes' || 'No'}</Text>
        </Pressable>
      </View>
      <View>
        <Text>Rating Stars</Text>
      </View>
      <View>
        <Text>Description Text</Text>
        <Pressable onPress={() => { console.log('More Description Text Click') }}>
          <Text>More</Text>
        </Pressable>
      </View>
      <View>
        <Text>Quantity</Text>
        <View>
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
          </View>
        </View>
      </View>
      <View>
        {!cartItem
          &&
          <Pressable onPress={addToCart}>
            <Text>Add To Cart</Text>
          </Pressable>
          ||
          <View>
            <Pressable onPress={deleteFromCart}>
              <Text>Delete</Text>
            </Pressable>
            <View>
              <Link href='/(protected)/(tabs)/cart'>
                <Text>Go To Cart</Text>
              </Link>
            </View>
          </View>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})