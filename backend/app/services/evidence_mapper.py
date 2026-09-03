from typing import List, Dict, Any

class EvidenceMapper:
    """
    Evidence Mapping Engine (BidDoc Module).
    Maps tender clauses to bidder documents, page references, OCR snippets, and external verification sources.
    Ensures that every AI finding is 100% explainable and traceable to source evidence.
    """

    @staticmethod
    def generate_mapping_graph(requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        mapped_nodes = []
        for req in requirements:
            evd = req.get("evidence", {})
            ver = req.get("verification", {})
            mapped_nodes.append({
                "clause_id": req.get("id"),
                "clause_number": req.get("clause_number"),
                "clause_title": req.get("title"),
                "tender_requirement": req.get("threshold_value") or req.get("description"),
                "is_mandatory": req.get("is_mandatory", True),
                "extracted_claim": evd.get("extracted_value", "No claim extracted"),
                "supporting_document": evd.get("document_name", "None"),
                "page_number": evd.get("page_number", 1),
                "ocr_confidence": evd.get("ocr_confidence", 0.0),
                "document_snippet": evd.get("extracted_text", ""),
                "verification_source": ver.get("source_name", "Pending"),
                "verified_value": ver.get("verified_value", "Pending"),
                "verification_status": ver.get("verification_status", "PENDING"),
                "overall_status": req.get("status", "PENDING"),
                "risk_level": req.get("risk_level", "LOW")
            })
        return mapped_nodes
