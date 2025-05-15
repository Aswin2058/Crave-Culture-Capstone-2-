import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './PostFooter.css';

const PostFooter = ({ post, onLike, isLiked }) => {
  return (
    <div className="post-footer">
      <div className="post-actions">
        <button onClick={onLike} className={`like-btn ${isLiked ? 'liked' : ''}`}>
          {isLiked ? (
            <FaHeart className="liked-icon" />
          ) : (
            <FaRegHeart className="like-icon" />
          )}
        </button>
      </div>
      <div className="likes-count">
        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
      </div>
    </div>
  );
};

export default PostFooter;