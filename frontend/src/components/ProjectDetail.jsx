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
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/getProject/${projectId}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/getTasksByProject/${projectId}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/create', {
        ...newTask,
        projectId,
      });
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/updateTaskStatus/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return '#ffd700';
      case 'in-progress':
        return '#4a90e2';
      case 'completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-detail">
      <header className="project-header">
        <div className="project-info">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <button 
          className="create-task-btn"
          onClick={() => setShowNewTaskModal(true)}
        >
          Add New Task
        </button>
      </header>

      <div className="task-board">
        {['todo', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="task-column">
            <h2 className="column-title" style={{ backgroundColor: getStatusColor(status) }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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