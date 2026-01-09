# Bazilisk - AI-Powered Candidate Sourcing Platform

Bazilisk is an intelligent recruiting tool that uses AI to analyze candidate profiles against job descriptions, helping you identify the best talent faster.

## Features

- **AI-Powered Matching**: Uses Anthropic's Claude AI to intelligently match candidates with job requirements
- **Automatic Analysis**: Extracts structured requirements from job descriptions and analyzes candidate fit
- **Smart Scoring**: Rates candidates on a 0-100 scale with detailed breakdowns of strengths and concerns
- **Modern Interface**: Clean, intuitive React UI for managing jobs and reviewing candidates
- **Flexible Input**: Support for manual candidate entry, LinkedIn profile parsing, or CSV imports
- **Status Tracking**: Organize candidates by status (new, reviewed, contacted, rejected)
- **Batch Processing**: Analyze multiple candidates at once to save time

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Anthropic API**: Claude AI for intelligent analysis
- **SQLite**: Database (easily upgradeable to PostgreSQL)

### Frontend
- **React**: UI library
- **Vite**: Fast build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

6. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### 1. Create a Job Posting

- Click "Create New Job" in the navigation
- Fill in job details (title, company, description, etc.)
- The AI will automatically extract structured requirements from the job description

### 2. Add Candidates

- Navigate to a job from the jobs list
- Click "Add Candidate"
- Enter candidate information:
  - Basic info (name, email, LinkedIn URL)
  - Current position
  - Skills (comma-separated)
  - Experience/background

### 3. Analyze Candidates

- **Individual Analysis**: Candidates are automatically analyzed when added
- **Batch Analysis**: Click "Analyze N Candidates" to analyze all unscored candidates at once

### 4. Review Results

- View candidates sorted by match score (highest first)
- Expand candidate cards to see:
  - AI-generated match score (0-100%)
  - Strengths for this specific role
  - Potential concerns or gaps
  - Recommendation and next steps
- Filter by status or minimum score
- Update candidate status as you progress through your pipeline

## Project Structure

```
bazilisk/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── database.py     # Database configuration
│   │   ├── config.py       # App configuration
│   │   ├── routers/        # API route handlers
│   │   │   ├── jobs.py
│   │   │   ├── candidates.py
│   │   │   └── analysis.py
│   │   └── services/       # Business logic
│   │       └── ai_service.py
│   ├── main.py             # Application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── AddCandidate.jsx
│   │   │   └── CandidateCard.jsx
│   │   ├── api/           # API client
│   │   │   └── client.js
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md              # This file
```

## API Endpoints

### Jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get a specific job
- `DELETE /api/jobs/{id}` - Delete a job

### Candidates
- `POST /api/candidates` - Add a new candidate
- `GET /api/candidates/job/{job_id}` - Get candidates for a job
- `GET /api/candidates/{id}` - Get a specific candidate
- `PATCH /api/candidates/{id}` - Update candidate status/notes
- `DELETE /api/candidates/{id}` - Delete a candidate

### Analysis
- `POST /api/analysis/analyze` - Analyze a single candidate
- `POST /api/analysis/batch-analyze/{job_id}` - Analyze all unscored candidates for a job

## Configuration

### Environment Variables

Backend (`.env`):
```
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./bazilisk.db
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

### Building for Production

Backend:
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## LinkedIn Integration Notes

**Important**: LinkedIn's Terms of Service prohibit automated scraping. This application provides several compliant options:

1. **Manual Entry**: Copy/paste profile information manually
2. **LinkedIn API**: Apply for official API access (limited availability)
3. **CSV Import**: Export candidate data from LinkedIn Recruiter or other licensed tools
4. **Recruiting Platforms**: Integrate with platforms that have LinkedIn partnerships

The AI service includes a `parse_linkedin_profile()` function that can parse profile text if you obtain it through compliant means.

## Future Enhancements

- [ ] LinkedIn Recruiter API integration
- [ ] CSV/Excel candidate import
- [ ] Email outreach templates
- [ ] Calendar integration for scheduling
- [ ] Advanced filtering and search
- [ ] Candidate comparison view
- [ ] Export to ATS systems
- [ ] Team collaboration features
- [ ] Analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using FastAPI, React, and Anthropic Claude AI