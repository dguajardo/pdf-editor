from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from services.resume_enhancer import ResumeEnhancer
from services.photo_to_pdf import PhotoToPDFConverter
from services.pdf_summarizer import PDFSummarizer

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PDF Editor AI Services",
    description="AI-powered microservices for PDF editing and enhancement",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_enhancer = ResumeEnhancer()
photo_to_pdf = PhotoToPDFConverter()
pdf_summarizer = PDFSummarizer()

# Pydantic models
class ResumeEnhancementRequest(BaseModel):
    text: str
    enhancement_type: str = "professional"

class ResumeEnhancementResponse(BaseModel):
    enhanced_text: str
    enhancement_type: str
    original_length: int
    enhanced_length: int

class PhotoToPDFRequest(BaseModel):
    image: str  # Base64 encoded image
    document_type: str = "general"
    filename: str

class PhotoToPDFResponse(BaseModel):
    pdf_url: str
    filename: str
    document_type: str
    pages: int

class PDFSummarizeRequest(BaseModel):
    pdf_url: str
    summary_type: str = "brief"

class PDFSummarizeResponse(BaseModel):
    summary: str
    summary_type: str
    key_points: list[str]
    word_count: int

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PDF Editor AI Services"}

# Resume enhancement endpoint
@app.post("/enhance-resume", response_model=ResumeEnhancementResponse)
async def enhance_resume(request: ResumeEnhancementRequest):
    try:
        result = await resume_enhancer.enhance(
            text=request.text,
            enhancement_type=request.enhancement_type
        )
        return ResumeEnhancementResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Photo to PDF conversion endpoint
@app.post("/photo-to-pdf", response_model=PhotoToPDFResponse)
async def convert_photo_to_pdf(request: PhotoToPDFRequest):
    try:
        result = await photo_to_pdf.convert(
            image=request.image,
            document_type=request.document_type,
            filename=request.filename
        )
        return PhotoToPDFResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PDF summarization endpoint
@app.post("/summarize-pdf", response_model=PDFSummarizeResponse)
async def summarize_pdf(request: PDFSummarizeRequest):
    try:
        result = await pdf_summarizer.summarize(
            pdf_url=request.pdf_url,
            summary_type=request.summary_type
        )
        return PDFSummarizeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
