import express from 'express'
import axios from 'axios'

const router = express.Router()

// AI service base URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// Enhance resume
router.post('/enhance-resume', async (req, res, next) => {
  try {
    const { text, enhancement_type } = req.body
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const response = await axios.post(`${AI_SERVICE_URL}/enhance-resume`, {
      text,
      enhancement_type: enhancement_type || 'professional'
    })

    res.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.detail || 'AI service error'
      })
    } else {
      next(error)
    }
  }
})

// Convert photo to PDF
router.post('/photo-to-pdf', async (req, res, next) => {
  try {
    const { image, document_type, filename } = req.body
    
    if (!image) {
      return res.status(400).json({ error: 'Image is required' })
    }

    const response = await axios.post(`${AI_SERVICE_URL}/photo-to-pdf`, {
      image,
      document_type: document_type || 'general',
      filename: filename || 'document'
    })

    res.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.detail || 'AI service error'
      })
    } else {
      next(error)
    }
  }
})

// Summarize PDF
router.post('/summarize-pdf', async (req, res, next) => {
  try {
    const { pdf_url, summary_type } = req.body
    
    if (!pdf_url) {
      return res.status(400).json({ error: 'PDF URL is required' })
    }

    const response = await axios.post(`${AI_SERVICE_URL}/summarize-pdf`, {
      pdf_url,
      summary_type: summary_type || 'brief'
    })

    res.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.detail || 'AI service error'
      })
    } else {
      next(error)
    }
  }
})

export { router as aiRoutes }
