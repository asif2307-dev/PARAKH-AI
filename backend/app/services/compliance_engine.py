from typing import Dict, Any, List

class ComplianceEngine:
    """
    Deterministic Compliance Engine for PARAKH AI (SIH26100).
    Evaluates extracted evidence against tender clauses and multi-source verification records.
    AI extracts, deterministic rules validate.
    """

    @staticmethod
    def evaluate_bid(bid: Dict[str, Any]) -> Dict[str, Any]:
        requirements = bid.get("requirements", [])
        if not requirements:
            return {
                "compliance_score": bid.get("compliance_score", 0),
                "risk_level": bid.get("risk_level", "Low"),
                "passed_requirements": bid.get("passed_requirements", 0),
                "failed_requirements": bid.get("failed_requirements", 0),
                "review_requirements": bid.get("review_requirements", 0),
                "contradictions_count": bid.get("contradictions_count", 0),
                "status": bid.get("status", "Under Analysis")
            }

        passed = 0
        failed = 0
        review = 0
        contradictions = 0

        for req in requirements:
            status = req.get("status")
            if status == "COMPLIANT":
                passed += 1
            elif status == "CONTRADICTION":
                failed += 1
                contradictions += 1
            elif status in ("NEEDS_REVIEW", "PENDING"):
                review += 1
            elif status == "NON_COMPLIANT":
                failed += 1

        total = len(requirements)
        # Weighting: Fully compliant requirements get 1.0, items under review get 0.66 credit
        # For 6 clauses (3 passed, 1 review, 2 contradiction): (3*1.0 + 1*0.66)/6 = 61%
        score = int(round((passed * 1.0 + review * 0.66) / total * 100)) if total > 0 else 0

        # Determine Risk Level
        if contradictions > 0 or failed >= 2:
            risk_level = "High"
            status = "Needs Review"
        elif review > 0 or score < 85:
            risk_level = "Medium"
            status = "Needs Review"
        else:
            risk_level = "Low"
            status = "Compliant"

        return {
            "compliance_score": score,
            "risk_level": risk_level,
            "passed_requirements": passed,
            "failed_requirements": failed,
            "review_requirements": review,
            "contradictions_count": contradictions,
            "status": status
        }
