import os
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.db_models import Bid, Document, Requirement, AuditLog, Tender
from app.data.seed_data import INITIAL_BIDS_DATA

def init_db():
    Base.metadata.create_all(bind=engine)

def seed_database():
    init_db()
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(Bid).first():
        db.close()
        return

    print("Seeding database with initial mock data...")
    
    # Create a default tender
    tender = Tender(
        id="TND-2026-001",
        title="Procurement of IT Equipment",
        department="Ministry of Electronics and Information Technology",
        description="Supply and installation of IT equipment for data centers."
    )
    db.add(tender)
    
    for bid_data in INITIAL_BIDS_DATA:
        # Create bid
        bid = Bid(
            id=bid_data["id"],
            tender_id=tender.id,
            vendor_name=bid_data["vendor_name"],
            vendor_gstin=bid_data["vendor_gstin"],
            vendor_pan=bid_data["vendor_pan"],
            submission_date=bid_data["submission_date"],
            status=bid_data["status"],
            compliance_score=bid_data["compliance_score"],
            risk_level=bid_data["risk_level"],
            passed_requirements=bid_data["passed_requirements"],
            failed_requirements=bid_data["failed_requirements"],
            review_requirements=bid_data["review_requirements"],
            contradictions_count=bid_data["contradictions_count"],
            is_analyzed=bid_data.get("is_analyzed", False),
            analyzed_at=bid_data.get("analyzed_at"),
            extracted_data={"requirements": bid_data.get("requirements", []), "contradictions": bid_data.get("contradictions", [])}
        )
        db.add(bid)
        
        # Add documents
        for doc_data in bid_data.get("documents", []):
            doc = Document(
                id=doc_data["id"],
                bid_id=bid.id,
                name=doc_data["name"],
                type=doc_data.get("type", "PDF"),
                upload_date=doc_data.get("upload_date", "2026-09-01"),
                file_path=doc_data.get("file_path", "")
            )
            db.add(doc)
            
        # Add timeline/audit logs
        for log_data in bid_data.get("timeline", []):
            log = AuditLog(
                bid_id=bid.id,
                timestamp=log_data["timestamp"],
                action_type=log_data.get("title", "EVENT"),
                actor=log_data.get("actor", "System"),
                details=log_data["description"],
                status_tag=log_data.get("status_tag", "INFO")
            )
            db.add(log)
            
    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_database()
