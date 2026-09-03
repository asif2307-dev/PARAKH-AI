from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.data.seed_data import db, INITIAL_BIDS_DATA
from app.models.schemas import OfficerDecisionRequest, LoginRequest
from app.services.compliance_engine import ComplianceEngine
from app.services.contradiction_detector import ContradictionDetector
from app.services.evidence_mapper import EvidenceMapper
from app.services.connectors import ConnectorRegistry
from app.services.audit_service import AuditService

router = APIRouter()

@router.post("/auth/login")
def login(creds: LoginRequest):
    # Simulated auth for procurement officer & admin
    if creds.username in ("officer", "admin", "rajesh.kumar") and creds.password == "demo123":
        role_title = "Senior Procurement Officer" if creds.role == "officer" else "System Administrator"
        return {
            "success": True,
            "user": {
                "username": creds.username,
                "name": "Rajesh Kumar",
                "role": creds.role,
                "designation": role_title,
                "department": "GeM Technical Evaluation Committee",
                "badge_id": "GeM-OFC-8821",
                "token": "demo-jwt-token-sih2026"
            }
        }
    # Allow fallback for ease of demo
    return {
        "success": True,
        "user": {
            "username": creds.username or "officer",
            "name": "Rajesh Kumar",
            "role": "officer",
            "designation": "Senior Procurement Officer",
            "department": "GeM Technical Evaluation Committee",
            "badge_id": "GeM-OFC-8821",
            "token": "demo-jwt-token-sih2026"
        }
    }

@router.get("/dashboard/stats")
def get_dashboard_stats():
    # Realistic platform metrics matching PPT Slide 5
    bids = db.bids
    total = len(bids)
    pending = sum(1 for b in bids if b["status"] in ("Needs Review", "Under Analysis"))
    high_risk = sum(1 for b in bids if b["risk_level"] == "High")
    compliant = sum(1 for b in bids if b["status"] in ("Compliant", "Approved"))

    return {
        "total_bids": 128,  # PPT aggregate demo figure
        "pending_reviews": 17,  # PPT aggregate demo figure
        "high_risk_bids": 6,   # PPT aggregate demo figure
        "compliance_rate": 82, # PPT aggregate demo figure
        "active_queue_count": total,
        "active_queue_pending": pending,
        "active_queue_high_risk": high_risk,
        "manual_review_time_hours": 14,
        "parakh_ai_review_time_hours": 2,
        "review_hours_saved_pct": 85.7,
        "reach_buyer_organizations": "1.6 Lakh+",
        "scale_gem_gmv_secured": "₹5.43L Cr+",
        "sample_batch_outcome": {
            "compliant": 70,
            "needs_review": 18,
            "non_compliant": 12
        }
    }

@router.get("/bids")
def list_bids(
    status: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    results = []
    for b in db.bids:
        # Search filter
        if search:
            s = search.lower()
            if s not in b["id"].lower() and s not in b["vendor_name"].lower() and s not in b["tender_title"].lower():
                continue
        # Status filter
        if status and status != "All":
            if b["status"].lower() != status.lower():
                continue
        # Risk filter
        if risk and risk != "All":
            if b["risk_level"].lower() != risk.lower():
                continue

        results.append({
            "id": b["id"],
            "tender_id": b["tender_id"],
            "tender_title": b["tender_title"],
            "department": b["department"],
            "vendor_name": b["vendor_name"],
            "vendor_gstin": b["vendor_gstin"],
            "vendor_pan": b["vendor_pan"],
            "submission_date": b["submission_date"],
            "status": b["status"],
            "compliance_score": b["compliance_score"],
            "risk_level": b["risk_level"],
            "passed_requirements": b["passed_requirements"],
            "failed_requirements": b["failed_requirements"],
            "review_requirements": b["review_requirements"],
            "contradictions_count": b["contradictions_count"],
            "is_analyzed": b.get("is_analyzed", False),
            "analyzed_at": b.get("analyzed_at")
        })
    return results

@router.get("/bids/{bid_id}")
def get_bid_detail(bid_id: str):
    for b in db.bids:
        if b["id"] == bid_id:
            return b
    raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")

@router.post("/bids/{bid_id}/analyze")
def analyze_bid(bid_id: str):
    target = None
    for b in db.bids:
        if b["id"] == bid_id:
            target = b
            break
    if not target:
        raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    
    # 1. Evaluate deterministic compliance rules
    eval_res = ComplianceEngine.evaluate_bid(target)
    
    # 2. Extract contradictions
    contradictions = ContradictionDetector.detect_contradictions(target.get("requirements", []))

    # Update bid state
    target["is_analyzed"] = True
    target["analyzed_at"] = now_str
    target["compliance_score"] = eval_res["compliance_score"]
    target["risk_level"] = eval_res["risk_level"]
    target["passed_requirements"] = eval_res["passed_requirements"]
    target["failed_requirements"] = eval_res["failed_requirements"]
    target["review_requirements"] = eval_res["review_requirements"]
    target["contradictions_count"] = len(contradictions)
    target["contradictions"] = contradictions
    target["status"] = eval_res["status"]

    # 3. Append sequential audit trail entries
    AuditService.record_entry(
        bid_id=bid_id,
        action_type="OCR_EXTRACTED",
        actor="PARAKH AI OCR Engine (PaddleOCR)",
        details=f"Extracted structured clauses and financial tables from {len(target.get('documents', []))} submitted bid documents. Average OCR confidence: 96.2%.",
        status_tag="SUCCESS"
    )
    AuditService.record_entry(
        bid_id=bid_id,
        action_type="EVIDENCE_MAPPED",
        actor="PARAKH AI Engine (BidDoc)",
        details=f"Mapped {len(target.get('requirements', []))} tender specifications to exact pages and evidentiary snippets.",
        status_tag="SUCCESS"
    )
    AuditService.record_entry(
        bid_id=bid_id,
        action_type="CONNECTOR_VERIFIED",
        actor="Multi-Source Verification Hub (Verify+)",
        details="Cross-verified claims against simulated connectors: MCA21 ROC, GSTN Portal, Udyam MSME, and CVC Debarment.",
        status_tag="SUCCESS"
    )

    if contradictions:
        for ct in contradictions:
            AuditService.record_entry(
                bid_id=bid_id,
                action_type="CONTRADICTION_FLAGGED",
                actor="PARAKH AI Engine",
                details=f"Flagged {ct['category']} on {ct['clause_title']}: {ct['explanation']}",
                status_tag="CRITICAL" if ct["severity"] == "CRITICAL" else "ALERT"
            )

    AuditService.record_entry(
        bid_id=bid_id,
        action_type="RISK_EVALUATED",
        actor="Deterministic Rule Engine",
        details=f"Compliance Score computed at {eval_res['compliance_score']}%. Risk classified as {eval_res['risk_level'].upper()}. Forwarded to Procurement Officer queue.",
        status_tag="ALERT" if eval_res["risk_level"] == "High" else "INFO"
    )

    return {
        "success": True,
        "message": f"Bid {bid_id} analyzed successfully.",
        "bid": target,
        "steps_completed": [
            {"step": "Tender Intelligence & Extraction", "status": "COMPLETED", "duration_ms": 320},
            {"step": "OCR & Document Intelligence", "status": "COMPLETED", "duration_ms": 480},
            {"step": "Semantic Evidence Mapping (BidDoc)", "status": "COMPLETED", "duration_ms": 290},
            {"step": "Multi-Source Verification (Verify+)", "status": "COMPLETED", "duration_ms": 610},
            {"step": "Deterministic Compliance & Risk Engine", "status": "COMPLETED", "duration_ms": 110}
        ]
    }

@router.get("/bids/{bid_id}/evidence-mapping")
def get_evidence_mapping(bid_id: str):
    for b in db.bids:
        if b["id"] == bid_id:
            nodes = EvidenceMapper.generate_mapping_graph(b.get("requirements", []))
            return {
                "bid_id": bid_id,
                "vendor_name": b["vendor_name"],
                "tender_title": b["tender_title"],
                "mapped_clauses_count": len(nodes),
                "nodes": nodes
            }
    raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")

@router.post("/bids/{bid_id}/verify")
def trigger_verification(bid_id: str):
    for b in db.bids:
        if b["id"] == bid_id:
            AuditService.record_entry(
                bid_id=bid_id,
                action_type="CONNECTOR_VERIFIED",
                actor="Verify+ Verification Hub",
                details="On-demand live verification ping executed across MCA21, GSTN, Udyam, and Debarment registries.",
                status_tag="SUCCESS"
            )
            return {
                "success": True,
                "message": "Multi-source verification executed.",
                "bid_id": bid_id,
                "connectors_queried": ["MCA21", "GSTN", "UDYAM", "CVC_DEBAR", "BIS_PORTAL"]
            }
    raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")

@router.post("/bids/{bid_id}/decision")
def submit_officer_decision(bid_id: str, req: OfficerDecisionRequest):
    target = None
    for b in db.bids:
        if b["id"] == bid_id:
            target = b
            break
    if not target:
        raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")

    if not req.reason or len(req.reason.strip()) < 5:
        raise HTTPException(status_code=400, detail="A valid officer reason/remark is mandatory before recording a sign-off decision.")

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

    # Map decision to official status
    status_map = {
        "APPROVE": "Approved",
        "REJECT": "Rejected",
        "SEND_FOR_REVIEW": "Sent for Clarification"
    }
    new_status = status_map.get(req.decision, "Needs Review")
    target["status"] = new_status

    decision_record = {
        "decision": req.decision,
        "new_status": new_status,
        "officer_name": req.officer_name,
        "officer_designation": req.officer_designation,
        "reason": req.reason,
        "timestamp": now_str,
        "digital_signature": f"DSIG-{bid_id}-{hash(req.reason) & 0xFFFFFFFF:08X}"
    }
    target["officer_decision"] = decision_record

    # Append to Audit Trail
    status_tag = "SUCCESS" if req.decision == "APPROVE" else "ALERT" if req.decision == "SEND_FOR_REVIEW" else "CRITICAL"
    AuditService.record_entry(
        bid_id=bid_id,
        action_type="OFFICER_DECISION",
        actor=f"{req.officer_name} ({req.officer_designation})",
        details=f"Officer Decision recorded: [{req.decision}] -> Status updated to '{new_status}'. Remark: \"{req.reason}\"",
        status_tag=status_tag
    )

    return {
        "success": True,
        "message": f"Officer decision [{req.decision}] recorded. Bid status updated to '{new_status}'.",
        "bid": target,
        "decision": decision_record
    }

@router.get("/audit-trail")
def get_audit_trail(bid_id: Optional[str] = Query(None)):
    logs = AuditService.get_all_logs(bid_id)
    return {
        "total_logs": len(logs),
        "logs": logs
    }

@router.get("/connectors")
def get_connectors():
    return {
        "status": "ONLINE",
        "environment": "SIMULATED_DEMO_SANDBOX",
        "connectors": db.connectors
    }

@router.post("/connectors/{connector_id}/test")
def test_connector(connector_id: str):
    if connector_id == "MCA21":
        data = ConnectorRegistry.query_mca21()
    elif connector_id == "GSTN":
        data = ConnectorRegistry.query_gstn("27AABCB1234F1Z8")
    elif connector_id == "UDYAM":
        data = ConnectorRegistry.query_udyam("UDYAM-MH-03-009121")
    elif connector_id in ("CVC_DEBAR", "DEBARMENT"):
        data = ConnectorRegistry.query_debarment("AABCB1234F", "Bharat Industrial Systems")
    else:
        data = {
            "source": connector_id,
            "is_simulated": True,
            "status": "SUCCESS",
            "message": "Demo ping response received within 120ms."
        }
    return data

@router.post("/demo/reset")
def reset_demo_database():
    db.reset()
    AuditService.record_entry(
        bid_id="ALL",
        action_type="DEMO_RESET",
        actor="Demonstration System Admin",
        details="Demo dataset successfully reset to initial pristine state.",
        status_tag="INFO"
    )
    return {
        "success": True,
        "message": "Demo state reset to initial values successfully."
    }

@router.post("/bids/{bid_id}/reset")
def reset_single_bid(bid_id: str):
    for idx, orig in enumerate(INITIAL_BIDS_DATA):
        if orig["id"] == bid_id:
            import copy
            db.bids[idx] = copy.deepcopy(orig)
            AuditService.record_entry(
                bid_id=bid_id,
                action_type="DEMO_RESET",
                actor="Demonstration System",
                details=f"Bid {bid_id} reset to initial pre-analyzed state.",
                status_tag="INFO"
            )
            return {
                "success": True,
                "message": f"Bid {bid_id} reset to initial pre-analyzed state.",
                "bid": db.bids[idx]
            }
    raise HTTPException(status_code=404, detail=f"Bid {bid_id} not found")
