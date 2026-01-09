# Bazilisk Architecture

Technical architecture documentation for developers.

## System Overview

Bazilisk is a full-stack web application that uses AI to match candidates with job descriptions. The system consists of three main components:

1. **Backend API** (Python/FastAPI)
2. **Frontend UI** (React/Vite)
3. **AI Service** (Anthropic Claude API)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTP   │   FastAPI   │   SDK   │  Anthropic  │
│   Frontend  │◄───────►│   Backend   │◄───────►│   Claude    │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              │
                        ┌─────▼──────┐
                        │   SQLite   │
                        │  Database  │
                        └────────────┘
```

## Backend Architecture

### Technology Stack

- **Framework**: FastAPI 0.109+
- **ASGI Server**: Uvicorn
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic 2.5
- **AI SDK**: Anthropic Python SDK 0.18
- **Database**: SQLite (dev) → PostgreSQL (production)

### Directory Structure

```
backend/
├── main.py                 # Application entry point
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration management
│   ├── database.py        # Database setup and session
│   ├── models.py          # SQLAlchemy ORM models
│   ├── schemas.py         # Pydantic request/response schemas
│   │
│   ├── routers/           # API route handlers
│   │   ├── __init__.py
│   │   ├── jobs.py        # Job CRUD endpoints
│   │   ├── candidates.py  # Candidate CRUD endpoints
│   │   └── analysis.py    # AI analysis endpoints
│   │
│   └── services/          # Business logic layer
│       ├── __init__.py
│       └── ai_service.py  # AI integration and analysis
│
├── requirements.txt       # Python dependencies
└── .env.example          # Environment template
```

### Data Models

#### Job Model
```python
class Job:
    id: int (PK)
    title: str
    company: str
    description: text
    requirements: json          # AI-extracted structured data
    location: str (optional)
    job_type: str (optional)
    salary_range: str (optional)
    created_at: datetime
    updated_at: datetime

    # Relationships
    candidates: List[Candidate]
```

#### Candidate Model
```python
class Candidate:
    id: int (PK)
    job_id: int (FK → Job.id)

    # Profile
    name: str
    email: str (optional)
    linkedin_url: str (optional)
    current_title: str (optional)
    current_company: str (optional)
    location: str (optional)

    # Structured data
    profile_data: json
    experience: json
    education: json
    skills: json (list)

    # AI Analysis results
    match_score: float (0-100)
    analysis: json
    strengths: json (list)
    concerns: json (list)

    # Metadata
    source: str (linkedin, manual, csv)
    status: str (new, reviewed, contacted, rejected)
    notes: text
    created_at: datetime
    updated_at: datetime
