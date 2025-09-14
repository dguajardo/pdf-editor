'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PDFUpload } from '@/components/pdf-editor/PDFUpload'
import { SimplePDFViewer } from '@/components/pdf-editor/SimplePDFViewer'
import { ResumeEnhancer } from '@/components/ai-features/ResumeEnhancer'
import { PhotoToPDFConverter } from '@/components/ai-features/PhotoToPDFConverter'
import { useAuth } from '@/contexts/AuthContext'
import { FileText, Wand2, Camera, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null)
  const [currentFileName, setCurrentFileName] = useState<string>('')
  const [activeTab, setActiveTab] = useState('upload')

  const handleUploadComplete = (fileUrl: string, fileName: string) => {
    console.log('Upload complete:', { fileUrl, fileName })
    setCurrentFileUrl(fileUrl)
    setCurrentFileName(fileName)
    setActiveTab('viewer')
    toast.success('PDF uploaded successfully!')
  }

  const handleUploadError = (error: string) => {
    toast.error(error)
  }

  const handleEditPDF = () => {
    setActiveTab('editor')
    toast.info('PDF editor opened')
  }

  const handleEnhancedResume = () => {
    toast.success('Resume enhanced! You can now copy or download the result.')
  }

  const handleConvertedPDF = (pdfUrl: string, fileName: string) => {
    setCurrentFileUrl(pdfUrl)
    setCurrentFileName(fileName)
    setActiveTab('viewer')
    toast.success('Image converted to PDF successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">PDF Editor & AI Enhancer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <Button variant="outline" size="sm">
                    {user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Sign In</Button>
                  <Button size="sm">Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="viewer" className="flex items-center space-x-2" disabled={!currentFileUrl}>
              <FileText className="h-4 w-4" />
              <span>Viewer</span>
            </TabsTrigger>
            <TabsTrigger value="ai-resume" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>AI Resume</span>
            </TabsTrigger>
            <TabsTrigger value="photo-pdf" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Photo to PDF</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your PDF Document
              </h2>
              <p className="text-lg text-gray-600">
                Get started by uploading a PDF file to view, edit, or enhance with AI
              </p>
            </div>
            <PDFUpload 
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
            />
          </TabsContent>

          <TabsContent value="viewer" className="mt-6">
            {currentFileUrl ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentFileName}
                  </h2>
                  <Button onClick={handleEditPDF}>
                    Edit PDF
                  </Button>
                </div>
                <SimplePDFViewer 
                  fileUrl={currentFileUrl} 
                  fileName={currentFileName}
                  onEdit={handleEditPDF}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF loaded</h3>
                <p className="text-gray-600">Upload a PDF file to get started</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-resume" className="mt-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Resume Enhancer
              </h2>
              <p className="text-lg text-gray-600">
                Enhance your resume with AI-powered improvements for better ATS compatibility and impact
              </p>
            </div>
            <ResumeEnhancer onEnhanced={handleEnhancedResume} />
          </TabsContent>

          <TabsContent value="photo-pdf" className="mt-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Photo to PDF Converter
              </h2>
              <p className="text-lg text-gray-600">
                Convert photos and images into structured PDF documents using AI
              </p>
        </div>
            <PhotoToPDFConverter onConverted={handleConvertedPDF} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}