import openai
import os
from typing import Dict, Any

class ResumeEnhancer:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def enhance(self, text: str, enhancement_type: str = "professional") -> Dict[str, Any]:
        """
        Enhance resume text using OpenAI GPT-4
        """
        try:
            # Define enhancement prompts based on type
            prompts = {
                "professional": "Rewrite this resume text to sound more professional and polished while maintaining the original meaning and structure:",
                "ats_optimized": "Optimize this resume text for Applicant Tracking Systems (ATS) by adding relevant keywords and improving formatting:",
                "achievement_focused": "Restructure this resume text to highlight quantifiable achievements and impact statements:",
                "skills_enhanced": "Enhance the skills section of this resume with technical competencies and soft skills:",
                "quantified": "Add metrics and quantifiable results to strengthen the impact statements in this resume:"
            }
            
            prompt = prompts.get(enhancement_type, prompts["professional"])
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional resume writer and career coach. Enhance the provided resume text according to the specific requirements."
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}\n\n{text}"
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            enhanced_text = response.choices[0].message.content
            
            return {
                "enhanced_text": enhanced_text,
                "enhancement_type": enhancement_type,
                "original_length": len(text),
                "enhanced_length": len(enhanced_text)
            }
            
        except Exception as e:
            # Fallback to mock enhancement if OpenAI fails
            return self._mock_enhancement(text, enhancement_type)
    
    def _mock_enhancement(self, text: str, enhancement_type: str) -> Dict[str, Any]:
        """
        Mock enhancement for development/testing
        """
        enhancements = {
            "professional": "Enhanced with professional language and industry-standard terminology.",
            "ats_optimized": "Optimized for Applicant Tracking Systems with relevant keywords.",
            "achievement_focused": "Restructured to highlight quantifiable achievements and impact.",
            "skills_enhanced": "Enhanced skills section with technical competencies and soft skills.",
            "quantified": "Added metrics and quantifiable results to strengthen impact statements."
        }
        
        enhancement = enhancements.get(enhancement_type, enhancements["professional"])
        enhanced_text = f"{text}\n\n--- AI ENHANCED ---\n{enhancement}\n\nThis is a mock enhancement. In production, this would be replaced with actual AI-generated content."
        
        return {
            "enhanced_text": enhanced_text,
            "enhancement_type": enhancement_type,
            "original_length": len(text),
            "enhanced_length": len(enhanced_text)
        }
