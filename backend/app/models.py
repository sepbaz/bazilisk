"""SQLAlchemy database models"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Job(Base):
    """Job posting model"""
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(JSON)  # Structured requirements extracted by AI
    location = Column(String(255))
    job_type = Column(String(50))  # Full-time, Part-time, Contract, etc.
    salary_range = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    candidates = relationship("Candidate", back_populates="job")


class Candidate(Base):
    """Candidate profile model"""
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    # Profile Information
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    linkedin_url = Column(String(500))
    current_title = Column(String(255))
    current_company = Column(String(255))
    location = Column(String(255))

    # Profile Data (raw and structured)
    profile_data = Column(JSON)  # Full profile data
    experience = Column(JSON)  # Structured work experience
    education = Column(JSON)  # Structured education
    skills = Column(JSON)  # List of skills

    # AI Analysis
    match_score = Column(Float)  # 0-100 score for job match
    analysis = Column(JSON)  # Detailed AI analysis
    strengths = Column(JSON)  # Key strengths for this role
    concerns = Column(JSON)  # Potential concerns or gaps

    # Metadata
    source = Column(String(100))  # linkedin, manual, csv, etc.
    status = Column(String(50), default="new")  # new, reviewed, contacted, rejected
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    job = relationship("Job", back_populates="candidates")
