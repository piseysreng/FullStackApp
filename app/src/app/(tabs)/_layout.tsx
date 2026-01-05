import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { CartIcon, HomeIcon, MoreIcon, OrderIcon } from '../../components/tabIcons'
import Colors from '../../components/colorCode';
import { useAuth } from '../../providers/AuthProvider';

export default function tabLayout() {
    const {isAuthenticated} = useAuth();
    if (!isAuthenticated) {
        return <Redirect href='/(auth)/sign-in' />
    }
    
    return (
            <Tabs screenOptions={{
                tabBarStyle: {
                    height: 105,
                    backgroundColor: Colors.background,
                    paddingVertical: 0,
                    // borderTopColor: 'transparent',
                },
                tabBarIconStyle: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarActiveTintColor: Colors.textWhite,
                tabBarInactiveTintColor: Colors.textGrey,
                tabBarLabelStyle: {
                    width: '100%',
                    textAlignVertical: 'center',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
            }}>
                <Tabs.Screen
                    name='index'
                    options={{
                        headerShown: false,
                        title: 'Home',
                        tabBarIcon: ({ focused }) => <HomeIcon height={23} width={23} color={focused ? Colors.textWhite : Colors.textGrey} />,
                    }}
                />
                <Tabs.Screen
                    name='order'
                    options={{
                        headerShown: false,
                        title: 'Order',
                        tabBarIcon: ({ focused }) => <OrderIcon height={23} width={23} color={focused ? Colors.textWhite : Colors.textGrey} />,
                    }}
                />
                <Tabs.Screen
                    name='cart'
                    options={{
                        headerShown: false,
                        title: 'My Cart',
                        tabBarIcon: ({ focused }) => <CartIcon height={23} width={23} color={focused ? Colors.textWhite : Colors.textGrey} />,
                        tabBarBadge: 3, 
                    }}
                />
                <Tabs.Screen
                    name='more'
                    options={{
                        headerShown: false,
                        title: 'More',
                        tabBarIcon: ({ focused }) => <MoreIcon height={23} width={23} color={focused ? Colors.textWhite : Colors.textGrey} />,
                    }}
                />
            </Tabs>

    )
}