"""Pydantic schemas for request/response validation"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime


# Job Schemas
class JobBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    location: Optional[str] = Field(None, max_length=255)
    job_type: Optional[str] = Field(None, max_length=50)
    salary_range: Optional[str] = Field(None, max_length=100)


class JobCreate(JobBase):
    pass


class JobResponse(JobBase):
    id: int
    requirements: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Candidate Schemas
class CandidateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[str] = Field(None, max_length=255)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    current_title: Optional[str] = Field(None, max_length=255)
    current_company: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)


class CandidateCreate(CandidateBase):
    job_id: int
    profile_data: Optional[Dict[str, Any]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    source: str = "manual"


class CandidateResponse(CandidateBase):
    id: int
    job_id: int
    profile_data: Optional[Dict[str, Any]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    match_score: Optional[float] = None
    analysis: Optional[Dict[str, Any]] = None
    strengths: Optional[List[str]] = None
    concerns: Optional[List[str]] = None
    source: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CandidateUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


# Analysis Schemas
class AnalyzeRequest(BaseModel):
    candidate_id: int


class AnalyzeResponse(BaseModel):
    candidate_id: int
    match_score: float
    analysis: Dict[str, Any]
    strengths: List[str]
    concerns: List[str]
