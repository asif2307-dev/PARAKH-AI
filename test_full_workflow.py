import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR / "backend"))

from fastapi.testclient import TestClient
from app.main import app

def run_e2e_verification():
    client = TestClient(app)
    print("=" * 70)
    print("  PARAKH AI (SIH26100) - END-TO-END GOLDEN-PATH VERIFICATION")
    print("=" * 70)

    # 1. Reset
    print("\n[STEP 1] Resetting Demo Database to initial state...")
    r = client.post("/api/demo/reset")
    assert r.status_code == 200
    print("  ✓ Database reset OK.")

    # 2. Login
    print("\n[STEP 2] Testing Authentication / Login...")
    r = client.post("/api/auth/login", json={"username": "officer", "password": "demo123", "role": "officer"})
    assert r.status_code == 200
    login_data = r.json()
    assert login_data["success"] is True
    assert login_data["user"]["name"] == "Rajesh Kumar"
    print(f"  ✓ Logged in as: {login_data['user']['name']} ({login_data['user']['designation']})")

    # 3. Dashboard Stats
    print("\n[STEP 3] Fetching Dashboard Metrics...")
    r = client.get("/api/dashboard/stats")
    assert r.status_code == 200
    stats = r.json()
    print(f"  ✓ Total Bids: {stats['total_bids']}, Pending: {stats['pending_reviews']}, High Risk: {stats['high_risk_bids']}, Compliance Rate: {stats['compliance_rate']}%")
    print(f"  ✓ Review Time Benchmark: {stats['manual_review_time_hours']}h manual -> {stats['parakh_ai_review_time_hours']}h with PARAKH AI (85.7% saved)")

    # 4. Bids List
    print("\n[STEP 4] Fetching Bids Queue...")
    r = client.get("/api/bids")
    assert r.status_code == 200
    bids = r.json()
    print(f"  ✓ Total Bids in queue: {len(bids)}")

    # 5. Open Hero Bid
    print("\n[STEP 5] Opening Hero Bid: BID-2026-003...")
    r = client.get("/api/bids/BID-2026-003")
    assert r.status_code == 200
    hero = r.json()
    print(f"  ✓ Vendor: {hero['vendor_name']}")
    print(f"  ✓ Tender: {hero['tender_title']}")
    print(f"  ✓ Pre-Analysis Status: {hero['status']}")
    assert hero["status"] == "Under Analysis"

    # 6. Run AI Analysis & Contradiction Detection
    print("\n[STEP 6] Triggering AI Compliance Analysis...")
    r = client.post("/api/bids/BID-2026-003/analyze")
    assert r.status_code == 200
    analyzed = r.json()
    bid_res = analyzed["bid"]
    print(f"  ✓ Status Updated to: {bid_res['status']}")
    print(f"  ✓ Compliance Score: {bid_res['compliance_score']}% (Target: 61%)")
    print(f"  ✓ Assessed Risk Level: {bid_res['risk_level']} (Target: High)")
    assert bid_res["compliance_score"] == 61
    assert bid_res["risk_level"] == "High"

    # Verify Hero Contradiction (Turnover)
    turnover_ct = [c for c in bid_res["contradictions"] if c["category"] == "TURNOVER_MISMATCH"]
    assert len(turnover_ct) == 1, "Turnover contradiction missing!"
    print(f"  ✓ [HERO CONTRADICTION] Claimed: {turnover_ct[0]['bidder_claimed_value']} | Verified: {turnover_ct[0]['verified_external_value']}")
    assert "8.20" in turnover_ct[0]["bidder_claimed_value"]
    assert "3.90" in turnover_ct[0]["verified_external_value"]

    # Verify Expired Certificate Contradiction
    expired_ct = [c for c in bid_res["contradictions"] if c["category"] == "EXPIRED_CERTIFICATE"]
    assert len(expired_ct) == 1, "Expired certificate contradiction missing!"
    print(f"  ✓ [EXPIRED CERT CONTRADICTION] {expired_ct[0]['explanation']}")

    # 7. Evidence Mapping
    print("\n[STEP 7] Inspecting Evidence Mapping (BidDoc)...")
    r = client.get("/api/bids/BID-2026-003/evidence-mapping")
    assert r.status_code == 200
    mapping = r.json()
    print(f"  ✓ Mapped Clauses Count: {mapping['mapped_clauses_count']}")
    for node in mapping["nodes"][:3]:
      print(f"    - {node['clause_number']}: {node['clause_title']} -> Doc: {node['supporting_document']} (P.{node['page_number']}) -> Registry: {node['verification_source']}")

    # 8. Multi-Source Connectors
    print("\n[STEP 8] Inspecting Multi-Source Verification (Verify+)...")
    r = client.get("/api/connectors")
    assert r.status_code == 200
    connectors = r.json()["connectors"]
    print(f"  ✓ Active Simulated Connectors: {len(connectors)}")
    for c in connectors[:3]:
      print(f"    - {c['name']} ({c['status']}): {c['records_count']}")

    # 9. Officer Decision
    print("\n[STEP 9] Submitting Official Procurement Officer Determination...")
    decision_payload = {
        "decision": "SEND_FOR_REVIEW",
        "officer_name": "Rajesh Kumar",
        "officer_designation": "Senior Procurement Officer",
        "reason": "Turnover information differs between submitted financial statement (₹8.2 Cr) and verification source (₹3.9 Cr). Clarification required before tender committee review."
    }
    r = client.post("/api/bids/BID-2026-003/decision", json=decision_payload)
    assert r.status_code == 200
    dec_res = r.json()
    new_status = dec_res["bid"]["status"]
    print(f"  ✓ Officer Decision [SEND_FOR_REVIEW] Recorded.")
    print(f"  ✓ Bid Status Updated to: '{new_status}'")
    assert new_status == "Sent for Clarification"

    # 10. Audit Trail
    print("\n[STEP 10] Verifying Audit Trail Ledger...")
    r = client.get("/api/audit-trail")
    assert r.status_code == 200
    logs = r.json()["logs"]
    print(f"  ✓ Total Audit Trail Entries: {len(logs)}")
    latest_decision_log = next(l for l in logs if l["action_type"] == "OFFICER_DECISION")
    print(f"  ✓ Latest Officer Entry: [{latest_decision_log['timestamp']}] Actor: {latest_decision_log['actor']}")
    print(f"    Details: {latest_decision_log['details']}")
    print(f"    Cryptographic Hash: {latest_decision_log['hash_signature']}")

    print("\n" + "=" * 70)
    print("  ⭐ 100% END-TO-END GOLDEN-PATH WORKFLOW VERIFIED SUCCESSFULLY! ⭐")
    print("=" * 70)

if __name__ == "__main__":
    run_e2e_verification()