```

### API Layers

#### 1. Router Layer (`app/routers/`)
- Handles HTTP requests/responses
- Input validation via Pydantic schemas
- Route definitions and path parameters
- Error handling and status codes

#### 2. Service Layer (`app/services/`)
- Business logic implementation
- AI integration
- Complex data transformations
- External API calls

#### 3. Data Layer (`app/models.py`, `app/database.py`)
- Database models (SQLAlchemy ORM)
- Database session management
- Migrations (future: Alembic)

### AI Service Architecture

The AI service (`app/services/ai_service.py`) provides three main functions:

#### 1. `extract_job_requirements(job_description: str)`
Extracts structured requirements from raw job description text.

**Input**: Raw job description string
**Output**: JSON with structured requirements
```json
{
  "required_skills": ["Python", "React"],
  "preferred_skills": ["AWS", "Docker"],
  "min_years_experience": 5,
  "education_requirements": ["Bachelor's in CS"],
  "key_responsibilities": [...],
  "must_have_qualifications": [...]
}
```

**AI Model**: claude-3-5-sonnet-20241022
**Max Tokens**: 2000

#### 2. `analyze_candidate(candidate: Candidate, job: Job)`
Analyzes candidate fit for a specific job.

**Input**:
- Candidate object with profile data
- Job object with description and requirements

**Output**: Analysis results
```json
{
  "match_score": 85,
  "summary": "Strong candidate with relevant experience...",
  "strengths": ["5+ years Python", "React expertise"],
  "concerns": ["No AWS experience"],
  "skill_match": 85,
  "experience_match": 90,
  "recommendation": "strong_fit",
  "next_steps": "Schedule interview"
}
```

**AI Model**: claude-3-5-sonnet-20241022
**Max Tokens**: 3000

#### 3. `parse_linkedin_profile(profile_text: str)`
Parses LinkedIn profile text into structured data.

**Input**: Raw LinkedIn profile HTML/text
**Output**: Structured profile data
```json
{
  "name": "John Doe",
  "current_title": "Senior Engineer",
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

**AI Model**: claude-3-5-sonnet-20241022
**Max Tokens**: 3000

### Configuration Management

Environment variables are managed via `pydantic-settings`:

```python
class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    DATABASE_URL: str = "sqlite:///./bazilisk.db"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    ALLOWED_ORIGINS: List[str]

    class Config:
        env_file = ".env"
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Styling**: CSS (vanilla, no framework)

### Directory Structure

```
frontend/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Application entry
    ├── App.jsx               # Root component with routing
    ├── App.css               # Global styles
    ├── index.css
    │
    ├── api/
    │   └── client.js         # API client with axios
    │
    └── components/
        ├── JobList.jsx       # List of all jobs
        ├── JobList.css
        ├── JobDetail.jsx     # Single job with candidates
        ├── JobDetail.css
        ├── CreateJob.jsx     # Job creation form
        ├── CreateJob.css
        ├── AddCandidate.jsx  # Candidate creation form
        ├── AddCandidate.css
        ├── CandidateCard.jsx # Individual candidate display
        └── CandidateCard.css
```

### Component Hierarchy

```
App
├── JobList
│   └── JobCard (multiple)
│
├── CreateJob
│   └── JobForm
│
└── JobDetail
    ├── JobInfo
    ├── AddCandidate
    │   └── CandidateForm
    └── CandidateCard (multiple)
        └── CandidateDetails (expandable)
```

### State Management

Currently using React's built-in state management:
- `useState` for component-level state
- `useEffect` for data fetching
- Props for parent-child communication

Future: Consider adding:
- React Context for global state
- React Query for server state management
- Zustand or Redux for complex state

### API Client

The `api/client.js` module provides a centralized API client:

```javascript
// Base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Organized by resource
export const jobsApi = { ... }
export const candidatesApi = { ... }
export const analysisApi = { ... }
```

### Routing Structure

```
/                   → JobList (all jobs)
/jobs/new           → CreateJob (create new job)
/jobs/:jobId        → JobDetail (job + candidates)
```

## Data Flow

### Creating a Job

```
User Input (CreateJob)
    ↓
POST /api/jobs
    ↓
FastAPI Router (jobs.py)
    ↓
AI Service: extract_job_requirements()
    ↓
Anthropic Claude API
    ↓
Save Job + Requirements to DB
    ↓
Return JobResponse
    ↓
Navigate to JobDetail
```

### Adding and Analyzing a Candidate

```
User Input (AddCandidate)
    ↓
POST /api/candidates
    ↓
Save Candidate to DB
    ↓
POST /api/analysis/analyze
    ↓
AI Service: analyze_candidate()
    ↓
Anthropic Claude API
    ↓
Update Candidate with Analysis
    ↓
Return Analysis Results
    ↓
Refresh Candidate List
```

### Batch Analysis

```
User Click "Analyze N Candidates"
    ↓
POST /api/analysis/batch-analyze/{job_id}
    ↓
Query unscored candidates
    ↓
For each candidate:
    ├─→ analyze_candidate()
    ├─→ Anthropic API call
    └─→ Save results
    ↓
Return batch results
    ↓
Refresh candidate list
```

## Database Schema

```sql
-- Jobs table
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements JSON,
    location VARCHAR(255),
    job_type VARCHAR(50),
    salary_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id INTEGER PRIMARY KEY,
    job_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    current_title VARCHAR(255),
    current_company VARCHAR(255),
    location VARCHAR(255),
    profile_data JSON,
    experience JSON,
    education JSON,
    skills JSON,
    match_score FLOAT,
    analysis JSON,
    strengths JSON,
    concerns JSON,
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Indexes
CREATE INDEX idx_candidates_job_id ON candidates(job_id);
CREATE INDEX idx_candidates_match_score ON candidates(match_score);
CREATE INDEX idx_candidates_status ON candidates(status);
```

## Security Considerations

### Current Implementation

1. **API Key Protection**: Environment variables only
2. **CORS**: Configured allowed origins
3. **Input Validation**: Pydantic schemas validate all inputs
4. **SQL Injection**: Protected by SQLAlchemy ORM

### Production Recommendations

1. **Authentication**: Add user authentication (JWT tokens)
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevent API abuse
4. **HTTPS**: SSL/TLS in production
5. **API Key Rotation**: Regular rotation of Anthropic API key
6. **Data Encryption**: Encrypt sensitive candidate data
7. **Audit Logging**: Track all data access and modifications

## Performance Considerations

### Current Performance

- **Database**: SQLite (single file, good for dev/small deployments)
- **AI Calls**: Synchronous (blocks during analysis)
- **Frontend**: Client-side rendering

### Optimization Opportunities

1. **Database**:
   - Migrate to PostgreSQL for production
   - Add database connection pooling
   - Implement caching layer (Redis)

2. **AI Service**:
   - Implement async AI calls with job queue (Celery)
   - Batch multiple analyses in single API call
   - Cache common job requirement extractions

3. **Frontend**:
   - Implement pagination for large candidate lists
   - Add virtual scrolling for performance
   - Use React.memo for expensive components
   - Code splitting and lazy loading

4. **API**:
   - Add response caching
   - Implement GraphQL for flexible queries
   - Add CDN for static assets

## Deployment Architecture

### Development
```
localhost:5173 (Frontend Vite Dev Server)
    ↓
localhost:8000 (Backend FastAPI)
    ↓
bazilisk.db (SQLite)
```

### Production (Recommended)

```
                    ┌──────────────┐
                    │   Cloudflare │
                    │   / Nginx    │
                    └───────┬──────┘
                            │
                ┌───────────┴────────────┐
                │                        │
        ┌───────▼────────┐      ┌───────▼────────┐
        │  Static Assets │      │  API Gateway   │
        │   (S3/CDN)     │      │   (API Server) │
        └────────────────┘      └───────┬────────┘
                                        │
                                ┌───────▼────────┐
                                │    FastAPI     │
                                │  (Gunicorn +   │
                                │   Uvicorn)     │
                                └───────┬────────┘
                                        │
                                ┌───────▼────────┐
                                │  PostgreSQL    │
                                │   Database     │
                                └────────────────┘
```

## Testing Strategy

### Current State
- Basic error handling
- No automated tests yet

### Recommended Testing

1. **Backend Tests**:
   ```
   tests/
   ├── test_models.py       # Database model tests
   ├── test_api.py          # API endpoint tests
   ├── test_ai_service.py   # AI service unit tests
   └── conftest.py          # Pytest fixtures
   ```

2. **Frontend Tests**:
   ```
   src/
   └── components/
       ├── JobList.test.jsx
       ├── CandidateCard.test.jsx
       └── ...
   ```

3. **Integration Tests**:
   - End-to-end user workflows
   - API integration tests
   - AI service integration tests

## Future Enhancements

### Short Term
- [ ] Pagination for candidates
- [ ] CSV import for bulk candidates
- [ ] Export candidate reports
- [ ] User authentication

### Medium Term
- [ ] LinkedIn API integration
- [ ] Email templates for outreach
- [ ] Calendar integration
- [ ] Advanced filtering

### Long Term
- [ ] Multi-tenant support
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] ATS integrations
- [ ] Mobile app

## Monitoring and Observability

### Recommended Additions

1. **Logging**:
   - Structured logging (JSON format)
   - Log aggregation (ELK stack)
   - Error tracking (Sentry)

2. **Metrics**:
   - API response times
   - AI service latency
   - Database query performance
   - User activity metrics

3. **Alerting**:
   - API downtime
   - High error rates
   - AI service failures
   - Database issues

## Contributing

When contributing to Bazilisk:

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Follow Python PEP 8 and JavaScript/React best practices
5. Use meaningful commit messages

---

For questions about the architecture, open an issue on GitHub.
