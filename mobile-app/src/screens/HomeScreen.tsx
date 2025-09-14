import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Card, Button, FAB } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../contexts/AuthContext'

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            PDF Editor & AI Enhancer
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {user ? `Welcome back, ${user.email}` : 'Please sign in to continue'}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Upload PDF
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Upload and view your PDF documents
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Upload')}
              >
                Upload
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                AI Resume Enhancer
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Enhance your resume with AI-powered improvements
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('ResumeEnhancer')}
              >
                Enhance
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Photo to PDF
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Convert photos to structured PDF documents
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('PhotoToPDF')}
              >
                Convert
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                My Documents
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                View and manage your PDF documents
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Documents')}
              >
                View
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>

      <FAB
        icon="camera"
        style={styles.fab}
        onPress={() => navigation.navigate('Camera')}
      />
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
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
