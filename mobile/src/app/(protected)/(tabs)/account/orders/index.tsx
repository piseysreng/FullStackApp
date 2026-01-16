import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { orders } from '@/assets/Orders'
import OrderListItem from '@/src/components/OrderListItem'

export default function OrdersPage() {
  return (
    <View>
      <Text>OrdersPage</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) =>
          <View style={{ width: '45%' }}>
            <OrderListItem order={item} />
          </View>
        }
        keyExtractor={item => item.order_id.toString()}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})