import React, { useState, useRef } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Button, Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera, CameraType } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

interface CameraScreenProps {
  navigation: any
}

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.back)
  const cameraRef = useRef<Camera>(null)

  React.useEffect(() => {
    getCameraPermissions()
  }, [])

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        })
        
        // Navigate to photo processing screen
        navigation.navigate('PhotoToPDF', { imageUri: photo.uri })
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture')
      }
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      navigation.navigate('PhotoToPDF', { imageUri: result.assets[0].uri })
    }
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No access to camera</Text>
          <Button mode="contained" onPress={getCameraPermissions}>
            Grant Permission
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.topControls}>
              <Button
                mode="contained"
                onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
                style={styles.flipButton}
              >
                Flip
              </Button>
            </View>
            
            <View style={styles.bottomControls}>
              <Button
                mode="contained"
                onPress={pickImage}
                style={styles.galleryButton}
              >
                Gallery
              </Button>
              
              <Button
                mode="contained"
                onPress={takePicture}
                style={styles.captureButton}
              >
                Capture
              </Button>
            </View>
          </View>
        </Camera>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 80,
    height: 80,
  },
})
