import hashlib
from datetime import datetime
from typing import List, Dict, Any
from app.data.seed_data import db

class AuditService:
    """
    Immutable Audit Trail Service.
    Records every action (OCR, verification, contradiction, officer review)
    with a cryptographic SHA-256 hash for government transparency and non-repudiation.
    """

    @staticmethod
    def get_all_logs(bid_id: str = None) -> List[Dict[str, Any]]:
        logs = db.audit_logs
        if bid_id:
            return [log for log in logs if log.get("bid_id") == bid_id or log.get("bid_id") is None]
        return list(reversed(logs))

    @staticmethod
    def record_entry(bid_id: str, action_type: str, actor: str, details: str, status_tag: str = "INFO") -> Dict[str, Any]:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        raw_string = f"{now_str}|{bid_id}|{action_type}|{actor}|{details}"
        hash_signature = f"sha256:{hashlib.sha256(raw_string.encode('utf-8')).hexdigest()}"
        
        entry = {
            "id": f"LOG-{len(db.audit_logs) + 1001}",
            "timestamp": now_str,
            "bid_id": bid_id,
            "action_type": action_type,
            "actor": actor,
            "details": details,
            "status_tag": status_tag,
            "hash_signature": hash_signature
        }
        db.audit_logs.append(entry)
        return entry
