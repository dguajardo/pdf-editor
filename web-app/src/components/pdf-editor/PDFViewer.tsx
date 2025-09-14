'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Edit3 } from 'lucide-react'
import { usePDFEditor } from '@/contexts/PDFEditorContext'

// Dynamic import for react-pdf to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Document: any, Page: any, pdfjs: any

const loadReactPdf = async () => {
  if (typeof window !== 'undefined') {
    const reactPdf = await import('react-pdf')
    Document = reactPdf.Document
    Page = reactPdf.Page
    pdfjs = reactPdf.pdfjs
    
    // Set up PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  }
}

interface PDFViewerProps {
  fileUrl: string
  onEdit?: () => void
}

export function PDFViewer({ fileUrl, onEdit }: PDFViewerProps) {
  const { setPages, setCurrentPage, setZoom } = usePDFEditor()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadReactPdf()
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPages(numPages)
    setLoading(false)
    setError(null)
  }, [setPages])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error)
    setError(`Failed to load PDF: ${error.message}`)
    setLoading(false)
  }, [])

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => {
      const newPage = Math.max(prev - 1, 1)
      setCurrentPage(newPage)
      return newPage
    })
  }, [setCurrentPage])

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => {
      const newPage = Math.min(prev + 1, numPages)
      setCurrentPage(newPage)
      return newPage
    })
  }, [numPages, setCurrentPage])

  const handleZoomChange = useCallback((value: number[]) => {
    const newScale = value[0] / 100
    setScale(newScale)
    setZoom(newScale)
  }, [setZoom])

  const zoomIn = useCallback(() => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.2, 3.0)
      setZoom(newScale)
      return newScale
    })
  }, [setZoom])

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.2, 0.5)
      setZoom(newScale)
      return newScale
    })
  }, [setZoom])

  const downloadPDF = useCallback(() => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'document.pdf'
    link.click()
  }, [fileUrl])

  if (!isClient) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading PDF viewer...</p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading PDF...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="w-24">
              <Slider
                value={[scale * 100]}
                onValueChange={handleZoomChange}
                min={50}
                max={300}
                step={10}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button size="sm" onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex justify-center p-4 bg-gray-100">
        {Document && Page ? (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading PDF...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <div className="text-center p-8">
            <p>PDF viewer is loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}
