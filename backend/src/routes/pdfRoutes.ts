import express from 'express'
import multer from 'multer'
import { PDFDocument } from 'pdf-lib'
import { PDFService } from '../services/PDFService'

const router = express.Router()
const pdfService = new PDFService()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

// Merge PDFs
router.post('/merge', upload.array('files', 10), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[]
    
    if (!files || files.length < 2) {
      return res.status(400).json({ 
        error: 'At least 2 PDF files are required for merging' 
      })
    }

    const mergedPdf = await pdfService.mergePDFs(files)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"')
    res.send(mergedPdf)
  } catch (error) {
    next(error)
  }
})

// Split PDF
router.post('/split', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    const { startPage, endPage } = req.body
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' })
    }

    if (!startPage || !endPage) {
      return res.status(400).json({ 
        error: 'Start page and end page are required' 
      })
    }

    const splitPdf = await pdfService.splitPDF(
      file.buffer, 
      parseInt(startPage), 
      parseInt(endPage)
    )
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="split.pdf"')
    res.send(splitPdf)
  } catch (error) {
    next(error)
  }
})

// Add watermark
router.post('/watermark', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    const { text, position = 'center' } = req.body
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' })
    }

    if (!text) {
      return res.status(400).json({ error: 'Watermark text is required' })
    }

    const watermarkedPdf = await pdfService.addWatermark(
      file.buffer, 
      text, 
      position
    )
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="watermarked.pdf"')
    res.send(watermarkedPdf)
  } catch (error) {
    next(error)
  }
})

// Extract text from PDF
router.post('/extract-text', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' })
    }

    const text = await pdfService.extractText(file.buffer)
    
    res.json({ 
      text,
      pageCount: await pdfService.getPageCount(file.buffer)
    })
  } catch (error) {
    next(error)
  }
})

// Get PDF info
router.post('/info', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' })
    }

    const info = await pdfService.getPDFInfo(file.buffer)
    
    res.json(info)
  } catch (error) {
    next(error)
  }
})

export { router as pdfRoutes }
