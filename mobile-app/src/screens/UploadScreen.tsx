import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Button, Card, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker'

export default function UploadScreen({ navigation }: any) {
  const [uploading, setUploading] = useState(false)

  const pickDocument = async () => {
    try {
      setUploading(true)
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]
        
        // Navigate to PDF viewer with the selected file
        navigation.navigate('PDFViewer', {
          pdfUrl: file.uri,
          fileName: file.name || 'Document.pdf'
        })
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document')
      console.error('Document picker error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Upload PDF Document
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Select a PDF file from your device to view and manage
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={pickDocument}
              loading={uploading}
              disabled={uploading}
              style={styles.button}
            >
              {uploading ? 'Selecting...' : 'Select PDF'}
            </Button>
          </Card.Actions>
        </Card>

        {uploading && (
          <View style={styles.progressContainer}>
            <ProgressBar indeterminate />
            <Text style={styles.progressText}>Processing document...</Text>
          </View>
        )}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              Supported Features
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              • View PDF documents{'\n'}
              • Print PDFs{'\n'}
              • Share PDFs{'\n'}
              • Open in external apps
            </Text>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 16,
    padding: 16,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  infoCard: {
    marginTop: 16,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#666',
    lineHeight: 20,
  },
})
