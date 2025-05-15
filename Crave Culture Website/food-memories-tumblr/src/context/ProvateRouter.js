// src/components/PrivateRoute.js
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}