'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { PDFDocument, PDFEditorState, Annotation } from '@/types'

interface PDFEditorContextType {
  editorState: PDFEditorState
  setCurrentDocument: (document: PDFDocument | null) => void
  setPages: (pages: number) => void
  setCurrentPage: (page: number) => void
  setZoom: (zoom: number) => void
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'created_at'>) => void
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void
  removeAnnotation: (id: string) => void
  setIsEditing: (editing: boolean) => void
  resetEditor: () => void
}

const initialState: PDFEditorState = {
  currentDocument: null,
  pages: 0,
  currentPage: 1,
  zoom: 1,
  annotations: [],
  isEditing: false
}

const PDFEditorContext = createContext<PDFEditorContextType | undefined>(undefined)

export function PDFEditorProvider({ children }: { children: React.ReactNode }) {
  const [editorState, setEditorState] = useState<PDFEditorState>(initialState)

  const setCurrentDocument = useCallback((document: PDFDocument | null) => {
    setEditorState(prev => ({
      ...prev,
      currentDocument: document,
      currentPage: 1,
      annotations: []
    }))
  }, [])

  const setPages = useCallback((pages: number) => {
    setEditorState(prev => ({ ...prev, pages }))
  }, [])

  const setCurrentPage = useCallback((page: number) => {
    setEditorState(prev => ({ ...prev, currentPage: page }))
  }, [])

  const setZoom = useCallback((zoom: number) => {
    setEditorState(prev => ({ ...prev, zoom }))
  }, [])

  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id' | 'created_at'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    setEditorState(prev => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation]
    }))
  }, [])

  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setEditorState(prev => ({
      ...prev,
      annotations: prev.annotations.map(annotation =>
        annotation.id === id ? { ...annotation, ...updates } : annotation
      )
    }))
  }, [])

  const removeAnnotation = useCallback((id: string) => {
    setEditorState(prev => ({
      ...prev,
      annotations: prev.annotations.filter(annotation => annotation.id !== id)
    }))
  }, [])

  const setIsEditing = useCallback((editing: boolean) => {
    setEditorState(prev => ({ ...prev, isEditing: editing }))
  }, [])

  const resetEditor = useCallback(() => {
    setEditorState(initialState)
  }, [])

  return (
    <PDFEditorContext.Provider value={{
      editorState,
      setCurrentDocument,
      setPages,
      setCurrentPage,
      setZoom,
      addAnnotation,
      updateAnnotation,
      removeAnnotation,
      setIsEditing,
      resetEditor
    }}>
      {children}
    </PDFEditorContext.Provider>
  )
}

export function usePDFEditor() {
  const context = useContext(PDFEditorContext)
  if (context === undefined) {
    throw new Error('usePDFEditor must be used within a PDFEditorProvider')
  }
  return context
}
