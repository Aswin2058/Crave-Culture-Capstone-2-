import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Community from './components/Community';
import Explore from './components/Explore'
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import { PostProvider } from './context/PostContext';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Redirect root to login instead of protected route */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/community" element={
                <PrivateRoute>
                  <Community />
                </PrivateRoute>
              } />
              <Route path="/explore" element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;