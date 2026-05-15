import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { api, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Project State
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [api]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowCreate(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1>Projects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
            {showCreate ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="glass-panel mb-4" style={{ padding: '2rem' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate} className="flex-col gap-4">
            <div>
              <label>Project Name</label>
              <input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
            </div>
            <div>
              <label>Description</label>
              <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary mt-4">Create</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="glass-panel" style={{ padding: '1.5rem', display: 'block' }}>
            <h3>{project.name}</h3>
            <p className="text-secondary mb-4">{project.description || 'No description provided.'}</p>
            <div className="flex justify-between items-center text-secondary" style={{ fontSize: '0.85rem' }}>
              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              <span>{project.tasks?.length || 0} tasks</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
