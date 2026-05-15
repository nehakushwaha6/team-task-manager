import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password, role);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ height: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <CheckSquare size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} />
          <h2 className="mt-4">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="text-secondary">Sign in to manage your team tasks</p>
        </div>

        {error && <div className="mb-4 text-center" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          {!isLogin && (
            <div>
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
            </div>
          )}
          
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          {!isLogin && (
            <div>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="member">Member (Can update tasks)</option>
                <option value="admin">Admin (Can create projects & assign tasks)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="btn-secondary" 
            style={{ border: 'none', background: 'transparent', fontSize: '0.9rem' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
