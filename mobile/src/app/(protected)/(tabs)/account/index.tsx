import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SignOutButton } from '@/src/components/SignOutButton'

export default function AccountPage() {
  return (
    <View>
      <View>
        <Text>Profile Image</Text>
      </View>
      <View>
        <View><Link href='/(protected)/(tabs)/account/about-me'><Text>About Me</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/account/orders'><Text>My Orders</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/favorite'><Text>My Favorites</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/account/address'><Text>My Address</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/account/credit-card'><Text>Credit Cards</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/account/transactions'><Text>Transactions</Text></Link></View>
        <View><Link href='/(protected)/(tabs)/account/notifications'><Text>Notifications</Text></Link></View>
        <View><SignOutButton/></View>
        
      </View>
      <Text>AccountPage</Text>
    </View>
  )
}

const styles = StyleSheet.create({})