import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/getProjects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/create', newProject);
      setShowNewProjectModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Management Board</h1>
        <div className="header-actions">
          <button 
            className="create-project-btn"
            onClick={() => setShowNewProjectModal(true)}
          >
            Create New Project
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="project-card"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-stats">
                <span>{project.tasks?.length || 0} Tasks</span>
                <span>{project.members?.length || 0} Members</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showNewProjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea
                  id="projectDescription"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 