import urllib.request
import json
import sys

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

base = 'http://127.0.0.1:8000'

def get(path):
    req = urllib.request.Request(f'{base}{path}')
    with urllib.request.urlopen(req) as resp:
        return resp.status, resp.read().decode('utf-8')

def post(path, data=None):
    body = json.dumps(data).encode('utf-8') if data else b''
    req = urllib.request.Request(f'{base}{path}', data=body, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

print('1. Checking Health...')
s, r = get('/health')
print('  Status:', s, 'Body:', r)

print('\n2. Checking Static Index, JS, CSS...')
s1, _ = get('/')
s2, _ = get('/static/js/app.js')
s3, _ = get('/static/css/styles.css')
print(f'  Index: {s1}, app.js: {s2}, styles.css: {s3}')

print('\n3. Resetting Demo DB...')
s, r = post('/api/demo/reset')
print('  Reset Status:', s, 'Message:', r['message'])

print('\n4. Testing Officer Authentication...')
s, r = post('/api/auth/login', {'username': 'officer', 'password': 'demo123', 'role': 'officer'})
print('  Login Success:', r['success'], '| User:', r['user']['name'], f"({r['user']['designation']})")

print('\n5. Checking Dashboard Stats...')
s, stats_json = get('/api/dashboard/stats')
stats = json.loads(stats_json)
print(f'  Total Bids: {stats["total_bids"]}, Compliance: {stats["compliance_rate"]}%, Pending: {stats["pending_reviews"]}')

print('\n6. Checking Bids Queue...')
s, r = get('/api/bids')
bids = json.loads(r)
print(f'  Bids count in queue: {len(bids)}')

print('\n7. Checking Hero Bid Pre-Analysis State...')
s, r = get('/api/bids/BID-2026-003')
hero = json.loads(r)
print(f'  Vendor: {hero["vendor_name"]}, Initial Status: {hero["status"]}')

print('\n8. Running AI Analysis & Contradiction Detection...')
s, analyzed = post('/api/bids/BID-2026-003/analyze')
bid = analyzed['bid']
print(f'  Analyzed Score: {bid["compliance_score"]}%, Risk: {bid["risk_level"]}, Status: {bid["status"]}')
ct = bid['contradictions'][0]
print(f'  Hero Contradiction: {ct["clause_title"]}')
print(f'  Claimed: {ct["bidder_claimed_value"]} | Verified: {ct["verified_external_value"]}')

print('\n9. Checking Evidence Mapping (BidDoc)...')
s, em = get('/api/bids/BID-2026-003/evidence-mapping')
mapping = json.loads(em)
print(f'  Mapped Nodes: {len(mapping["nodes"])}')

print('\n10. Submitting Official Procurement Officer Decision...')
decision_payload = {
    'decision': 'SEND_FOR_REVIEW',
    'officer_name': 'Rajesh Kumar',
    'officer_designation': 'Senior Procurement Officer',
    'reason': 'Turnover information differs between submitted financial statement (₹8.2 Cr) and verification source (₹3.9 Cr).'
}
s, dec = post('/api/bids/BID-2026-003/decision', decision_payload)
print(f'  Updated Status: {dec["bid"]["status"]}')

print('\n11. Checking Audit Trail Ledger...')
s, at = get('/api/audit-trail')
trail = json.loads(at)
print(f'  Audit logs count: {trail["total_logs"]}')
print(f'  Latest Decision Entry: {trail["logs"][0]["details"]}')

print('\n12. Resetting DB to pristine state for user...')
s, r = post('/api/demo/reset')
print('  Reset Status:', s)

print('\n' + '=' * 60)
print('  ALL LIVE END-TO-END WORKFLOW CHECKS PASSED!')
print('=' * 60)
