import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        await Promise.all([
          fetchProjectDetails(),
          fetchTasks()
        ]);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/project/getProject/${projectId}`);
      console.log('Project details response:', response.data);
      if (response.data.success) {
        setProject(response.data.project);
      } else {
        setError(response.data.message || 'Failed to fetch project details');
        if (response.data.message === 'Project not found') {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error.response?.data?.message || 'Failed to fetch project details');
      if (error.response?.status === 404) {
        navigate('/dashboard');
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/task/getTasksByProject/${projectId}`);
      console.log('Tasks response:', response.data);
      if (response.data.success) {
        setTasks(response.data.tasks || []);
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a task');
        return;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId;

      const taskData = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        assignedTo: userId,
        dueDate: new Date(newTask.dueDate).toISOString(),
        projectId
      };

      console.log('Creating task with data:', taskData);

      const response = await api.post('/task/create', taskData);
      if (response.data.success) {
        setShowNewTaskModal(false);
        setNewTask({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          assignedTo: '',
          dueDate: ''
        });
        await fetchTasks();
      } else {
        setError(response.data.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setError('');
      const response = await api.patch(`/task/updateTaskStatus/${taskId}`, { status: newStatus });
      if (response.data.success) {
        await fetchTasks();
      } else {
        setError(response.data.message || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setError(error.response?.data?.message || 'Failed to update task status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return '#FF6B6B';
      case 'In Progress':
        return '#4ECDC4';
      case 'Done':
        return '#45B7D1';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#FF6B6B';
      case 'Medium':
        return '#FFD93D';
      case 'Low':
        return '#95E1D3';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <p>Project not found</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <header className="project-header">
        <div className="project-info">
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <button 
          className="create-task-btn"
          onClick={() => setShowNewTaskModal(true)}
        >
          Add New Task
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="task-board">
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <div key={status} className="task-column">
            <h2 className="column-title" style={{ backgroundColor: getStatusColor(status) }}>
              {status}
            </h2>
            <div className="task-list">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div key={task._id} className="task-card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p>{task.description}</p>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="taskTitle">Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDescription">Description</label>
                <textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskPriority">Priority</label>
                <select
                  id="taskPriority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="taskDueDate">Due Date</label>
                <input
                  type="date"
                  id="taskDueDate"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 