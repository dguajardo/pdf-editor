'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Upload, Image, FileText, Download, X } from 'lucide-react'
import { toast } from 'sonner'

interface PhotoToPDFConverterProps {
  onConverted?: (pdfUrl: string, fileName: string) => void
}

export function PhotoToPDFConverter({ onConverted }: PhotoToPDFConverterProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [convertedPdf, setConvertedPdf] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [documentType, setDocumentType] = useState('resume')

  const documentTypes = [
    { value: 'resume', label: 'Resume/CV' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'contract', label: 'Contract' },
    { value: 'report', label: 'Report' },
    { value: 'general', label: 'General Document' }
  ]

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setUploadedImage(file)
    setConvertedPdf(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    disabled: isConverting
  })

  const convertToPDF = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first')
      return
    }

    setIsConverting(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90))
      }, 300)

      // Convert image to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(uploadedImage)
      })

      // Call AI conversion API
      const response = await fetch('/api/ai/photo-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          document_type: documentType,
          filename: uploadedImage.name
        })
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const data = await response.json()
      setConvertedPdf(data.pdf_url)
      onConverted?.(data.pdf_url, data.filename)
      
      toast.success('Image converted to PDF successfully!')
    } catch (error) {
      toast.error('Failed to convert image to PDF. Please try again.')
      console.error('Conversion error:', error)
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }

  const downloadPDF = () => {
    if (convertedPdf) {
      const link = document.createElement('a')
      link.href = convertedPdf
      link.download = `converted-${documentType}.pdf`
      link.click()
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setConvertedPdf(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${isConverting ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Image className="h-8 w-8 text-blue-500" />
                  <span className="text-lg font-medium">{uploadedImage.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    disabled={isConverting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop the image here' : 'Upload an image'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: JPEG, PNG, GIF, BMP, WebP (Max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploadedImage && !isConverting && (
            <Button 
              onClick={convertToPDF} 
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Convert to PDF
            </Button>
          )}

          {isConverting && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Converting image to PDF... {progress}%
              </p>
            </div>
          )}
        </div>
      </Card>

      {convertedPdf && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Converted PDF</h3>
              <Button onClick={downloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <iframe
                src={convertedPdf}
                className="w-full h-96 border-0 rounded"
                title="Converted PDF"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
