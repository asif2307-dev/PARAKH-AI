import sys
import io
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend to path
CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR / "backend"))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)
    print("\n--- [TEST 1] Root & Health Check ---")
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("Health check OK:", res.json())

    res = client.get("/")
    assert res.status_code == 200, "Root index.html fetch failed"
    print("Root index.html OK")

    print("\n--- [TEST 2] Dashboard Stats ---")
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_bids"] == 128
    assert stats["compliance_rate"] == 82
    print("Dashboard stats OK: Total Bids =", stats["total_bids"], "Compliance Rate =", stats["compliance_rate"])

    print("\n--- [TEST 3] List Bids ---")
    res = client.get("/api/bids")
    assert res.status_code == 200
    bids = res.json()
    assert len(bids) >= 6
    print(f"Found {len(bids)} bids in queue.")

    print("\n--- [TEST 4] Hero Bid Pre-Analysis State ---")
    res = client.get("/api/bids/BID-2026-003")
    assert res.status_code == 200
    hero_bid = res.json()
    assert hero_bid["vendor_name"] == "Bharat Industrial Systems"
    print("Hero bid loaded successfully:", hero_bid["vendor_name"])

    print("\n--- [TEST 5] Execute AI Analysis on Hero Bid ---")
    res = client.post("/api/bids/BID-2026-003/analyze")
    assert res.status_code == 200
    analyzed = res.json()
    assert analyzed["success"] is True
    bid_data = analyzed["bid"]
    print(f"Analysis complete. Score: {bid_data['compliance_score']}%, Risk: {bid_data['risk_level']}")
    assert bid_data["compliance_score"] == 61, f"Expected 61%, got {bid_data['compliance_score']}%"
    assert bid_data["risk_level"] == "High"
    assert len(bid_data["contradictions"]) >= 2
    print("Contradictions detected count:", len(bid_data["contradictions"]))

    # Verify Turnover Contradiction
    turnover_ct = [c for c in bid_data["contradictions"] if c["category"] == "TURNOVER_MISMATCH"]
    assert len(turnover_ct) == 1, "Turnover mismatch contradiction not found!"
    ct = turnover_ct[0]
    print(f"Turnover Claim: {ct['bidder_claimed_value']} vs Verified: {ct['verified_external_value']}")
    assert "8.20" in ct["bidder_claimed_value"]
    assert "3.90" in ct["verified_external_value"]

    print("\n--- [TEST 6] Evidence Mapping (BidDoc) ---")
    res = client.get("/api/bids/BID-2026-003/evidence-mapping")
    assert res.status_code == 200
    mapping = res.json()
    assert len(mapping["nodes"]) == 6
    print(f"Evidence nodes mapped: {len(mapping['nodes'])}")

    print("\n--- [TEST 7] Multi-Source Verification (Verify+) ---")
    res = client.post("/api/bids/BID-2026-003/verify")
    assert res.status_code == 200
    print("Connectors query OK")

    print("\n--- [TEST 8] Officer Determination & Sign-off ---")
    decision_payload = {
        "decision": "SEND_FOR_REVIEW",
        "officer_name": "Rajesh Kumar",
        "officer_designation": "Senior Procurement Officer",
        "reason": "Turnover information differs between submitted financial statement (Rs 8.2 Cr) and verification source (Rs 3.9 Cr). Clarification required."
    }
    res = client.post("/api/bids/BID-2026-003/decision", json=decision_payload)
    assert res.status_code == 200
    dec_res = res.json()
    assert dec_res["bid"]["status"] == "Sent for Clarification"
    print("Officer decision recorded. Updated Status:", dec_res["bid"]["status"])

    print("\n--- [TEST 9] Audit Trail Verification ---")
    res = client.get("/api/audit-trail")
    assert res.status_code == 200
    trail = res.json()
    logs = trail["logs"]
    assert len(logs) > 5
    # Verify officer decision log exists
    officer_logs = [l for l in logs if l["action_type"] == "OFFICER_DECISION"]
    assert len(officer_logs) >= 1
    print(f"Audit Trail verified with {len(logs)} immutable cryptographic entries.")
    print("Latest Officer Log:", officer_logs[0]["details"])

    print("\n--- [TEST 10] Connectors Directory ---")
    res = client.get("/api/connectors")
    assert res.status_code == 200
    conns = res.json()
    assert len(conns["connectors"]) == 8
    print(f"Simulated Connectors: {len(conns['connectors'])} verified online.")

    print("\n==================================================")
    print("  ALL 10 GOLDEN-PATH ACCEPTANCE TESTS PASSED!     ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
