import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { LayoutPanelLeft, CheckSquare, FolderOpen, LogOut } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="sidebar glass-panel">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-primary">
          <CheckSquare size={24} />
          TaskSync
        </h2>
      </div>
      
      <nav className="flex-col gap-2 flex" style={{ flex: 1 }}>
        <Link to="/" className="btn btn-secondary flex" style={{ justifyContent: 'flex-start', border: 'none' }}>
          <LayoutPanelLeft size={18} /> Dashboard
        </Link>
        <Link to="/projects" className="btn btn-secondary flex" style={{ justifyContent: 'flex-start', border: 'none' }}>
          <FolderOpen size={18} /> Projects
        </Link>
      </nav>
      
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="mb-2 text-secondary" style={{ fontSize: '0.85rem' }}>
          Logged in as: <br />
          <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> ({user?.role})
        </div>
        <button onClick={logout} className="btn btn-secondary flex" style={{ width: '100%', justifyContent: 'center', border: 'none', color: 'var(--danger-color)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
