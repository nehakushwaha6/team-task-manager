import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { api, user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Task Creation State
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', assignee_id: '' });

  useEffect(() => {
    fetchProject();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [id, api, user]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        ...newTask,
        project_id: parseInt(id),
        assignee_id: newTask.assignee_id ? parseInt(newTask.assignee_id) : null
      });
      setNewTask({ title: '', description: '', due_date: '', assignee_id: '' });
      setShowCreate(false);
      fetchProject(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProject(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Link to="/projects" className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Projects</Link>
        <div className="flex justify-between items-center">
          <div>
            <h1>{project.name}</h1>
            <p className="text-secondary">{project.description}</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
              {showCreate ? 'Cancel' : '+ Add Task'}
            </button>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="glass-panel mb-4" style={{ padding: '2rem' }}>
          <h3>Add New Task</h3>
          <form onSubmit={handleCreateTask} className="flex-col gap-4 mt-4">
            <div>
              <label>Task Title</label>
              <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
            </div>
            <div>
              <label>Description</label>
              <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <div style={{ flex: 1 }}>
                <label>Due Date</label>
                <input type="datetime-local" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Assignee</label>
                <select value={newTask.assignee_id} onChange={e => setNewTask({...newTask, assignee_id: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4">Create Task</button>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Tasks</h2>
        {project.tasks?.length === 0 ? (
          <p className="text-secondary">No tasks created yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {project.tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between gap-4" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ flex: 1 }}>
                  <strong>{task.title}</strong>
                  <p className="text-secondary mb-2">{task.description}</p>
                  <div className="flex gap-4 text-secondary" style={{ fontSize: '0.85rem' }}>
                    <span>Due: {task.due_date ? new Date(task.due_date).toLocaleString() : 'No date set'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    disabled={user?.role !== 'admin' && task.assignee_id !== user?.id}
                    style={{ width: 'auto', padding: '0.5rem' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
