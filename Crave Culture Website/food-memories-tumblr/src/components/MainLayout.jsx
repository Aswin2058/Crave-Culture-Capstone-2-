import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="app-container">
      <div className="navbar-column">
        <Navbar />
      </div>
      
      <div className="content-column">
        <div className="content-scroll-container">
          <Outlet /> {/* This renders the current page */}
        </div>
      </div>
      
      <div className="sidebar-column">
        <Sidebar />
      </div>
    </div>
  );
}