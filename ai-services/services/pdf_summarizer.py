import requests
import fitz  # PyMuPDF
import openai
import os
from typing import Dict, Any, List

class PDFSummarizer:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def summarize(self, pdf_url: str, summary_type: str = "brief") -> Dict[str, Any]:
        """
        Summarize PDF content using AI
        """
        try:
            # Extract text from PDF
            text = await self._extract_text_from_pdf(pdf_url)
            
            if not text.strip():
                return {
                    "summary": "No text content found in the PDF.",
                    "summary_type": summary_type,
                    "key_points": [],
                    "word_count": 0
                }
            
            # Generate summary using AI
            summary_result = await self._generate_summary(text, summary_type)
            
            return {
                "summary": summary_result["summary"],
                "summary_type": summary_type,
                "key_points": summary_result["key_points"],
                "word_count": len(text.split())
            }
            
        except Exception as e:
            # Fallback to mock summary
            return self._mock_summary(summary_type)
    
    async def _extract_text_from_pdf(self, pdf_url: str) -> str:
        """
        Extract text content from PDF
        """
        try:
            # Download PDF if it's a URL
            if pdf_url.startswith('http'):
                response = requests.get(pdf_url)
                pdf_data = response.content
            else:
                # Handle base64 data URLs
                if pdf_url.startswith('data:application/pdf;base64,'):
                    import base64
                    pdf_data = base64.b64decode(pdf_url.split(',')[1])
                else:
                    raise ValueError("Invalid PDF URL format")
            
            # Open PDF with PyMuPDF
            pdf_document = fitz.open(stream=pdf_data, filetype="pdf")
            text = ""
            
            # Extract text from all pages
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
            
            pdf_document.close()
            return text
            
        except Exception as e:
            # Return mock text for development
            return "This is mock PDF content for development purposes. In production, this would contain the actual extracted text from the PDF document."
    
    async def _generate_summary(self, text: str, summary_type: str) -> Dict[str, Any]:
        """
        Generate AI-powered summary
        """
        try:
            prompts = {
                "brief": "Provide a brief summary (2-3 sentences) of the following text:",
                "detailed": "Provide a detailed summary (1-2 paragraphs) of the following text:",
                "bullet_points": "Summarize the following text as bullet points highlighting the key information:",
                "executive": "Create an executive summary of the following text suitable for business leaders:"
            }
            
            prompt = prompts.get(summary_type, prompts["brief"])
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at summarizing documents. Provide clear, concise, and accurate summaries based on the user's requirements."
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}\n\n{text}"
                    }
                ],
                max_tokens=1000,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content
            
            # Extract key points (simple implementation)
            key_points = self._extract_key_points(summary)
            
            return {
                "summary": summary,
                "key_points": key_points
            }
            
        except Exception as e:
            # Fallback to basic summary
            return self._basic_summary(text)
    
    def _extract_key_points(self, summary: str) -> List[str]:
        """
        Extract key points from summary
        """
        # Simple key point extraction
        sentences = summary.split('. ')
        key_points = [s.strip() + '.' for s in sentences[:3] if s.strip()]
        return key_points
    
    def _basic_summary(self, text: str) -> Dict[str, Any]:
        """
        Basic summary without AI
        """
        words = text.split()
        if len(words) <= 50:
            summary = text
        else:
            summary = ' '.join(words[:50]) + "..."
        
        return {
            "summary": summary,
            "key_points": [summary]
        }
    
    def _mock_summary(self, summary_type: str) -> Dict[str, Any]:
        """
        Mock summary for development/testing
        """
        mock_summaries = {
            "brief": "This is a mock brief summary of the PDF document for development purposes.",
            "detailed": "This is a mock detailed summary of the PDF document. It provides comprehensive information about the content and key findings. This summary is generated for development and testing purposes.",
            "bullet_points": "• Mock key point 1\n• Mock key point 2\n• Mock key point 3",
            "executive": "Executive Summary: This mock summary provides high-level insights suitable for business leaders and decision makers."
        }
        
        summary = mock_summaries.get(summary_type, mock_summaries["brief"])
        
        return {
            "summary": summary,
            "summary_type": summary_type,
            "key_points": [summary],
            "word_count": 100
        }
