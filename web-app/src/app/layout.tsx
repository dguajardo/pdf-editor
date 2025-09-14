import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PDFEditorProvider } from '@/contexts/PDFEditorContext'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Editor & AI Enhancer',
  description: 'Professional PDF editing with AI-powered enhancements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PDFEditorProvider>
            {children}
            <Toaster />
          </PDFEditorProvider>
        </AuthProvider>
      </body>
    </html>
  )
}