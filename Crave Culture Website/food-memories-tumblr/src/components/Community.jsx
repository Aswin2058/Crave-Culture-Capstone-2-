import React, { useState, useEffect } from 'react';
import './Community.css';
import {
  fetchCommunities,
  addCommunity,
  reactToCommunity,
  addComment,
  followCommunity
} from '../api/communityAPI';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState({
    country: '',
    description: '',
    image: ''
  });
  const [commentTexts, setCommentTexts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    size: '',       // "small", "medium", "large"
    topic: '',      // e.g. "Food", "Country"
    location: ''    // partial or full country name
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const data = await fetchCommunities();
      setCommunities(data);
      setCommentTexts(data.map(() => ""));
    } catch (error) {
      console.error("Error loading communities:", error);
      alert(`Error loading communities: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity({ ...newCommunity, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCommunity({ ...newCommunity, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const saved = await addCommunity(newCommunity);
      if (saved && saved._id) {
        await loadCommunities();
        setNewCommunity({ country: '', description: '', image: '' });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Add community error:", err);
      alert(`Failed to add community: ${err.message}`);
    }
  };

  const handleReact = async (index, type) => {
    try {
      const id = communities[index]._id;
      const updated = await reactToCommunity(id, type);
      const updatedList = [...communities];
      updatedList[index] = updated;
      setCommunities(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (index) => {
    const comment = commentTexts[index];
    if (!comment.trim()) return;

    try {
      const id = communities[index]._id;
      const updated = await addComment(id, comment);
      const updatedList = [...communities];
      updatedList[index] = updated;
      setCommunities(updatedList);

      const texts = [...commentTexts];
      texts[index] = '';
      setCommentTexts(texts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (index) => {
    try {
      const id = communities[index]._id;
      const updated = await followCommunity(id); // API toggles follow/unfollow
      const updatedList = [...communities];
      updatedList[index] = updated;
      setCommunities(updatedList);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const shareCommunity = (index) => {
    const community = communities[index];
    const shareText = `${community.country}: ${community.description}\nMore Info: ${community.details || ''}`;

    if (navigator.share) {
      navigator.share({
        title: `Join the community of ${community.country}`,
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.error("Error sharing: ", error));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Community info copied to clipboard!");
      }).catch((error) => console.error("Error copying: ", error));
    }
  };

  // Filtering logic
  const filteredCommunities = communities.filter((comm) => {
    // Search by keywords in country, description, details
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      comm.country.toLowerCase().includes(searchLower) ||
      comm.description.toLowerCase().includes(searchLower) ||
      (comm.details && comm.details.toLowerCase().includes(searchLower));

    // Filter by size - assuming comm.size is a number representing community size
    let matchesSize = true;
    if (filters.size) {
      if (filters.size === 'small') matchesSize = comm.size < 50;
      else if (filters.size === 'medium') matchesSize = comm.size >= 50 && comm.size <= 200;
      else if (filters.size === 'large') matchesSize = comm.size > 200;
    }

    // Filter by topic - assuming comm.topics is array of strings
    let matchesTopic = true;
    if (filters.topic) {
      matchesTopic = comm.topics && comm.topics.includes(filters.topic);
    }

    // Filter by location - partial match on country
    let matchesLocation = true;
    if (filters.location) {
      matchesLocation = comm.country.toLowerCase().includes(filters.location.toLowerCase());
    }

    return matchesSearch && matchesSize && matchesTopic && matchesLocation;
  });

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Community</h1>
        <button
          className="create-community-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Community
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search communities, posts, or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filters.size}
          onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          className="filter-select"
        >
          <option value="">All Sizes</option>
          <option value="small">Small (&lt; 50)</option>
          <option value="medium">Medium (50-200)</option>
          <option value="large">Large (&gt; 200)</option>
        </select>

        <select
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
          className="filter-select"
        >
          <option value="">All Topics</option>
          <option value="technology">Fast Foods</option>
          <option value="sports">Street Foods</option>
          <option value="art">Vegan Foods</option>
          <option value="art">Vegan Foods</option>
          <option value="art">Beverages</option>
          <option value="art">Bakery Products</option>

          {/* Add more topics as needed */}
        </select>

        <input
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="search-input"
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2>Create New Community</h2>
            <form onSubmit={handleAdd}>
              <div>
                <label htmlFor="country">Title / Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={newCommunity.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCommunity.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="image">Image (optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {newCommunity.image && (
                <img
                  src={newCommunity.image}
                  alt="Preview"
                  className="image-preview"
                />
              )}

              <button type="submit">Create Community</button>
            </form>
          </div>
        </div>
      )}

      <div className="community-list">
        {filteredCommunities.map((item, index) => (
          <div className="community-card" key={item._id || index}>
            {item.image && <img src={item.image} alt={item.country} />}
            <div className="community-card-content">
              <h3>{item.country}</h3>
              <p>{item.description}</p>
              <p className="details">{item.details || "More info coming soon..."}</p>

              <div className="reactions">
                <button onClick={() => handleReact(index, 'likes')}>👍 Like ({item.likes})</button>
                <button onClick={() => handleReact(index, 'dislikes')}>👎 Dislike ({item.dislikes})</button>
                <button onClick={() => handleReact(index, 'loves')}>❤️ Love ({item.loves})</button>
                <button className="share-btn" onClick={() => shareCommunity(index)}>📤 Share</button>
              </div>

              <div className="follow-section">
                <button
                  className={`follow-btn ${item.isFollowed ? 'followed' : ''}`}
                  onClick={() => handleFollow(index)}
                >
                  {item.isFollowed ? 'Unfollow' : 'Follow'}
                </button>
              </div>

              <div className="comment-section">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={commentTexts[index]}
                  onChange={(e) => {
                    const texts = [...commentTexts];
                    texts[index] = e.target.value;
                    setCommentTexts(texts);
                  }}
                />
                <button onClick={() => handleComment(index)}>Comment</button>
              </div>

              <div className="comments">
                {item.comments?.map((comment, i) => (
                  <p key={i} className="comment">💬 {comment.text}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;


