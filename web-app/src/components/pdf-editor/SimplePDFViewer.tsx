'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'

interface SimplePDFViewerProps {
  fileUrl: string
  fileName: string
  onEdit?: () => void
}

export function SimplePDFViewer({ fileUrl, fileName, onEdit }: SimplePDFViewerProps) {
  const downloadPDF = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.click()
  }

  const openInNewTab = () => {
    window.open(fileUrl, '_blank')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <p className="text-sm text-gray-600">PDF Document</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={openInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit PDF
            </Button>
          )}
        </div>
      </div>

      {/* PDF Display */}
      <div className="p-4">
        <Card className="w-full h-[600px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">📄</div>
            <h3 className="text-xl font-semibold">PDF Ready for Viewing</h3>
            <p className="text-gray-600">
              Click "Open" to view the PDF in a new tab, or "Download" to save it.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                File URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">{fileUrl}</code>
              </p>
              <p className="text-sm text-gray-500">
                File Name: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{fileName}</code>
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={openInNewTab} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View PDF
              </Button>
              <Button onClick={downloadPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
