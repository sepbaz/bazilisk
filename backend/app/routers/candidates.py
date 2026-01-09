"""Candidate management API endpoints"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Candidate, Job
from app.schemas import CandidateCreate, CandidateResponse, CandidateUpdate

router = APIRouter()


@router.post("/", response_model=CandidateResponse, status_code=201)
async def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    """Add a new candidate to a job"""

    # Verify job exists
    job = db.query(Job).filter(Job.id == candidate.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Create candidate
    db_candidate = Candidate(
        job_id=candidate.job_id,
        name=candidate.name,
        email=candidate.email,
        linkedin_url=candidate.linkedin_url,
        current_title=candidate.current_title,
        current_company=candidate.current_company,
        location=candidate.location,
        profile_data=candidate.profile_data,
        experience=candidate.experience,
        education=candidate.education,
        skills=candidate.skills,
        source=candidate.source,
        status="new"
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)

    return db_candidate


@router.get("/job/{job_id}", response_model=List[CandidateResponse])
def get_candidates_for_job(
    job_id: int,
    status: Optional[str] = None,
    min_score: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get all candidates for a specific job with optional filtering"""

    query = db.query(Candidate).filter(Candidate.job_id == job_id)

    if status:
        query = query.filter(Candidate.status == status)

    if min_score is not None:
        query = query.filter(Candidate.match_score >= min_score)

    # Order by match score descending (best matches first)
    candidates = query.order_by(Candidate.match_score.desc()).all()

    return candidates


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Get a specific candidate by ID"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.patch("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: int,
    update: CandidateUpdate,
    db: Session = Depends(get_db)
):
    """Update candidate status or notes"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if update.status is not None:
        candidate.status = update.status
    if update.notes is not None:
        candidate.notes = update.notes

    db.commit()
    db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Delete a candidate"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db.delete(candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}
