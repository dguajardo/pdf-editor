import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'

import HomeScreen from '../screens/HomeScreen'
import PDFViewerScreen from '../screens/PDFViewerScreen'
import CameraScreen from '../screens/CameraScreen'
import UploadScreen from '../screens/UploadScreen'
import { useAuth } from '../contexts/AuthContext'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Camera') {
            iconName = 'camera-alt'
          } else if (route.name === 'Documents') {
            iconName = 'folder'
          } else if (route.name === 'Settings') {
            iconName = 'settings'
          } else {
            iconName = 'help'
          }

          return <MaterialIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ title: 'Camera' }}
      />
      <Tab.Screen 
        name="Documents" 
        component={HomeScreen} // Placeholder
        options={{ title: 'Documents' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={HomeScreen} // Placeholder
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Upload" 
          component={UploadScreen}
          options={{ 
            title: 'Upload PDF',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="PDFViewer" 
          component={PDFViewerScreen}
          options={{ 
            title: 'PDF Viewer',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="PhotoToPDF" 
          component={HomeScreen} // Placeholder
          options={{ 
            title: 'Convert to PDF',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="ResumeEnhancer" 
          component={HomeScreen} // Placeholder
          options={{ 
            title: 'Resume Enhancer',
            headerBackTitle: 'Back'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
