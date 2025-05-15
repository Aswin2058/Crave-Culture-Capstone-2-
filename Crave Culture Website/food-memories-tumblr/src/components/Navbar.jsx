import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogoClick = () => {
    navigate(user ? '/community' : '/');
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={handleLogoClick}>CraveCulture</div>
      <div className="nav-links">
        {user ? (
          <>
            <button onClick={() => navigate('/community')}>Community</button>
            <button onClick={() => navigate('/explore')}>Explore</button>
            <button onClick={() => navigate('/profile')}>Profile</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/explore')}>Explore</button>
            <button onClick={() => navigate('/community')}>Community</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;