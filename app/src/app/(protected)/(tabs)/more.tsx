import { View, Text } from 'react-native'
import { SignOutButton } from '../../../components/SignOutButton'

export default function More() {
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Account Name</Text>
      <Text>Sign In</Text>
      <SignOutButton/>
    </View>
  )
}