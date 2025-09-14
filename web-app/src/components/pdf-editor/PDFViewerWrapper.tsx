'use client'

import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(() => import('./PDFViewer').then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => (
    <Card className="w-full h-[600px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading PDF viewer...</p>
      </div>
    </Card>
  )
})

interface PDFViewerWrapperProps {
  fileUrl: string
  onEdit?: () => void
}

export function PDFViewerWrapper({ fileUrl, onEdit }: PDFViewerWrapperProps) {
  return <PDFViewer fileUrl={fileUrl} onEdit={onEdit} />
}

