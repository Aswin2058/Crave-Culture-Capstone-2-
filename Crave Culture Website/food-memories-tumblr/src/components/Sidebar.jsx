// src/components/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css'; // Optional: add styles here or use Tailwind/CSS-in-JS

const Sidebar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '🍲 Community Potluck',
      date: '2025-05-25',
      time: '18:00',
      location: 'Central Park, NYC',
      type: 'Potluck',
      description: 'Bring your favorite homemade dish and meet fellow foodies!',
      rsvpCount: 12,
    },
    {
      id: 2,
      title: '🌱 Online Vegan Class',
      date: '2025-06-02',
      time: '19:30',
      location: 'Zoom',
      type: 'Online',
      description: 'Learn to cook a 3-course vegan meal with Chef Emma.',
      rsvpCount: 27,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Potluck',
    description: '',
  });

  const handleRSVP = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, rsvpCount: event.rsvpCount + 1 } : event
      )
    );
  };

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = events.length + 1;
    setEvents([...events, { ...newEvent, id: newId, rsvpCount: 0 }]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'Potluck',
      description: '',
    });
    setShowForm(false);
  };

  return (
    <div className="sidebar">
      <h2>Community Food Events</h2>

      {events.map((event) => (
        <div key={event.id} className="event-card">
          <h4>{event.title}</h4>
          <p>
            📅 {event.date} at {event.time}
          </p>
          <p>📍 {event.location}</p>
          <p>{event.description}</p>
          <p>
            <strong>Type:</strong> {event.type}
          </p>
          <p>👥 RSVPs: {event.rsvpCount}</p>
          <button onClick={() => handleRSVP(event.id)}>✅ RSVP</button>
        </div>
      ))}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '➕ Add Event'}
      </button>

      {showForm && (
        <form className="event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={newEvent.time}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location or Link"
            value={newEvent.location}
            onChange={handleChange}
            required
          />
          <select name="type" value={newEvent.type} onChange={handleChange}>
            <option value="Potluck">Potluck</option>
            <option value="Cooking Class">Cooking Class</option>
            <option value="Food Tasting">Food Tasting</option>
            <option value="Online">Online</option>
          </select>
          <textarea
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleChange}
            required
          />
          <button type="submit">🎉 Create Event</button>
        </form>
      )}
    </div>
  );
};

export default Sidebar;
