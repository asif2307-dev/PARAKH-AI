from app.models.db_models import Bid
import json
from datetime import datetime

class ReportGenerator:
    """
    Generates structured compliance reports for Procurement Officers.
    In a real environment, this could generate PDF or Excel reports.
    Here we generate a structured Markdown/JSON payload for the frontend.
    """
    
    @staticmethod
    def generate_compliance_report(bid: Bid) -> dict:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        
        reqs = bid.extracted_data.get("requirements", []) if bid.extracted_data else []
        contradictions = bid.extracted_data.get("contradictions", []) if bid.extracted_data else []
        
        report_data = {
            "report_id": f"REP-{bid.id}-{int(datetime.now().timestamp())}",
            "generated_at": now_str,
            "bid_summary": {
                "bid_id": bid.id,
                "vendor_name": bid.vendor_name,
                "vendor_gstin": bid.vendor_gstin,
                "submission_date": bid.submission_date,
                "tender_id": bid.tender_id,
                "tender_title": bid.tender.title if bid.tender else "N/A"
            },
            "evaluation_metrics": {
                "compliance_score": bid.compliance_score,
                "risk_level": bid.risk_level,
                "status": bid.status,
                "passed_requirements": bid.passed_requirements,
                "failed_requirements": bid.failed_requirements,
                "contradictions_count": bid.contradictions_count
            },
            "critical_flags": [c for c in contradictions if c.get("severity") == "CRITICAL"],
            "requirements_breakdown": reqs,
            "system_signature": "PARAKH AI Certified Output (GeM Integration)"
        }
        
        return report_data
