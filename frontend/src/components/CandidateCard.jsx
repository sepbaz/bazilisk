import { useState } from 'react'
import { candidatesApi, analysisApi } from '../api/client'
import './CandidateCard.css'

function CandidateCard({ candidate, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      await analysisApi.analyzeSingle(candidate.id)
      onUpdate()
    } catch (err) {
      alert('Failed to analyze candidate')
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      await candidatesApi.update(candidate.id, { status: newStatus })
      onUpdate()
    } catch (err) {
      alert('Failed to update status')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high'
    if (score >= 60) return 'score-medium'
    return 'score-low'
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'status-new',
      reviewed: 'status-reviewed',
      contacted: 'status-contacted',
      rejected: 'status-rejected'
    }
    return colors[status] || 'status-new'
  }

  return (
    <div className={`candidate-card card ${expanded ? 'expanded' : ''}`}>
      <div className="candidate-header" onClick={() => setExpanded(!expanded)}>
        <div className="candidate-main-info">
          <div className="candidate-name-section">
            <h3>{candidate.name}</h3>
            {candidate.match_score !== null && (
              <span className={`match-score ${getScoreColor(candidate.match_score)}`}>
                {Math.round(candidate.match_score)}% Match
              </span>
            )}
            <span className={`status-badge ${getStatusColor(candidate.status)}`}>
              {candidate.status}
            </span>
          </div>

          <div className="candidate-subtitle">
            {candidate.current_title && <span>{candidate.current_title}</span>}
            {candidate.current_company && <span> at {candidate.current_company}</span>}
          </div>

          {candidate.location && (
            <div className="candidate-location">📍 {candidate.location}</div>
          )}
        </div>

        <div className="expand-icon">
          {expanded ? '▼' : '▶'}
        </div>
      </div>

      {expanded && (
        <div className="candidate-details">
          <div className="details-section">
            <h4>Contact</h4>
            {candidate.email && (
              <p><strong>Email:</strong> <a href={`mailto:${candidate.email}`}>{candidate.email}</a></p>
            )}
            {candidate.linkedin_url && (
              <p><strong>LinkedIn:</strong> <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">View Profile</a></p>
            )}
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="details-section">
              <h4>Skills</h4>
              <div className="skills-list">
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {candidate.analysis && (
            <div className="details-section">
              <h4>AI Analysis</h4>

              {candidate.analysis.summary && (
                <p className="analysis-summary">{candidate.analysis.summary}</p>
              )}

              {candidate.strengths && candidate.strengths.length > 0 && (
                <div className="analysis-item">
                  <strong>Strengths:</strong>
                  <ul>
                    {candidate.strengths.map((strength, idx) => (
                      <li key={idx} className="strength-item">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {candidate.concerns && candidate.concerns.length > 0 && (
                <div className="analysis-item">
                  <strong>Concerns:</strong>
                  <ul>
                    {candidate.concerns.map((concern, idx) => (
                      <li key={idx} className="concern-item">{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {candidate.analysis.recommendation && (
                <p className="recommendation">
                  <strong>Recommendation:</strong> {candidate.analysis.recommendation.replace('_', ' ')}
                </p>
              )}

              {candidate.analysis.next_steps && (
                <p className="next-steps">
                  <strong>Next Steps:</strong> {candidate.analysis.next_steps}
                </p>
              )}
            </div>
          )}

          {candidate.experience && candidate.experience.length > 0 && (
            <div className="details-section">
              <h4>Experience</h4>
              {candidate.experience.map((exp, idx) => (
                <div key={idx} className="experience-item">
                  <strong>{exp.title}</strong> {exp.company && `at ${exp.company}`}
                  {exp.duration && <span className="duration"> ({exp.duration})</span>}
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="candidate-actions">
            {candidate.match_score === null ? (
              <button
                onClick={handleAnalyze}
                className="btn btn-primary"
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Fit'}
              </button>
            ) : (
              <button
                onClick={handleAnalyze}
                className="btn btn-secondary"
                disabled={analyzing}
              >
                {analyzing ? 'Re-analyzing...' : 'Re-analyze'}
              </button>
            )}

            <select
              value={candidate.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="status-select"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="contacted">Contacted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateCard
