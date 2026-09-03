from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RequirementEvidence(BaseModel):
    id: str
    document_name: str
    document_type: str
    page_number: int
    extracted_text: str
    extracted_value: str
    ocr_confidence: float # e.g. 94.5
    highlight_bbox: Optional[Dict[str, float]] = None # e.g. {x: 10, y: 20, width: 80, height: 15}

class VerificationSourceResult(BaseModel):
    source_name: str # e.g. "MCA21 Registry", "GSTN Portal", "Udyam Portal", "CVC Debarment List"
    connector_id: str
    is_simulated: bool = True
    verified_value: str
    verification_status: str # "VERIFIED_MATCH", "CONTRADICTION", "NOT_FOUND", "PENDING"
    confidence_score: float
    retrieval_timestamp: str
    metadata: Dict[str, Any] = {}

class TenderRequirement(BaseModel):
    id: str
    clause_number: str
    title: str
    description: str
    requirement_type: str # "FINANCIAL", "TECHNICAL", "ELIGIBILITY", "STATUTORY"
    is_mandatory: bool
    threshold_value: Optional[str] = None
    
    # Evidence linkage (BidDoc)
    evidence: Optional[RequirementEvidence] = None
    
    # External verification (Verify+)
    verification: Optional[VerificationSourceResult] = None
    
    # AI Engine Evaluation
    status: str # "COMPLIANT", "CONTRADICTION", "NEEDS_REVIEW", "NON_COMPLIANT", "PENDING"
    risk_level: str # "LOW", "MEDIUM", "HIGH"
    match_confidence: float
    finding_summary: str
    contradiction_reason: Optional[str] = None

class ContradictionItem(BaseModel):
    id: str
    requirement_id: str
    clause_title: str
    category: str # "TURNOVER_MISMATCH", "EXPIRED_CERTIFICATE", "NAME_MISMATCH", "MISSING_MANDATORY_DOC", "OEM_INVALID"
    severity: str # "HIGH", "CRITICAL", "MEDIUM"
    tender_specification: str
    bidder_claimed_value: str
    verified_external_value: str
    evidence_document: str
    evidence_page: int
    verification_source: str
    risk_impact: str
    explanation: str

class BidSummary(BaseModel):
    id: str
    tender_id: str
    tender_title: str
    department: str
    vendor_name: str
    vendor_gstin: str
    vendor_pan: str
    submission_date: str
    status: str # "Under Analysis", "Needs Review", "Compliant", "Non-Compliant", "Approved", "Rejected", "Sent for Clarification"
    compliance_score: int # 0 - 100
    risk_level: str # "Low", "Medium", "High"
    passed_requirements: int
    failed_requirements: int
    review_requirements: int
    contradictions_count: int
    analyzed_at: Optional[str] = None

class BidDetail(BidSummary):
    requirements: List[TenderRequirement] = []
    contradictions: List[ContradictionItem] = []
    documents: List[Dict[str, Any]] = []
    officer_decision: Optional[Dict[str, Any]] = None

class OfficerDecisionRequest(BaseModel):
    decision: str # "APPROVE", "REJECT", "SEND_FOR_REVIEW"
    officer_name: str
    officer_designation: str
    reason: str
    digital_signature: Optional[str] = None

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    bid_id: Optional[str] = None
    action_type: str # "BID_INGESTED", "OCR_EXTRACTED", "EVIDENCE_MAPPED", "CONNECTOR_VERIFIED", "CONTRADICTION_FLAGGED", "OFFICER_DECISION", "DEMO_RESET"
    actor: str # "PARAKH AI Engine", "Officer Rajesh Kumar", "System", "Admin"
    details: str
    status_tag: str # "SUCCESS", "ALERT", "CRITICAL", "INFO"
    hash_signature: str

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class DashboardStats(BaseModel):
    total_bids: int
    pending_reviews: int
    high_risk_bids: int
    compliance_rate: int
    bids_analyzed: int
    manual_review_hours_saved: float
    buyer_organizations: str
    gem_gmv_secured: str
    sample_batch_outcome: Dict[str, int]
