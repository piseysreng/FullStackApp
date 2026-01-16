import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

export default function AboutMe() {
  return (
    <View>
      <View>
        <Text>Personal Details</Text>
        <TextInput placeholder='Russell Austin'/>
        <TextInput placeholder='russell.partner@gmail.com'/>
        <TextInput placeholder='+1 202 555 0142'/>
      </View>
      <View>
        <Text>Change Password</Text>
        <TextInput placeholder='Current Password'/>
        <TextInput placeholder='*******'/>
        <TextInput placeholder='Confirm Password'/>
      </View>
      <View>
        <Pressable onPress={()=> {console.log('Save Setting Pressed')}}>
            <Text>Save Settings</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})