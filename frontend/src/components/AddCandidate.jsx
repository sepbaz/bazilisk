import { useState } from 'react'
import { candidatesApi, analysisApi } from '../api/client'
import './AddCandidate.css'

function AddCandidate({ jobId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    current_title: '',
    current_company: '',
    location: '',
    skills: '',
    experience_json: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Parse skills and experience
      const skills = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []

      let experience = []
      if (formData.experience_json) {
        try {
          experience = JSON.parse(formData.experience_json)
        } catch {
          // If not valid JSON, create a simple experience entry
          experience = [{
            title: formData.current_title,
            company: formData.current_company,
            description: formData.experience_json
          }]
        }
      }

      // Create candidate
      const candidateData = {
        job_id: jobId,
        name: formData.name,
        email: formData.email || null,
        linkedin_url: formData.linkedin_url || null,
        current_title: formData.current_title || null,
        current_company: formData.current_company || null,
        location: formData.location || null,
        skills: skills,
        experience: experience,
        source: 'manual'
      }

      const response = await candidatesApi.create(candidateData)

      // Automatically analyze the candidate
      await analysisApi.analyzeSingle(response.data.id)

      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add candidate')
      setLoading(false)
    }
  }

  return (
    <div className="add-candidate card">
      <h3>Add New Candidate</h3>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="candidate-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="linkedin_url">LinkedIn URL</label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="current_title">Current Title</label>
            <input
              type="text"
              id="current_title"
              name="current_title"
              value={formData.current_title}
              onChange={handleChange}
              placeholder="Senior Software Engineer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="current_company">Current Company</label>
            <input
              type="text"
              id="current_company"
              name="current_company"
              value={formData.current_company}
              onChange={handleChange}
              placeholder="Tech Corp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Python, React, AWS, Machine Learning"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience_json">Experience / Background</label>
          <textarea
            id="experience_json"
            name="experience_json"
            value={formData.experience_json}
            onChange={handleChange}
            rows="4"
            placeholder="Paste experience summary or JSON array of work history..."
          />
          <small>You can paste a summary or JSON like: [{"{"}"title": "Engineer", "company": "X", "duration": "2020-2023"{"}"}]</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding & Analyzing...' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCandidate
