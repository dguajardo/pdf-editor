import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Linking, Alert } from 'react-native'
import { Text, Button, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'

interface PDFViewerScreenProps {
  route: {
    params: {
      pdfUrl: string
      fileName: string
    }
  }
  navigation: any
}

export default function PDFViewerScreen({ route, navigation }: PDFViewerScreenProps) {
  const { pdfUrl, fileName } = route.params
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openPDF = async () => {
    try {
      setLoading(true)
      await Linking.openURL(pdfUrl)
    } catch (err) {
      setError('Failed to open PDF')
    } finally {
      setLoading(false)
    }
  }

  const printPDF = async () => {
    try {
      setLoading(true)
      await Print.printAsync({ uri: pdfUrl })
    } catch (err) {
      setError('Failed to print PDF')
    } finally {
      setLoading(false)
    }
  }

  const sharePDF = async () => {
    try {
      setLoading(true)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUrl)
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device')
      }
    } catch (err) {
      setError('Failed to share PDF')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ProgressBar indeterminate />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.fileName}>
          {fileName}
        </Text>
        <Text variant="bodySmall" style={styles.pageInfo}>
          PDF Document
        </Text>
      </View>

      <View style={styles.pdfContainer}>
        <View style={styles.placeholder}>
          <Text variant="headlineSmall" style={styles.placeholderText}>
            📄 PDF Viewer
          </Text>
          <Text variant="bodyMedium" style={styles.placeholderSubtext}>
            Tap "Open PDF" to view in your default PDF app
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={openPDF}
          style={styles.button}
          loading={loading}
        >
          Open PDF
        </Button>
        <Button 
          mode="outlined" 
          onPress={printPDF}
          style={styles.button}
          loading={loading}
        >
          Print
        </Button>
        <Button 
          mode="outlined" 
          onPress={sharePDF}
          style={styles.button}
          loading={loading}
        >
          Share
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Close
        </Button>
      </View>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pageInfo: {
    color: '#666',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    textAlign: 'center',
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    marginVertical: 4,
  },
})
