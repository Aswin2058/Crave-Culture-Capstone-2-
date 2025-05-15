import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; 
import './Auth.css';

const Signup = () => {
  const [uName, setUName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!uName || !email || !password) {
        throw new Error('Please fill in all fields');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Actually call the register API
      const userData = await registerUser(uName, email, password);
      
      // Redirect to login after successful registration
      navigate('/login', { state: { success: 'Registration successful! Please login' } });
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={uName}
            onChange={(e) => setUName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <div className="auth-footer">
        Already have an account?{' '}
        <button 
          onClick={() => navigate('/login')} 
          className="link-btn"
          disabled={isLoading}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;