import React, { useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Text, Button, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Pdf from 'react-native-pdf'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const onPageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page)
    setTotalPages(numberOfPages)
  }

  const onLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages)
    setLoading(false)
  }

  const onError = (error: any) => {
    setError(error.message || 'Failed to load PDF')
    setLoading(false)
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
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <View style={styles.pdfContainer}>
        <Pdf
          source={{ uri: pdfUrl }}
          onLoadComplete={onLoadComplete}
          onPageChanged={onPageChanged}
          onError={onError}
          style={styles.pdf}
        />
      </View>

      <View style={styles.footer}>
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
  },
  pdf: {
    flex: 1,
    width: width,
    height: height - 200,
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
