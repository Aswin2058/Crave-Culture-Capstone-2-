// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';


const Profile = () => {
    const { user, logout, setUser } = useAuth(); 
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        uName: '',
        profilePicture: null,
        previewPicture: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                uName: user.uName || '',
                profilePicture: null,
                previewPicture: user.profilePicture ? 
                    `http://localhost:4000${user.profilePicture}` : // Fixed: No '/public'
                    '/default-profile.png'
            });
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 2MB in bytes
                setError('File too large (max 2MB)');
                e.target.value = ''; // Clear the file input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profilePicture: file,
                    previewPicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('uName', formData.uName); // Use formData state
    
    if (formData.profilePicture) {
      if (formData.profilePicture.size > 4 * 1024 * 1024) {
        throw new Error('File too large (max 4MB)');
      }
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    const response = await fetch(`http://localhost:4000/user/profile/${user._id}`, {
      method: 'PUT',
      body: formDataToSend,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Update failed');
    }

    const { user: updatedUser } = await response.json();
    
    // Update context and localStorage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditMode(false);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            {user ? (
                <div className="profile-details">
                    {!editMode ? (
                        <>
                            <div className="profile-picture-container">
                                <img 
                                    src={formData.previewPicture} 
                                    alt="Profile" 
                                    className="profile-picture"
                                />
                            </div>
                            <p><strong>Name:</strong> {user.uName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <div className="profile-actions">
                                <button 
                                    onClick={() => setEditMode(true)} 
                                    className="edit-btn"
                                >
                                    Edit Profile
                                </button>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="profilePicture">Profile Picture:</label>
                                <input 
                                    type="file" 
                                    id="profilePicture" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {formData.previewPicture && (
                                    <img 
                                        src={formData.previewPicture} 
                                        alt="Preview" 
                                        className="picture-preview"
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="uName">Name:</label>
                                <input
                                    type="text"
                                    id="uName"
                                    name="uName"
                                    value={formData.uName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <p className="email-display">{user.email}</p>
                                <small>(Email cannot be changed)</small>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setEditMode(false)}
                                    className="cancel-btn"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;