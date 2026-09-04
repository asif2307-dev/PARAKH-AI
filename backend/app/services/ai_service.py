import google.generativeai as genai
from pydantic_settings import BaseSettings
import json

class Settings(BaseSettings):
    gemini_api_key: str = ""
    class Config:
        env_file = ".env"

settings = Settings()

if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

class AIService:
    """
    LLM architecture for parsing procurement documents, 
    verifying requirements, and detecting anomalies.
    """
    
    @staticmethod
    def extract_requirements(text: str) -> list:
        if not settings.gemini_api_key:
            print("WARNING: No Gemini API Key found. Returning mock requirements.")
            return []
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are an expert procurement and tender analyst. 
        Analyze the following document text and extract the key requirements, compliance criteria, and clauses.
        Evaluate if the document meets each requirement based on the text.
        Return the result as a valid JSON array of objects. 
        Each object should have:
        - "clause_id": string (e.g., "REQ-1")
        - "title": string (brief title)
        - "description": string (the actual requirement)
        - "type": string (e.g., "Financial", "Technical", "Legal")
        - "status": string (MUST BE ONE OF: "COMPLIANT", "NON_COMPLIANT", "NEEDS_REVIEW", "CONTRADICTION", "PENDING")
        - "evidence_snippet": string (a short quote from the text that proves the status)
        
        Text:
        {text[:10000]} # Limit to 10k chars for basic extraction
        """
        
        try:
            response = model.generate_content(prompt)
            # Find JSON array in the response
            text_res = response.text
            start_idx = text_res.find("[")
            end_idx = text_res.rfind("]")
            
            if start_idx != -1 and end_idx != -1:
                json_str = text_res[start_idx:end_idx+1]
                return json.loads(json_str)
            return []
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return []

    @staticmethod
    def analyze_compliance(bid_data: dict, requirements: list) -> dict:
        """
        Takes extracted bid data and tender requirements and evaluates compliance.
        Returns evaluation result.
        """
        if not settings.gemini_api_key:
            return {}
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are a compliance evaluation engine for a procurement portal.
        Evaluate the following bid data against the tender requirements.
        Return the result as a valid JSON object with the following schema:
        {{
            "compliance_score": number (0-100),
            "risk_level": string ("Low", "Medium", "High"),
            "passed_requirements": number,
            "failed_requirements": number,
            "review_requirements": number,
            "status": string ("Compliant", "Non-Compliant", "Needs Review")
        }}
        
        Bid Data:
        {json.dumps(bid_data)[:5000]}
        
        Requirements:
        {json.dumps(requirements)[:5000]}
        """
        
        try:
            response = model.generate_content(prompt)
            # Find JSON object in the response
            text_res = response.text
            start_idx = text_res.find("{")
            end_idx = text_res.rfind("}")
            
            if start_idx != -1 and end_idx != -1:
                json_str = text_res[start_idx:end_idx+1]
                return json.loads(json_str)
            return {}
        except Exception as e:
            print(f"Error in compliance analysis: {e}")
            return {}
