import pdfplumber
import os

class DocumentParser:
    """
    Parses uploaded PDF documents.
    Extracts text and tables using pdfplumber.
    """
    
    @staticmethod
    def extract_text_and_tables(file_path: str) -> dict:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        full_text = []
        tables = []
        
        try:
            with pdfplumber.open(file_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    if text:
                        full_text.append(text)
                        
                    # Extract tables from page
                    page_tables = page.extract_tables()
                    for table in page_tables:
                        # Clean up the table
                        cleaned_table = []
                        for row in table:
                            cleaned_row = [str(cell).strip() if cell else "" for cell in row]
                            cleaned_table.append(cleaned_row)
                        tables.append({
                            "page": i + 1,
                            "data": cleaned_table
                        })
        except Exception as e:
            print(f"Error parsing PDF {file_path}: {e}")
            
        return {
            "text": "\n\n".join(full_text),
            "tables": tables
        }
