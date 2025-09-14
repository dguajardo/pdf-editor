'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X } from 'lucide-react'
import { storage } from '@/lib/supabase/storage'
import { useAuth } from '@/contexts/AuthContext'

interface PDFUploadProps {
  onUploadComplete: (fileUrl: string, fileName: string) => void
  onError: (error: string) => void
}

export function PDFUpload({ onUploadComplete, onError }: PDFUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !user) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    setUploading(true)
    setUploadProgress(0)

    try {
      // Generate unique file path
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      
      // Upload file to Supabase Storage
      const { data, error } = await storage.uploadFile(file, filePath)
      
      if (error) {
        throw new Error(error.message)
      }

      // Get public URL
      const publicUrl = await storage.getPublicUrl(filePath)
      
      setUploadProgress(100)
      onUploadComplete(publicUrl, file.name)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [user, onUploadComplete, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploading
  })

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <span className="text-lg font-medium">{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop the PDF here' : 'Upload a PDF file'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop a PDF file here, or click to select
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {!uploading && !uploadedFile && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Choose File
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
