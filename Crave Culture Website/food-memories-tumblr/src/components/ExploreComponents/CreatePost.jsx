import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi'; // Import an icon
import './CreatePost.css'

const CreatePost = ({ onCreatePost }) => {
  const [caption, setCaption] = useState('');

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const compressedImage = await compressImage(file);
      setPreview(compressedImage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption && !preview) return;
    
    onCreatePost(caption, preview);
    setCaption('');
    setPreview(null);
    setFileName('');
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        
        <div className="post-actions">
          <div className="file-upload-wrapper">
            <label className="file-upload-label">
              <FiImage />
              Choose Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="file-upload-input"
              />
            </label>
            {fileName && <div className="file-name">{fileName}</div>}
          </div>
          
          <button type="submit" disabled={!caption && !preview}>
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;