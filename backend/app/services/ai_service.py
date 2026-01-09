"""AI service for candidate analysis using Anthropic Claude API"""

import json
from typing import Dict, Any, List
from anthropic import Anthropic

from app.config import settings
from app.models import Candidate, Job


# Initialize Anthropic client
client = Anthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None


async def extract_job_requirements(job_description: str) -> Dict[str, Any]:
    """
    Extract structured requirements from a job description using AI

    Args:
        job_description: Raw job description text

    Returns:
        Structured requirements dictionary
    """
    if not client:
        return {"error": "AI service not configured"}

    prompt = f"""Analyze the following job description and extract structured information.
Return a JSON object with these fields:
- required_skills: List of required technical and soft skills
- preferred_skills: List of preferred/nice-to-have skills
- min_years_experience: Minimum years of experience required (number or null)
- education_requirements: List of education requirements
- key_responsibilities: List of main job responsibilities
- must_have_qualifications: Critical qualifications

Job Description:
{job_description}

Return only valid JSON, no additional text."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract JSON from response
        response_text = message.content[0].text
        requirements = json.loads(response_text)
        return requirements

    except Exception as e:
        print(f"Error extracting job requirements: {e}")
        return {"error": str(e)}


async def analyze_candidate(candidate: Candidate, job: Job) -> Dict[str, Any]:
    """
    Analyze a candidate's fit for a job using AI

    Args:
        candidate: Candidate object with profile data
        job: Job object with description and requirements

    Returns:
        Analysis results with match score, strengths, and concerns
    """
    if not client:
        raise Exception("AI service not configured. Please set ANTHROPIC_API_KEY")

    # Build candidate profile summary
    candidate_profile = {
        "name": candidate.name,
        "current_title": candidate.current_title,
        "current_company": candidate.current_company,
        "location": candidate.location,
        "experience": candidate.experience or [],
        "education": candidate.education or [],
        "skills": candidate.skills or [],
        "profile_data": candidate.profile_data or {}
    }

    prompt = f"""You are an expert technical recruiter. Analyze this candidate's fit for the job.

JOB DETAILS:
Title: {job.title}
Company: {job.company}
Description: {job.description}
Requirements: {json.dumps(job.requirements, indent=2) if job.requirements else 'Not extracted'}

CANDIDATE PROFILE:
{json.dumps(candidate_profile, indent=2)}

Provide a detailed analysis in JSON format with:
1. match_score: Overall fit score from 0-100
2. summary: Brief 2-3 sentence overview of the candidate's fit
3. strengths: List of 3-5 key strengths that make them a good fit
4. concerns: List of 2-4 potential concerns or gaps (or empty list if none)
5. skill_match: Percentage of required skills the candidate has (0-100)
6. experience_match: How well their experience aligns (0-100)
7. recommendation: "strong_fit", "moderate_fit", "weak_fit", or "poor_fit"
8. next_steps: Recommended actions (e.g., "Schedule interview", "Request additional info", "Pass")

Be thorough but concise. Return only valid JSON."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=3000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text
        analysis = json.loads(response_text)

        return {
            "match_score": analysis.get("match_score", 0),
            "analysis": analysis,
            "strengths": analysis.get("strengths", []),
            "concerns": analysis.get("concerns", [])
        }

    except Exception as e:
        print(f"Error analyzing candidate: {e}")
        raise Exception(f"Failed to analyze candidate: {str(e)}")


async def parse_linkedin_profile(profile_text: str) -> Dict[str, Any]:
    """
    Parse LinkedIn profile text/HTML into structured data

    Args:
        profile_text: Raw LinkedIn profile content

    Returns:
        Structured profile data
    """
    if not client:
        return {"error": "AI service not configured"}

    prompt = f"""Parse this LinkedIn profile into structured data.

Profile Content:
{profile_text[:4000]}  # Limit to avoid token limits

Extract and return JSON with:
- name: Full name
- current_title: Current job title
- current_company: Current employer
- location: Location
- headline: LinkedIn headline
- about: About/summary section
- experience: List of work experiences with {{title, company, duration, description}}
- education: List of education with {{school, degree, field, year}}
- skills: List of skills mentioned
- certifications: List of certifications (if any)

Return only valid JSON."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=3000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text
        profile_data = json.loads(response_text)
        return profile_data

    except Exception as e:
        print(f"Error parsing LinkedIn profile: {e}")
        return {"error": str(e)}
