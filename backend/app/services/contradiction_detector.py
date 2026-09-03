from typing import List, Dict, Any

class ContradictionDetector:
    """
    Hero Feature of PARAKH AI:
    Detects discrepancies between bidder claims and independent trusted sources.
    Strictly uses neutral, factual government terminology.
    """

    @staticmethod
    def detect_contradictions(requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        contradictions = []
        for req in requirements:
            ver = req.get("verification")
            evd = req.get("evidence")
            if not ver or not evd:
                continue

            v_status = ver.get("verification_status")
            req_status = req.get("status")

            if v_status == "CONTRADICTION" or req_status == "CONTRADICTION":
                cid = f"CT-{req.get('id', 'REQ')}"
                cat = "TURNOVER_MISMATCH" if "Turnover" in req.get("title", "") else \
                      "EXPIRED_CERTIFICATE" if "ISO" in req.get("title", "") or "Certificate" in req.get("title", "") else \
                      "NAME_MISMATCH" if "Exemption" in req.get("title", "") or "Name" in req.get("title", "") else "DISCREPANCY"
                
                severity = "CRITICAL" if cat == "TURNOVER_MISMATCH" else "HIGH"

                explanation = req.get("contradiction_reason") or (
                    f"Potential inconsistency identified: Submitted document declares '{evd.get('extracted_value')}', "
                    f"whereas verification via {ver.get('source_name')} yields '{ver.get('verified_value')}'."
                )

                contradictions.append({
                    "id": cid,
                    "requirement_id": req.get("id"),
                    "clause_title": f"{req.get('clause_number')}: {req.get('title')}",
                    "category": cat,
                    "severity": severity,
                    "tender_specification": req.get("description"),
                    "bidder_claimed_value": evd.get("extracted_value"),
                    "verified_external_value": ver.get("verified_value"),
                    "evidence_document": evd.get("document_name"),
                    "evidence_page": evd.get("page_number", 1),
                    "verification_source": ver.get("source_name"),
                    "risk_impact": "Requires officer review and determination before proceeding.",
                    "explanation": explanation
                })
        return contradictions
