"""Candidate analysis API endpoints"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate, Job
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import analyze_candidate

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_candidate_match(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """Analyze a candidate's fit for their associated job using AI"""

    # Get candidate and associated job
    candidate = db.query(Candidate).filter(Candidate.id == request.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    job = db.query(Job).filter(Job.id == candidate.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Associated job not found")

    # Perform AI analysis
    analysis_result = await analyze_candidate(candidate, job)

    # Update candidate with analysis results
    candidate.match_score = analysis_result["match_score"]
    candidate.analysis = analysis_result["analysis"]
    candidate.strengths = analysis_result["strengths"]
    candidate.concerns = analysis_result["concerns"]

    db.commit()
    db.refresh(candidate)

    return {
        "candidate_id": candidate.id,
        "match_score": candidate.match_score,
        "analysis": candidate.analysis,
        "strengths": candidate.strengths,
        "concerns": candidate.concerns
    }


@router.post("/batch-analyze/{job_id}")
async def batch_analyze_candidates(job_id: int, db: Session = Depends(get_db)):
    """Analyze all unscored candidates for a specific job"""

    # Verify job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Get all candidates without a match score
    candidates = db.query(Candidate).filter(
        Candidate.job_id == job_id,
        Candidate.match_score.is_(None)
    ).all()

    results = []
    for candidate in candidates:
        try:
            analysis_result = await analyze_candidate(candidate, job)

            candidate.match_score = analysis_result["match_score"]
            candidate.analysis = analysis_result["analysis"]
            candidate.strengths = analysis_result["strengths"]
            candidate.concerns = analysis_result["concerns"]

            results.append({
                "candidate_id": candidate.id,
                "name": candidate.name,
                "match_score": candidate.match_score,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "candidate_id": candidate.id,
                "name": candidate.name,
                "status": "error",
                "error": str(e)
            })

    db.commit()

    return {
        "job_id": job_id,
        "total_analyzed": len(results),
        "results": results
    }
