import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export class PDFService {
  async mergePDFs(files: Express.Multer.File[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create()
    
    for (const file of files) {
      const pdf = await PDFDocument.load(file.buffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      
      pages.forEach((page) => mergedPdf.addPage(page))
    }
    
    return Buffer.from(await mergedPdf.save())
  }

  async splitPDF(pdfBuffer: Buffer, startPage: number, endPage: number): Promise<Buffer> {
    const pdf = await PDFDocument.load(pdfBuffer)
    const splitPdf = await PDFDocument.create()
    
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage - 1 + i
    )
    
    const pages = await splitPdf.copyPages(pdf, pageIndices)
    pages.forEach((page) => splitPdf.addPage(page))
    
    return Buffer.from(await splitPdf.save())
  }

  async addWatermark(
    pdfBuffer: Buffer, 
    text: string, 
    position: string = 'center'
  ): Promise<Buffer> {
    const pdf = await PDFDocument.load(pdfBuffer)
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    
    const pages = pdf.getPages()
    
    pages.forEach((page) => {
      const { width, height } = page.getSize()
      
      let x: number, y: number
      
      switch (position) {
        case 'top-left':
          x = 50
          y = height - 50
          break
        case 'top-right':
          x = width - 200
          y = height - 50
          break
        case 'bottom-left':
          x = 50
          y = 50
          break
        case 'bottom-right':
          x = width - 200
          y = 50
          break
        case 'center':
        default:
          x = width / 2 - 100
          y = height / 2
          break
      }
      
      page.drawText(text, {
        x,
        y,
        size: 20,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity: 0.5,
      })
    })
    
    return Buffer.from(await pdf.save())
  }

  async extractText(pdfBuffer: Buffer): Promise<string> {
    // This is a simplified implementation
    // In production, you'd use a proper PDF text extraction library
    // like pdf-parse or pdf2pic with OCR
    
    const pdf = await PDFDocument.load(pdfBuffer)
    const pageCount = pdf.getPageCount()
    
    // Mock text extraction - replace with actual implementation
    return `Extracted text from ${pageCount} pages. This is a mock implementation. In production, this would contain the actual extracted text from the PDF.`
  }

  async getPageCount(pdfBuffer: Buffer): Promise<number> {
    const pdf = await PDFDocument.load(pdfBuffer)
    return pdf.getPageCount()
  }

  async getPDFInfo(pdfBuffer: Buffer): Promise<any> {
    const pdf = await PDFDocument.load(pdfBuffer)
    
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'Untitled',
      author: pdf.getAuthor() || 'Unknown',
      subject: pdf.getSubject() || '',
      creator: pdf.getCreator() || '',
      producer: pdf.getProducer() || '',
      creationDate: pdf.getCreationDate()?.toISOString() || null,
      modificationDate: pdf.getModificationDate()?.toISOString() || null,
    }
  }
}
