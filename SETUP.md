# Bazilisk Setup Guide

Complete setup instructions for getting Bazilisk running on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Python 3.9 or higher**
   - Download from [python.org](https://www.python.org/downloads/)
   - Verify: `python --version` or `python3 --version`

2. **Node.js 18 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

3. **pip (Python package manager)**
   - Usually comes with Python
   - Verify: `pip --version` or `pip3 --version`

4. **npm (Node package manager)**
   - Usually comes with Node.js
   - Verify: `npm --version`

### API Keys

1. **Anthropic API Key**
   - Sign up at [console.anthropic.com](https://console.anthropic.com/)
   - Navigate to API Keys section
   - Create a new API key
   - Keep it secure - you'll need it later

## Step-by-Step Setup

### Part 1: Backend Setup

#### 1. Open Terminal/Command Prompt

Navigate to the bazilisk directory:
```bash
cd /path/to/bazilisk
```

#### 2. Set Up Backend Environment

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

#### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- SQLAlchemy (database ORM)
- Anthropic SDK (AI integration)
- And other required packages

#### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# On Windows:
copy .env.example .env
```

Edit the `.env` file with your favorite text editor:
```bash
# Linux/macOS
nano .env

# Or use any editor: VS Code, Sublime, etc.
```

Update the following line with your actual API key:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Save and close the file.

#### 5. Verify Backend Setup

Start the backend server:
```bash
python main.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Visit `http://localhost:8000/docs` in your browser. You should see the interactive API documentation.

**Keep this terminal running** and open a new terminal for the frontend setup.

### Part 2: Frontend Setup

#### 1. Open New Terminal

Navigate to the bazilisk directory again:
```bash
cd /path/to/bazilisk
```

#### 2. Navigate to Frontend Directory

```bash
cd frontend
```

#### 3. Install Node Dependencies

```bash
npm install
```

This will install:
- React (UI library)
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)
- And other required packages

This may take a few minutes.

#### 4. Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Visit `http://localhost:5173` in your browser. You should see the Bazilisk application!

## Testing Your Setup

### 1. Create Your First Job

1. Click "Create New Job" in the navigation
2. Fill in the form:
   - **Title**: "Senior Software Engineer"
   - **Company**: "Test Company"
   - **Description**: Paste a sample job description (or use the example below)
   - **Location**: "San Francisco, CA"
   - **Job Type**: "Full-time"
3. Click "Create Job"

Sample job description:
```
We're looking for a Senior Software Engineer with 5+ years of experience
in Python and React. You'll be responsible for building scalable web
applications and mentoring junior developers.

Requirements:
- 5+ years of software development experience
- Strong Python and JavaScript skills
- Experience with React and FastAPI
- Bachelor's degree in Computer Science or related field
- Excellent communication skills

Nice to have:
- Experience with AI/ML
- Cloud platform experience (AWS, GCP)
- Open source contributions
```

### 2. Add a Test Candidate

1. Navigate to the job you just created
2. Click "Add Candidate"
3. Fill in the form:
   - **Name**: "John Doe"
   - **Email**: "john@example.com"
   - **Current Title**: "Software Engineer"
   - **Current Company**: "Tech Corp"
   - **Skills**: "Python, React, AWS, Docker"
   - **Experience**: "5 years of full-stack development"
4. Click "Add Candidate"

The system will automatically analyze the candidate and show a match score!

### 3. Review the Analysis

- Expand the candidate card to see the full AI analysis
- Check the match score, strengths, and concerns
- Try changing the candidate's status

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Make sure your virtual environment is activated and run `pip install -r requirements.txt` again

**Problem**: `anthropic.AuthenticationError`
- **Solution**: Check that your `.env` file has the correct ANTHROPIC_API_KEY

**Problem**: Port 8000 already in use
- **Solution**: Stop any other process using port 8000, or change the port in `.env`:
  ```
  API_PORT=8001
  ```

### Frontend Issues

**Problem**: `npm: command not found`
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

**Problem**: Port 5173 already in use
- **Solution**: Kill the process using that port or edit `vite.config.js` to use a different port:
  ```js
  server: {
    port: 5174,  // Change this
    ...
  }
  ```

**Problem**: "Failed to load jobs" error in the UI
- **Solution**: Make sure the backend is running on port 8000

### Database Issues

**Problem**: Database errors or corrupted data
- **Solution**: Delete `bazilisk.db` file and restart the backend. It will create a fresh database.

## Next Steps

Now that you have Bazilisk running:

1. **Customize Job Descriptions**: Try different job descriptions to see how the AI extracts requirements
2. **Add Multiple Candidates**: Add several candidates and use batch analysis
3. **Explore Filtering**: Use the status and score filters to organize candidates
4. **Read the API Docs**: Visit `http://localhost:8000/docs` to explore the API

## Development Tips

### Backend Development

- **Auto-reload**: The backend automatically reloads when you change Python files (when `DEBUG=True`)
- **Database Tool**: Use a SQLite viewer (like DB Browser for SQLite) to inspect the database
- **API Testing**: Use the interactive docs at `/docs` to test API endpoints

### Frontend Development

- **Hot Reload**: Vite provides instant hot module replacement (HMR)
- **React DevTools**: Install [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension
- **Component Structure**: All components are in `frontend/src/components/`

### Running in Production

See the main README.md for production deployment instructions.

## Getting Help

If you encounter issues:

1. Check the terminal output for error messages
2. Review this setup guide again
3. Check the main README.md for additional information
4. Open an issue on GitHub with:
   - Your operating system
   - Python and Node.js versions
   - Full error message
   - Steps to reproduce

Happy recruiting with Bazilisk!
