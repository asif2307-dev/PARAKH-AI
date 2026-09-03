import copy
from typing import List, Dict, Any

INITIAL_BIDS_DATA: List[Dict[str, Any]] = [
    {
        "id": "BID-2026-003",
        "tender_id": "GEM/2026/B/882109",
        "tender_title": "Supply of Mechanical Equipment & High-Pressure Industrial Valves",
        "department": "Ministry of Heavy Industries / BHEL",
        "vendor_name": "Bharat Industrial Systems",
        "vendor_gstin": "27AABCB1234F1Z8",
        "vendor_pan": "AABCB1234F",
        "submission_date": "2026-02-28 14:22 IST",
        "status": "Under Analysis",  # Starts un-analyzed so user can trigger the live analysis flow!
        "compliance_score": 0,
        "risk_level": "Under Analysis",
        "passed_requirements": 0,
        "failed_requirements": 0,
        "review_requirements": 0,
        "contradictions_count": 0,
        "analyzed_at": None,
        "is_analyzed": False,
        "documents": [
            {
                "id": "DOC-001",
                "name": "Audited_Financial_Statements_FY24_25.pdf",
                "type": "FINANCIAL",
                "pages": 18,
                "size": "3.4 MB",
                "extracted_fields": {"Annual Turnover": "₹8,20,00,000", "Net Worth": "₹4,10,00,000"},
                "snippet": "Clause 12.3: The company achieved a consolidated annual turnover of INR 8.20 Crore (Eight Crore Twenty Lakhs) for the financial year ended March 31, 2025."
            },
            {
                "id": "DOC-002",
                "name": "ISO_9001_Quality_Certificate.pdf",
                "type": "TECHNICAL",
                "pages": 2,
                "size": "1.1 MB",
                "extracted_fields": {"Certificate No": "ISO-IND-89104", "Valid Till": "15-Nov-2025"},
                "snippet": "This is to certify that Bharat Industrial Systems complies with ISO 9001:2015. Validity Period: 16-Nov-2022 to 15-Nov-2025."
            },
            {
                "id": "DOC-003",
                "name": "Udyam_MSME_Registration_Cert.pdf",
                "type": "STATUTORY",
                "pages": 3,
                "size": "850 KB",
                "extracted_fields": {"Udyam Reg": "UDYAM-MH-03-009121", "Enterprise Type": "Medium"},
                "snippet": "Ministry of Micro, Small and Medium Enterprises - Registration UDYAM-MH-03-009121, Enterprise Classification: Medium Enterprise."
            },
            {
                "id": "DOC-004",
                "name": "GST_Registration_Certificate.pdf",
                "type": "STATUTORY",
                "pages": 3,
                "size": "1.2 MB",
                "extracted_fields": {"GSTIN": "27AABCB1234F1Z8", "Legal Name": "Bharat Industrial Systems"},
                "snippet": "Government of India - Form GST REG-06. Taxpayer Name: Bharat Industrial Systems, Status: Active Taxpayer."
            },
            {
                "id": "DOC-005",
                "name": "OEM_Authorization_Valves.pdf",
                "type": "TECHNICAL",
                "pages": 2,
                "size": "920 KB",
                "extracted_fields": {"MAF ID": "MAF-VALVE-2026", "Principal": "L&T Valves Division"},
                "snippet": "Manufacturer Authorization Form for Tender GEM/2026/B/882109: Authorized direct representative for supply & warranty."
            },
            {
                "id": "DOC-006",
                "name": "Non_Debarment_Affidavit.pdf",
                "type": "ELIGIBILITY",
                "pages": 2,
                "size": "1.5 MB",
                "extracted_fields": {"Notarized Date": "18-Feb-2026", "Status": "Clear"},
                "snippet": "Affidavit on Non-Judicial Stamp Paper: We hereby declare that Bharat Industrial Systems has never been debarred or blacklisted by any Government department."
            }
        ],
        "requirements": [
            {
                "id": "REQ-001",
                "clause_number": "Clause 4.1",
                "title": "Minimum Annual Turnover Threshold",
                "description": "The bidder must have an average minimum annual turnover of at least ₹5.00 Crore across the last three financial years (FY 2022-23, 2023-24, 2024-25).",
                "requirement_type": "FINANCIAL",
                "is_mandatory": True,
                "threshold_value": ">= ₹5.00 Crore",
                "evidence": {
                    "id": "EVD-001",
                    "document_name": "Audited_Financial_Statements_FY24_25.pdf",
                    "document_type": "FINANCIAL",
                    "page_number": 12,
                    "extracted_text": "Clause 12.3: Total revenue from operations for the financial year 2024-25 stands at ₹8.20 Crore (Eight Crore Twenty Lakhs Rupees).",
                    "extracted_value": "₹8.20 Crore",
                    "ocr_confidence": 96.4,
                    "highlight_bbox": {"x": 14, "y": 42, "width": 72, "height": 18}
                },
                "verification": {
                    "source_name": "MCA21 Corporate Registry & e-Filing",
                    "connector_id": "MCA21_API_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "Verified Turnover: ₹3.90 Crore (AOC-4 ROC Return 2024-25)",
                    "verification_status": "CONTRADICTION",
                    "confidence_score": 98.2,
                    "retrieval_timestamp": "2026-03-01 10:35:12 IST",
                    "metadata": {
                        "cin": "U29100MH2015PTC261942",
                        "roc_office": "ROC Mumbai",
                        "filing_ref": "AOC4-2025-99812",
                        "verified_turnover_cr": 3.90
                    }
                },
                "status": "CONTRADICTION",
                "risk_level": "HIGH",
                "match_confidence": 94.0,
                "finding_summary": "CONTRADICTION DETECTED: Submitted financial statement turnover (₹8.20 Cr) conflicts with verified ROC/MCA21 regulatory filing (₹3.90 Cr).",
                "contradiction_reason": "Submitted bidder document indicates ₹8.20 Crore turnover, whereas independent MCA21 ROC financial filing indicates ₹3.90 Crore (below the mandatory ₹5.00 Crore tender threshold)."
            },
            {
                "id": "REQ-002",
                "clause_number": "Clause 4.2",
                "title": "Quality Management System (ISO 9001:2015)",
                "description": "Bidder must possess a valid ISO 9001:2015 quality accreditation certificate in the field of mechanical equipment manufacturing.",
                "requirement_type": "TECHNICAL",
                "is_mandatory": True,
                "threshold_value": "Valid certification as on tender closing date",
                "evidence": {
                    "id": "EVD-002",
                    "document_name": "ISO_9001_Quality_Certificate.pdf",
                    "document_type": "TECHNICAL",
                    "page_number": 1,
                    "extracted_text": "Certificate No: ISO-IND-89104. Accredited QMS for manufacturing of valves. Valid Until: 15-Nov-2025.",
                    "extracted_value": "Expired: 15-Nov-2025",
                    "ocr_confidence": 98.5,
                    "highlight_bbox": {"x": 20, "y": 68, "width": 60, "height": 14}
                },
                "verification": {
                    "source_name": "BIS / Quality Accreditation Directory",
                    "connector_id": "BIS_PORTAL_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "Certificate EXPIRED on 15-Nov-2025; Renewal application not submitted",
                    "verification_status": "CONTRADICTION",
                    "confidence_score": 96.8,
                    "retrieval_timestamp": "2026-03-01 10:35:18 IST",
                    "metadata": {
                        "body": "NABCB Accredited Registrar",
                        "status": "EXPIRED",
                        "grace_period_expired": True
                    }
                },
                "status": "CONTRADICTION",
                "risk_level": "HIGH",
                "match_confidence": 97.2,
                "finding_summary": "EXPIRED CERTIFICATE: The submitted ISO 9001:2015 certificate expired on 15-Nov-2025. Verification confirms no renewal on file.",
                "contradiction_reason": "Tender mandates active valid accreditation on bid submission date (28-Feb-2026). The submitted accreditation expired 105 days prior."
            },
            {
                "id": "REQ-003",
                "clause_number": "Clause 2.4",
                "title": "EMD Waiver Eligibility / MSME Classification",
                "description": "Exemption from Earnest Money Deposit (EMD) is granted exclusively to Micro and Small Enterprises (MSEs) registered on Udyam.",
                "requirement_type": "STATUTORY",
                "is_mandatory": False,
                "threshold_value": "Micro or Small Enterprise status on Udyam",
                "evidence": {
                    "id": "EVD-003",
                    "document_name": "Udyam_MSME_Registration_Cert.pdf",
                    "document_type": "STATUTORY",
                    "page_number": 2,
                    "extracted_text": "Bidder submitted declaration requesting 100% EMD waiver citing Udyam Registration UDYAM-MH-03-009121.",
                    "extracted_value": "Claimed MSE Waiver",
                    "ocr_confidence": 93.1,
                    "highlight_bbox": {"x": 12, "y": 55, "width": 76, "height": 16}
                },
                "verification": {
                    "source_name": "Udyam MSME Verification Portal",
                    "connector_id": "UDYAM_API_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "UDYAM-MH-03-009121 registered as 'Medium Enterprise' (Plant investment > ₹10 Cr)",
                    "verification_status": "CONTRADICTION",
                    "confidence_score": 99.0,
                    "retrieval_timestamp": "2026-03-01 10:35:22 IST",
                    "metadata": {
                        "category": "Medium",
                        "investment_plant_cr": 12.4,
                        "eligible_for_mse_waiver": False
                    }
                },
                "status": "NEEDS_REVIEW",
                "risk_level": "MEDIUM",
                "match_confidence": 91.5,
                "finding_summary": "ELIGIBILITY MISMATCH: Entity claims MSE EMD exemption, but official Udyam database classifies entity as 'Medium Enterprise'.",
                "contradiction_reason": "Government public procurement policy grants EMD exemption solely to Micro & Small enterprises. Bidder is a Medium Enterprise."
            },
            {
                "id": "REQ-004",
                "clause_number": "Clause 3.1",
                "title": "GST Registration & Filing Compliance",
                "description": "Bidder must possess a valid, active GSTIN and must have filed all statutory returns (GSTR-3B) for the preceding 6 months.",
                "requirement_type": "STATUTORY",
                "is_mandatory": True,
                "threshold_value": "Active GSTIN & up-to-date return filing",
                "evidence": {
                    "id": "EVD-004",
                    "document_name": "GST_Registration_Certificate.pdf",
                    "document_type": "STATUTORY",
                    "page_number": 1,
                    "extracted_text": "GSTIN: 27AABCB1234F1Z8, Legal Name: Bharat Industrial Systems, Constitution: Private Limited Company.",
                    "extracted_value": "27AABCB1234F1Z8 (Active)",
                    "ocr_confidence": 99.2,
                    "highlight_bbox": {"x": 15, "y": 25, "width": 70, "height": 15}
                },
                "verification": {
                    "source_name": "GSTN Common Portal Services",
                    "connector_id": "GSTN_API_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "GSTIN ACTIVE; GSTR-3B filed up to Jan 2026; Taxpayer in good standing",
                    "verification_status": "VERIFIED_MATCH",
                    "confidence_score": 99.6,
                    "retrieval_timestamp": "2026-03-01 10:35:25 IST",
                    "metadata": {
                        "gstin_status": "Active",
                        "last_filed_period": "January 2026",
                        "jurisdiction": "State Ward 04, Mumbai West"
                    }
                },
                "status": "COMPLIANT",
                "risk_level": "LOW",
                "match_confidence": 99.4,
                "finding_summary": "VERIFIED MATCH: GSTIN is active and compliant with timely monthly tax return filings.",
                "contradiction_reason": None
            },
            {
                "id": "REQ-005",
                "clause_number": "Clause 5.2",
                "title": "Central & GeM Debarment / Blacklist Screening",
                "description": "The bidder and its directors must not be debarred, blacklisted, or put on holiday list by GeM, CVC, or any Central/State PSU.",
                "requirement_type": "ELIGIBILITY",
                "is_mandatory": True,
                "threshold_value": "Zero debarment or vigilance alerts",
                "evidence": {
                    "id": "EVD-005",
                    "document_name": "Non_Debarment_Affidavit.pdf",
                    "document_type": "ELIGIBILITY",
                    "page_number": 2,
                    "extracted_text": "Solemnly affirmed that neither Bharat Industrial Systems nor its directors are listed on any Central Vigilance Commission debarment list.",
                    "extracted_value": "Notarized Non-Debarment Affidavit",
                    "ocr_confidence": 97.4,
                    "highlight_bbox": {"x": 10, "y": 30, "width": 80, "height": 20}
                },
                "verification": {
                    "source_name": "CVC & GeM Unified Debarment Repository",
                    "connector_id": "CVC_DEBARMENT_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "CLEARED: No active debarment or vigilance flag found for PAN AABCB1234F",
                    "verification_status": "VERIFIED_MATCH",
                    "confidence_score": 100.0,
                    "retrieval_timestamp": "2026-03-01 10:35:28 IST",
                    "metadata": {
                        "pan_checked": "AABCB1234F",
                        "cvc_alert": "None",
                        "gem_incident_score": "0 (Clean)"
                    }
                },
                "status": "COMPLIANT",
                "risk_level": "LOW",
                "match_confidence": 100.0,
                "finding_summary": "VERIFIED MATCH: Bidder passes national debarment screening without adverse vigilance records.",
                "contradiction_reason": None
            },
            {
                "id": "REQ-006",
                "clause_number": "Clause 6.1",
                "title": "OEM Authorization for Critical Flow Valves",
                "description": "Authorized partner certificate directly from the original equipment manufacturer (OEM) confirming warranty back-to-back support.",
                "requirement_type": "TECHNICAL",
                "is_mandatory": True,
                "threshold_value": "Valid MAF issued for this tender ID",
                "evidence": {
                    "id": "EVD-006",
                    "document_name": "OEM_Authorization_Valves.pdf",
                    "document_type": "TECHNICAL",
                    "page_number": 1,
                    "extracted_text": "L&T Valves Division certifies Bharat Industrial Systems as authorized project distributor for GEM/2026/B/882109.",
                    "extracted_value": "MAF-VALVE-2026 Verified",
                    "ocr_confidence": 95.8,
                    "highlight_bbox": {"x": 18, "y": 48, "width": 64, "height": 18}
                },
                "verification": {
                    "source_name": "OEM Digital Partner Verification Hub",
                    "connector_id": "OEM_VERIFY_SIMULATOR",
                    "is_simulated": True,
                    "verified_value": "MAF-VALVE-2026 confirmed valid and active by OEM partner desk",
                    "verification_status": "VERIFIED_MATCH",
                    "confidence_score": 95.0,
                    "retrieval_timestamp": "2026-03-01 10:35:31 IST",
                    "metadata": {
                        "issuer": "L&T Valves Business Group",
                        "validity_tender": "GEM/2026/B/882109",
                        "status": "AUTHENTIC"
                    }
                },
                "status": "COMPLIANT",
                "risk_level": "LOW",
                "match_confidence": 95.0,
                "finding_summary": "VERIFIED MATCH: OEM manufacturer authorization is authentic and specifically tied to this tender.",
                "contradiction_reason": None
            }
        ],
        "contradictions": [
            {
                "id": "CT-001",
                "requirement_id": "REQ-001",
                "clause_title": "Clause 4.1: Annual Turnover Threshold",
                "category": "TURNOVER_MISMATCH",
                "severity": "CRITICAL",
                "tender_specification": "Minimum average annual turnover >= ₹5.00 Crore",
                "bidder_claimed_value": "₹8.20 Crore (Declared in Financial Statement)",
                "verified_external_value": "₹3.90 Crore (Official MCA21 ROC Return)",
                "evidence_document": "Audited_Financial_Statements_FY24_25.pdf",
                "evidence_page": 12,
                "verification_source": "MCA21 Corporate Registry (Simulated Connector)",
                "risk_impact": "Discrepancy of ₹4.30 Crore between submitted statement and statutory corporate filing. Verified figure falls below mandatory ₹5 Cr qualification criterion.",
                "explanation": "Potential inconsistency: Submitted financial statements show ₹8.20 Crore turnover, but verified government filings at MCA21 record only ₹3.90 Crore for the same period. Requires officer review and formal clarification."
            },
            {
                "id": "CT-002",
                "requirement_id": "REQ-002",
                "clause_title": "Clause 4.2: ISO 9001:2015 Accreditation",
                "category": "EXPIRED_CERTIFICATE",
                "severity": "HIGH",
                "tender_specification": "Active ISO 9001:2015 accreditation as on bid opening date",
                "bidder_claimed_value": "ISO-IND-89104 submitted",
                "verified_external_value": "Expired on 15-Nov-2025 (105 days overdue)",
                "evidence_document": "ISO_9001_Quality_Certificate.pdf",
                "evidence_page": 1,
                "verification_source": "BIS / Quality Accreditation Directory (Simulated Connector)",
                "risk_impact": "Non-compliance with mandatory technical qualification clause. Quality assurance standard may not be currently certified.",
                "explanation": "Contradiction detected: The submitted certificate reached expiry prior to tender submission. National accreditation portal records no active renewal."
            },
            {
                "id": "CT-003",
                "requirement_id": "REQ-003",
                "clause_title": "Clause 2.4: EMD Exemption Eligibility",
                "category": "NAME_MISMATCH",
                "severity": "MEDIUM",
                "tender_specification": "EMD exemption applicable exclusively to Micro and Small Enterprises (MSEs)",
                "bidder_claimed_value": "Claimed 100% EMD fee waiver as an MSE",
                "verified_external_value": "Udyam Portal classifies vendor as 'Medium Enterprise'",
                "evidence_document": "Udyam_MSME_Registration_Cert.pdf",
                "evidence_page": 2,
                "verification_source": "Udyam MSME Portal (Simulated Connector)",
                "risk_impact": "Vendor ineligible for tender fee/EMD exemption under Public Procurement Policy (MSEs) Order 2012.",
                "explanation": "Potential inconsistency: The vendor claimed EMD exemption citing MSME status, but Udyam registration reflects Medium Enterprise classification, for which EMD deposit is legally required."
            }
        ],
        "officer_decision": None
    },
    {
        "id": "BID-2026-002",
        "tender_id": "GEM/2026/B/771092",
        "tender_title": "Pipeline Maintenance Services & Cathodic Protection",
        "department": "Indian Oil Corporation Ltd. (IOCL)",
        "vendor_name": "XYZ Infra Solutions",
        "vendor_gstin": "07AAACX9876Q1Z3",
        "vendor_pan": "AAACX9876Q",
        "submission_date": "2026-02-27 11:15 IST",
        "status": "Compliant",
        "compliance_score": 94,
        "risk_level": "Low",
        "passed_requirements": 6,
        "failed_requirements": 0,
        "review_requirements": 0,
        "contradictions_count": 0,
        "analyzed_at": "2026-03-01 09:15 IST",
        "is_analyzed": True,
        "documents": [
            {"id": "DOC-201", "name": "Audited_Turnover_FY24_25.pdf", "type": "FINANCIAL", "pages": 14, "size": "2.8 MB"},
            {"id": "DOC-202", "name": "ISO_9001_2015_Certificate.pdf", "type": "TECHNICAL", "pages": 2, "size": "950 KB"},
            {"id": "DOC-203", "name": "GST_Registration.pdf", "type": "STATUTORY", "pages": 3, "size": "1.1 MB"}
        ],
        "requirements": [],
        "contradictions": [],
        "officer_decision": {
            "decision": "APPROVE",
            "officer_name": "Rajesh Kumar",
            "officer_designation": "Senior Procurement Officer",
            "timestamp": "2026-03-01 09:30 IST",
            "reason": "All 6 eligibility and statutory criteria verified successfully against independent registries. Risk score Low."
        }
    },
    {
        "id": "BID-2026-001",
        "tender_id": "GEM/2026/B/661201",
        "tender_title": "Industrial Equipment Procurement & Automation Racks",
        "department": "Steel Authority of India Ltd. (SAIL)",
        "vendor_name": "ABC Engineering Pvt. Ltd.",
        "vendor_gstin": "24AAACA5555L1Z1",
        "vendor_pan": "AAACA5555L",
        "submission_date": "2026-02-26 16:40 IST",
        "status": "Needs Review",
        "compliance_score": 82,
        "risk_level": "Medium",
        "passed_requirements": 5,
        "failed_requirements": 0,
        "review_requirements": 1,
        "contradictions_count": 1,
        "analyzed_at": "2026-03-01 08:50 IST",
        "is_analyzed": True,
        "documents": [
            {"id": "DOC-101", "name": "Financial_Balance_Sheet.pdf", "type": "FINANCIAL", "pages": 16, "size": "3.1 MB"},
            {"id": "DOC-102", "name": "PAN_Card_Copy.pdf", "type": "STATUTORY", "pages": 1, "size": "450 KB"}
        ],
        "requirements": [],
        "contradictions": [
            {
                "id": "CT-101",
                "requirement_id": "REQ-101",
                "clause_title": "Vendor Identification Consistency",
                "category": "NAME_MISMATCH",
                "severity": "MEDIUM",
                "tender_specification": "Matching vendor corporate entity name across GST and Income Tax PAN",
                "bidder_claimed_value": "ABC Engineering Pvt. Ltd.",
                "verified_external_value": "ABC Engineering & Infrastructure Private Limited",
                "evidence_document": "PAN_Card_Copy.pdf",
                "evidence_page": 1,
                "verification_source": "Income Tax PAN Portal (Simulated Connector)",
                "risk_impact": "Minor spelling/amalgamation nomenclature difference requiring officer verification of entity continuity.",
                "explanation": "Potential inconsistency: Name on PAN records contains '& Infrastructure'. MCA21 records indicate corporate name change in 2023."
            }
        ],
        "officer_decision": None
    },
    {
        "id": "BID-2026-004",
        "tender_id": "GEM/2026/B/893122",
        "tender_title": "High-Speed Centrifugal Pumps & Submersible Units",
        "department": "Jal Jeevan Mission / Ministry of Jal Shakti",
        "vendor_name": "Kirloskar Dynamics Ltd.",
        "vendor_gstin": "27AAACK1122D1Z0",
        "vendor_pan": "AAACK1122D",
        "submission_date": "2026-02-28 17:50 IST",
        "status": "Compliant",
        "compliance_score": 96,
        "risk_level": "Low",
        "passed_requirements": 6,
        "failed_requirements": 0,
        "review_requirements": 0,
        "contradictions_count": 0,
        "analyzed_at": "2026-03-01 11:20 IST",
        "is_analyzed": True,
        "documents": [],
        "requirements": [],
        "contradictions": [],
        "officer_decision": None
    },
    {
        "id": "BID-2026-005",
        "tender_id": "GEM/2026/B/901234",
        "tender_title": "IT Infrastructure, Server Racks & Fiber Backbone",
        "department": "Ministry of Electronics & IT (MeitY)",
        "vendor_name": "CyberTech Solutions LLP",
        "vendor_gstin": "06AAACC4433P1Z9",
        "vendor_pan": "AAACC4433P",
        "submission_date": "2026-02-25 10:05 IST",
        "status": "Non-Compliant",
        "compliance_score": 48,
        "risk_level": "High",
        "passed_requirements": 3,
        "failed_requirements": 3,
        "review_requirements": 0,
        "contradictions_count": 2,
        "analyzed_at": "2026-03-01 12:00 IST",
        "is_analyzed": True,
        "documents": [],
        "requirements": [],
        "contradictions": [
            {
                "id": "CT-501",
                "requirement_id": "REQ-501",
                "clause_title": "Mandatory OEM Authorization",
                "category": "MISSING_MANDATORY_DOC",
                "severity": "CRITICAL",
                "tender_specification": "Bidder must submit direct OEM authorization for core switches",
                "bidder_claimed_value": "Self-Declaration of reseller capability",
                "verified_external_value": "OEM Authorization not provided in bid package",
                "evidence_document": "Technical_Proposal.pdf",
                "evidence_page": 4,
                "verification_source": "Document Extraction Engine",
                "risk_impact": "Mandatory technical disqualification clause.",
                "explanation": "Missing mandatory document: Tender strictly disallows resale without valid OEM certificate."
            }
        ],
        "officer_decision": None
    },
    {
        "id": "BID-2026-006",
        "tender_id": "GEM/2026/B/914567",
        "tender_title": "400kV Substation Step-Down Transformers",
        "department": "Power Grid Corporation of India Ltd.",
        "vendor_name": "PowerGrid Equipments India",
        "vendor_gstin": "03AAACP7766N1Z4",
        "vendor_pan": "AAACP7766N",
        "submission_date": "2026-02-28 09:30 IST",
        "status": "Needs Review",
        "compliance_score": 78,
        "risk_level": "Medium",
        "passed_requirements": 5,
        "failed_requirements": 0,
        "review_requirements": 1,
        "contradictions_count": 1,
        "analyzed_at": "2026-03-01 13:10 IST",
        "is_analyzed": True,
        "documents": [],
        "requirements": [],
        "contradictions": [],
        "officer_decision": None
    }
]

INITIAL_AUDIT_LOGS = [
    {
        "id": "LOG-1001",
        "timestamp": "2026-03-01 08:30:15 IST",
        "bid_id": "BID-2026-001",
        "action_type": "BID_INGESTED",
        "actor": "GeM Integration Portal",
        "details": "Bid BID-2026-001 submitted by ABC Engineering Pvt. Ltd. ingested into PARAKH AI queue.",
        "status_tag": "INFO",
        "hash_signature": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    },
    {
        "id": "LOG-1002",
        "timestamp": "2026-03-01 08:50:22 IST",
        "bid_id": "BID-2026-001",
        "action_type": "CONTRADICTION_FLAGGED",
        "actor": "PARAKH AI Engine",
        "details": "Potential inconsistency detected: Name on PAN records differs slightly from GST registered trade name.",
        "status_tag": "ALERT",
        "hash_signature": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    },
    {
        "id": "LOG-1003",
        "timestamp": "2026-03-01 09:15:40 IST",
        "bid_id": "BID-2026-002",
        "action_type": "EVIDENCE_MAPPED",
        "actor": "PARAKH AI Engine (BidDoc)",
        "details": "All 6 tender clauses mapped with supporting documents. Average OCR confidence 97.8%.",
        "status_tag": "SUCCESS",
        "hash_signature": "sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    },
    {
        "id": "LOG-1004",
        "timestamp": "2026-03-01 09:30:11 IST",
        "bid_id": "BID-2026-002",
        "action_type": "OFFICER_DECISION",
        "actor": "Officer Rajesh Kumar",
        "details": "Officer Decision recorded: [APPROVED]. Remark: All statutory & eligibility criteria verified against trusted registries.",
        "status_tag": "SUCCESS",
        "hash_signature": "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
    },
    {
        "id": "LOG-1005",
        "timestamp": "2026-03-01 10:32:00 IST",
        "bid_id": "BID-2026-003",
        "action_type": "BID_INGESTED",
        "actor": "GeM Integration Portal",
        "details": "Bid BID-2026-003 submitted by Bharat Industrial Systems ingested. 6 PDF documents queued for OCR.",
        "status_tag": "INFO",
        "hash_signature": "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"
    }
]

SIMULATED_CONNECTORS = [
    {
        "id": "MCA21",
        "name": "Ministry of Corporate Affairs (MCA21)",
        "type": "ROC / Financials & Filings",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 142,
        "records_count": "18.4 Lakh Entities",
        "description": "Authenticates ROC annual filings (Form AOC-4 / MGT-7), audited turnover, paid-up capital, and director status."
    },
    {
        "id": "GSTN",
        "name": "Goods & Services Tax Network (GSTN)",
        "type": "Taxation & Return Compliance",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 98,
        "records_count": "1.41 Crore GSTINs",
        "description": "Verifies GSTIN validity, active/suspended status, return filing history (GSTR-1, GSTR-3B), and aggregate turnover bracket."
    },
    {
        "id": "UDYAM",
        "name": "Udyam MSME Registration Portal",
        "type": "MSME Category & Exemption",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 115,
        "records_count": "2.1 Crore Enterprises",
        "description": "Cross-verifies Micro, Small, or Medium classification for tender fee & Earnest Money Deposit (EMD) exemption."
    },
    {
        "id": "PAN_IT",
        "name": "Income Tax PAN Verification Hub",
        "type": "Direct Taxation & Identity",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 84,
        "records_count": "65 Crore PANs",
        "description": "Validates exact entity legal name, constitution type, and Income Tax Return (ITR) acknowledgment continuity."
    },
    {
        "id": "CVC_DEBAR",
        "name": "CVC & GeM Debarment Repository",
        "type": "Vigilance & Blacklist Screening",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 65,
        "records_count": "All Central PSUs",
        "description": "Scans nationwide debarment orders, holiday listings, and vigilance flags across GeM and public sector enterprises."
    },
    {
        "id": "BIS_PORTAL",
        "name": "Bureau of Indian Standards (BIS) / NABCB",
        "type": "Quality & Technical Accreditation",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 130,
        "records_count": "National Certifications",
        "description": "Checks live validity of ISO 9001, ISO 14001, CE marks, and national quality standards certificates."
    },
    {
        "id": "EPFO_ESIC",
        "name": "EPFO & ESIC Statutory Portal",
        "type": "Labor & Social Security Compliance",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 110,
        "records_count": "Formal Sector Employers",
        "description": "Validates statutory provident fund and employee state insurance compliance and electronic challans."
    },
    {
        "id": "DIGILOCKER",
        "name": "DigiLocker Entity Locker Connector",
        "type": "Digital Document Verification",
        "status": "ACTIVE (Simulated)",
        "latency_ms": 175,
        "records_count": "Issued Government Docs",
        "description": "Verifies digitally signed documents and cryptographic hashes issued by verified authorities."
    }
]

class DemoDatabase:
    """In-memory demo database with state reset capability."""
    def __init__(self):
        self.reset()

    def reset(self):
        self.bids = copy.deepcopy(INITIAL_BIDS_DATA)
        self.audit_logs = copy.deepcopy(INITIAL_AUDIT_LOGS)
        self.connectors = copy.deepcopy(SIMULATED_CONNECTORS)

db = DemoDatabase()
