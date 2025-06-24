import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitle: 'UnLok',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <Image
            source={require('@/assets/logos/logormbg.png')}
            style={{ width: 30, height: 30, marginLeft: 15 }}
            resizeMode="contain"
          />
        ),
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/icons/lock-tab.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/icons/users-tab.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/icons/bell-tab.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
