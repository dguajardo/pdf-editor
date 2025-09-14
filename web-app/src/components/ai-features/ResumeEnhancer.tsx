'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Wand2, Download, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface ResumeEnhancerProps {
  initialText?: string
  onEnhanced?: (enhancedText: string) => void
}

export function ResumeEnhancer({ initialText = '', onEnhanced }: ResumeEnhancerProps) {
  const [inputText, setInputText] = useState(initialText)
  const [enhancedText, setEnhancedText] = useState('')
  const [enhancementType, setEnhancementType] = useState('professional')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [progress, setProgress] = useState(0)

  const enhancementTypes = [
    { value: 'professional', label: 'Professional Tone' },
    { value: 'ats_optimized', label: 'ATS Optimized' },
    { value: 'achievement_focused', label: 'Achievement Focused' },
    { value: 'skills_enhanced', label: 'Skills Enhanced' },
    { value: 'quantified', label: 'Quantified Results' }
  ]

  const enhanceResume = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to enhance')
      return
    }

    setIsEnhancing(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Call AI enhancement API
      const response = await fetch('/api/ai/enhance-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          enhancement_type: enhancementType
        })
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error('Enhancement failed')
      }

      const data = await response.json()
      setEnhancedText(data.enhanced_text)
      onEnhanced?.(data.enhanced_text)
      
      toast.success('Resume enhanced successfully!')
    } catch (error) {
      toast.error('Failed to enhance resume. Please try again.')
      console.error('Enhancement error:', error)
    } finally {
      setIsEnhancing(false)
      setProgress(0)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedText)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const downloadText = () => {
    const blob = new Blob([enhancedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enhanced-resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="enhancement-type">Enhancement Type</Label>
            <Select value={enhancementType} onValueChange={setEnhancementType}>
              <SelectTrigger>
                <SelectValue placeholder="Select enhancement type" />
              </SelectTrigger>
              <SelectContent>
                {enhancementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="input-text">Original Text</Label>
            <Textarea
              id="input-text"
              placeholder="Paste your resume text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="mt-2"
            />
          </div>

          <Button 
            onClick={enhanceResume} 
            disabled={isEnhancing || !inputText.trim()}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isEnhancing ? 'Enhancing...' : 'Enhance Resume'}
          </Button>

          {isEnhancing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                AI is enhancing your resume... {progress}%
              </p>
            </div>
          )}
        </div>
      </Card>

      {enhancedText && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Enhanced Resume</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {enhancedText}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
