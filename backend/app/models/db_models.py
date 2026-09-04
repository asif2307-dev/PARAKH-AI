from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    designation = Column(String)
    department = Column(String)

class Tender(Base):
    __tablename__ = "tenders"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    department = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bids = relationship("Bid", back_populates="tender")
    requirements = relationship("Requirement", back_populates="tender")

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    clause_number = Column(String)
    title = Column(String)
    description = Column(Text)
    is_critical = Column(Boolean, default=False)
    
    tender = relationship("Tender", back_populates="requirements")

class Bid(Base):
    __tablename__ = "bids"
    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    vendor_name = Column(String)
    vendor_gstin = Column(String)
    vendor_pan = Column(String)
    submission_date = Column(String)
    
    status = Column(String, default="Under Analysis")
    compliance_score = Column(Integer, default=0)
    risk_level = Column(String, default="Low")
    passed_requirements = Column(Integer, default=0)
    failed_requirements = Column(Integer, default=0)
    review_requirements = Column(Integer, default=0)
    contradictions_count = Column(Integer, default=0)
    is_analyzed = Column(Boolean, default=False)
    analyzed_at = Column(String, nullable=True)
    
    # Store JSON data directly for flexibility in prototyping
    extracted_data = Column(JSON, nullable=True) 
    
    tender = relationship("Tender", back_populates="bids")
    documents = relationship("Document", back_populates="bid")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, index=True)
    bid_id = Column(String, ForeignKey("bids.id"))
    name = Column(String)
    type = Column(String)
    upload_date = Column(String)
    file_path = Column(String)
    
    bid = relationship("Bid", back_populates="documents")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    bid_id = Column(String, index=True)
    timestamp = Column(String)
    action_type = Column(String)
    actor = Column(String)
    details = Column(Text)
    status_tag = Column(String)
