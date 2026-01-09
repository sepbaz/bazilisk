import { Routes, Route, Link } from 'react-router-dom'
import JobList from './components/JobList'
import JobDetail from './components/JobDetail'
import CreateJob from './components/CreateJob'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Bazilisk</h1>
          <p>AI-Powered Candidate Sourcing</p>
        </div>
        <div className="navbar-menu">
          <Link to="/">Jobs</Link>
          <Link to="/jobs/new">Create Job</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/new" element={<CreateJob />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
