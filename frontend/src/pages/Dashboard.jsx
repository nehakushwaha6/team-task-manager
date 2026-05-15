import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { api, user } = useContext(AuthContext);
  const [summary, setSummary] = useState({ total: 0, todo: 0, in_progress: 0, done: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, tasksRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/tasks?limit=5') // Get recent tasks
        ]);
        setSummary(summaryRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [api]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1>Welcome, {user?.name}</h1>
        <p className="text-secondary">Here's an overview of your tasks.</p>
      </div>

      <div className="flex gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="text-secondary">Total Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.total}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-secondary)' }}>
          <h3 className="text-secondary">To Do</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.todo}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 className="text-secondary">In Progress</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.in_progress}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success-color)' }}>
          <h3 className="text-secondary">Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.done}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-secondary">No tasks assigned to you right now.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong>{task.title}</strong>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date set'}</div>
                </div>
                <span className={`badge badge-${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
