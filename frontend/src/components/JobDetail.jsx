import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobsApi, candidatesApi, analysisApi } from '../api/client'
import AddCandidate from './AddCandidate'
import CandidateCard from './CandidateCard'
import './JobDetail.css'

function JobDetail() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [minScore, setMinScore] = useState(0)

  useEffect(() => {
    loadJobAndCandidates()
  }, [jobId, filterStatus, minScore])

  const loadJobAndCandidates = async () => {
    try {
      setLoading(true)
      const [jobRes, candidatesRes] = await Promise.all([
        jobsApi.getById(jobId),
        candidatesApi.getByJobId(jobId, {
          status: filterStatus === 'all' ? undefined : filterStatus,
          min_score: minScore > 0 ? minScore : undefined
        })
      ])
      setJob(jobRes.data)
      setCandidates(candidatesRes.data)
      setError(null)
    } catch (err) {
      setError('Failed to load job details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCandidateAdded = () => {
    setShowAddForm(false)
    loadJobAndCandidates()
  }

  const handleBatchAnalyze = async () => {
    if (!confirm('Analyze all unscored candidates? This may take a moment.')) return

    try {
      setAnalyzing(true)
      await analysisApi.batchAnalyze(jobId)
      await loadJobAndCandidates()
      alert('Analysis complete!')
    } catch (err) {
      alert('Failed to analyze candidates')
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleCandidateUpdate = () => {
    loadJobAndCandidates()
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>
  if (!job) return <div className="error">Job not found</div>

  const unscoredCount = candidates.filter(c => c.match_score === null).length
  const avgScore = candidates.length > 0
    ? candidates.reduce((sum, c) => sum + (c.match_score || 0), 0) / candidates.filter(c => c.match_score !== null).length
    : 0

  return (
    <div className="job-detail">
      <div className="job-header-section">
        <Link to="/" className="back-link">← Back to Jobs</Link>

        <div className="job-info card">
          <div className="job-title-section">
            <div>
              <h1>{job.title}</h1>
              <p className="company-name">{job.company}</p>
            </div>
          </div>

          <div className="job-meta-row">
            {job.location && <span>📍 {job.location}</span>}
            {job.job_type && <span>💼 {job.job_type}</span>}
            {job.salary_range && <span>💰 {job.salary_range}</span>}
          </div>

          <div className="job-stats">
            <div className="stat">
              <span className="stat-value">{candidates.length}</span>
              <span className="stat-label">Candidates</span>
            </div>
            <div className="stat">
              <span className="stat-value">{avgScore.toFixed(0)}%</span>
              <span className="stat-label">Avg Score</span>
            </div>
            <div className="stat">
              <span className="stat-value">{unscoredCount}</span>
              <span className="stat-label">Unscored</span>
            </div>
          </div>
        </div>
      </div>

      <div className="candidates-section">
        <div className="candidates-header">
          <h2>Candidates</h2>

          <div className="candidates-actions">
            <div className="filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="filter-select"
              >
                <option value="0">All Scores</option>
                <option value="70">70%+</option>
                <option value="80">80%+</option>
                <option value="90">90%+</option>
              </select>
            </div>

            {unscoredCount > 0 && (
              <button
                onClick={handleBatchAnalyze}
                className="btn btn-primary"
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : `Analyze ${unscoredCount} Candidates`}
              </button>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-success"
            >
              {showAddForm ? 'Cancel' : '+ Add Candidate'}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="add-candidate-section">
            <AddCandidate
              jobId={jobId}
              onSuccess={handleCandidateAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="empty-state card">
            <p>No candidates yet. Add your first candidate to start analyzing!</p>
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Add Candidate
              </button>
            )}
          </div>
        ) : (
          <div className="candidates-list">
            {candidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onUpdate={handleCandidateUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail
