import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api/client'
import './JobList.css'

function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await jobsApi.getAll()
      setJobs(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load jobs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await jobsApi.delete(jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err) {
      alert('Failed to delete job')
      console.error(err)
    }
  }

  if (loading) return <div className="loading">Loading jobs...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h2>Job Postings</h2>
        <Link to="/jobs/new" className="btn btn-primary">Create New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs yet. Create your first job to start sourcing candidates!</p>
          <Link to="/jobs/new" className="btn btn-primary">Create Job</Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="company">{job.company}</span>
              </div>

              <div className="job-meta">
                {job.location && <span className="meta-item">📍 {job.location}</span>}
                {job.job_type && <span className="meta-item">💼 {job.job_type}</span>}
                {job.salary_range && <span className="meta-item">💰 {job.salary_range}</span>}
              </div>

              <p className="job-description">
                {job.description.substring(0, 150)}...
              </p>

              <div className="job-actions">
                <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                  View Candidates
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JobList
