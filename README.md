# PARAKH AI — AI-Powered Bid Compliance Platform for GeM

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026_Prototype-orange.svg)](https://sih.gov.in)
[![Problem Statement](https://img.shields.io/badge/PS_ID-SIH26100-blue.svg)](https://gem.gov.in)
[![Team](https://img.shields.io/badge/Team-BUTTER_CHICKEN-green.svg)]()
[![Theme](https://img.shields.io/badge/Theme-Smart_Automation-purple.svg)]()

> **"Verify evidence. Detect contradictions. Make procurement decisions with confidence."**

---

## 1. Overview & Problem Statement

In public procurement on the **Government e-Marketplace (GeM)**, evaluating tender bids across technical qualifications, statutory financial thresholds, MSME exemptions, and quality certifications is an intensely manual, error-prone process. A single vendor evaluation typically consumes **14 hours** of manual review, leading to cross-source verification gaps and compromised auditability.

**PARAKH AI** is an AI-assisted decision-support platform that slashes review time from **14 hours to 2 hours (85.7% reduction)** by combining:
1. **Tender Intelligence & Extraction** (PaddleOCR & LLM parsing)
2. **Requirement–Evidence Mapping (BidDoc)**: Automatic linkage of clauses to document pages & snippets.
3. **Multi-Source Verification (Verify+)**: Independent cross-verification against regulatory databases (MCA21, GSTN, Udyam, Debarment).
4. **Deterministic Compliance & Contradiction Engine**: AI extracts claims; deterministic rule logic evaluates compliance.
5. **Officer-Led Sign-Off & Audit Trail**: The human procurement officer always holds final authority.

---

## 2. Core Architecture (Matching SIH Final PPT Slide 3)

```
                       ┌──────────────────────────────────────────────┐
                       │             GeM / Tender Data                │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │ Tender Intelligence & Requirement Extraction │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │ Bidder Documents (PDF/Scans) → OCR + Doc AI  │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │ RAG + Semantic Evidence Matching (BidDoc)    │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │   Rule / Compliance Engine (Deterministic)   │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │ Risk + Contradiction Detection (Verify+)     │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │  Officer Dashboard & Final Sign-Off (Human)  │
                       └──────────────────────────────────────────────┘
```

---

## 3. Quick Start & How to Run

### Prerequisites
- Python 3.10+ (Installed on system)
- Web browser (Chrome, Edge, Firefox)

### Launch Command
Open a terminal in `C:\Users\moasi\.gemini\antigravity\scratch\parakh-ai` and run:

```powershell
python main.py
```
*(Alternatively double-click `run.bat` or run `.\run.ps1`)*

The server will initialize on:
👉 **`http://127.0.0.1:8000`**

### Demo Login Credentials
- **Username:** `officer`
- **Password:** `demo123`
- **Role:** Procurement Officer (Rajesh Kumar, Senior Procurement Officer)

---

## 4. The 3–5 Minute Golden Path Demo Flow

Follow this exact sequence during SIH jury evaluation:

1. **Dashboard Overview (30 seconds)**:
   - Navigate to `http://127.0.0.1:8000`.
   - Point out key platform metrics: **128 Total Bids**, **17 Pending Reviews**, **6 High Risk**, **82% Compliance Rate**.
   - Highlight the **Review Time Benchmark** (14h manual → 2h with PARAKH AI) and **Deterministic Rule Engine** principle.

2. **Open Hero Demo Bid (30 seconds)**:
   - Click the prominent **"Launch Hero Demo Bid (BID-2026-003)"** button (or select from Bids Management).
   - Vendor: **Bharat Industrial Systems** (Supply of Mechanical Equipment & Valves, BHEL).
   - Notice the un-analyzed status.

3. **Trigger AI Analysis & Verification (30 seconds)**:
   - Click **"Start AI Compliance Analysis"**.
   - Observe the live 5-stage pipeline: Clause Extraction → OCR Parsing → BidDoc Mapping → Verify+ Connectors → Contradiction Check.

4. **Contradiction Detection — HERO FEATURE (60 seconds)**:
   - Inspect the high-visibility **CONTRADICTION DETECTED** banner:
     - **Turnover Mismatch**: Tender requires $\ge$ ₹5.0 Cr. Bidder submitted financial statement claiming **₹8.20 Cr**, but MCA21 ROC verified return indicates only **₹3.90 Cr**.
     - **Expired Certificate**: ISO 9001:2015 expired on 15-Nov-2025.
     - **Eligibility Mismatch**: Claimed MSE waiver, but registered as a Medium Enterprise on Udyam.
   - Click **"Inspect Page 12"** to open the realistic document preview showing the yellow-highlighted bounding box snippet.

5. **Officer Determination & Sign-Off (45 seconds)**:
   - Click **"Record Officer Decision"**.
   - Select **"SEND FOR REVIEW (Clarification)"**.
   - Select the preset remark: *"Turnover information differs between submitted financial statement (₹8.2 Cr) and verification source (₹3.9 Cr). Clarification required."*
   - Click **"Submit Official Decision & Sign"**.
   - Confirm status changes to **"Sent for Clarification"**.

6. **Audit Trail Verification (30 seconds)**:
   - Navigate to **Audit Trail** in the sidebar.
   - Show the sequential, cryptographically signed ledger (`sha256:...`) confirming every AI action and the officer's final decision.

---

## 5. Transparent Simulation Disclosure

In strict adherence to Smart India Hackathon integrity guidelines:
- External government connectors (**MCA21**, **GSTN**, **Udyam**, **CVC Debarment**, **BIS**) run in a high-fidelity **Simulated Sandbox**.
- The architecture implements pluggable client interfaces ready for live government API gateway endpoints without code rewrites.
- The prototype requires **no paid API keys** and runs completely offline and deterministically.
