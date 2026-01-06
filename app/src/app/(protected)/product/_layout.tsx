import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function ProductLayout() {
  return (
    <Stack>
        <Stack.Screen
            name='[id]'
            options={({navigation}) => ({
                headerShown: true,
                headerLeft: ()=> (
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                ),
            })}            
        />
    </Stack>
  )
}