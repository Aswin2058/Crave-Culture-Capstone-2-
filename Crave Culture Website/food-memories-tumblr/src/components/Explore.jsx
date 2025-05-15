import React, { useState, useEffect } from 'react';
import { getPosts, createPost, deletePost } from '../api/posts';
import PostCard from './ExploreComponents/PostCard';
import CreatePost from './ExploreComponents/CreatePost';
import { useAuth } from '../context/AuthContext'; // Add this import

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Move useAuth here

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (caption, imageUrl) => {
    try {
      setError('');
      
      if (!user) {
        throw new Error('You must be logged in to post');
      }
      
      const newPost = await createPost({
        userId: user._id,
        caption,
        imageUrl: imageUrl || null
      });
      
      setPosts([{
        ...newPost,
        user: {
          userId: user._id,
          uName: user.uName,
          profilePicture: user.profilePicture || '/default-profile.png'
        }
      }, ...posts]);
      
    } catch (err) {
      console.error('Full error:', err);
      let errorMsg = err.message;
      
      if (err.message.includes('Failed to fetch')) {
        errorMsg = 'Network error - check backend connection';
      } else if (err.message.includes('<!DOCTYPE html>')) {
        errorMsg = 'Server error - check backend logs';
      }
      
      setError(errorMsg);
    }
  };

  

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId, user._id);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError('Failed to delete post: ' + err.message);
    }
  };

  return (
    <div className="explore-container">
      <CreatePost onCreatePost={handleCreatePost} />
      <div className="posts-grid">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post}
            onDelete={handleDeletePost} // Pass the delete handler
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;