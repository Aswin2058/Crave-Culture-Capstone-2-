import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import './PostCard.css';
import { toggleLike } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import { formatPostTime } from '../../utils/timeFormatter'; 

const PostCard = ({ post, onDelete }) => {
  const [timeString, setTimeString] = useState(formatPostTime(post.createdAt));
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(formatPostTime(post.createdAt));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [post.createdAt]);

  useEffect(() => {
  if (user && post.likedBy?.includes(user._id)) {
    setIsLiked(true);
  }
}, [user, post.likedBy]);

  // Check if current user is the post owner
  const isOwner = user?._id === post.userId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post._id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleLike = async () => {
    try {
      // Optimistic UI update
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setIsAnimating(true);
      
      let updatedLikes = currentPost.likes || 0;
        if (newLikeStatus && !isLiked) {
          updatedLikes += 1;
        } else if (!newLikeStatus && isLiked) {
          updatedLikes = Math.max(0, updatedLikes - 1);
        }

      
      setCurrentPost(prev => ({
        ...prev,
        likes: updatedLikes
      }));

      await toggleLike(currentPost._id, user._id); // Use actual user ID

    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setCurrentPost(prev => ({
        ...prev,
        likes: isLiked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1
      }));
      console.error('Like error:', err);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img 
          src={post.user?.profilePicture || '/default-profile.png'} 
          alt={post.user?.uName || 'Unknown User'}
          className="profile-pic"
          onError={(e) => e.target.src = '/default-profile.png'}
        />
        <div className="user-info">
          <span className="username">{post.user?.uName || 'Unknown User'}</span>
          <span className="post-time">{timeString}</span>
       </div>
        {isOwner && (
          <button 
            onClick={handleDelete} 
            className="delete-btn"
            aria-label="Delete post"
          >
            <FaTrash />
          </button>
        )}
      </div>
      
      {currentPost.caption && <p className="post-caption">{currentPost.caption}</p>}
      
      {currentPost.imageUrl && (
        <div className="post-image-container">
          <img 
            src={currentPost.imageUrl} 
            alt="Post content" 
            className="post-image"
          />
        </div>
      )}
      
      <div className="post-footer">
        <button 
          onClick={handleLike} 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          disabled={isAnimating}
        >
          {isLiked ? (
            <FaHeart className={`like-icon ${isAnimating ? 'animate' : ''}`} />
          ) : (
            <FaRegHeart className="like-icon" />
          )}
          <span>{currentPost.likes || 0} likes</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;