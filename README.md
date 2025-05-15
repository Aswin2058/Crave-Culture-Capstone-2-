# Overview
A full-stack social media application with authentication, posts, likes, and user profiles. Built with React, Node.js, Express, and MongoDB.

## Features
- **User Authentication** (Login/Register)
- **Create/View Posts** with images
- **Like/Unlike** functionality
- **User Profiles** with profile pictures
- **Responsive Design** for all devices

## Tech Stack
### Frontend
- React.js
- React Router
- Context API (State Management)
- React Icons
- CSS Modules

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JSON Web Tokens (Authentication)

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (or MongoDB Atlas connection string)
- Git

### Setup
1. Download project or clone 
2. Install dependencies for both frontend and backend:

bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
Set up environment variables:
Create a .env file in the server directory with:

env
MONGO_URI=your_mongodb_connection_string
PORT=5000
Run the application:

bash
# From project root directory
# Start backend (from /server directory)
npm start

# Start frontend (from /client directory)
npm start
Project Structure
social-media-app/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source files
│       ├── components/   # Reusable components
│       ├── context/      # Auth context
│       ├── pages/        # Page components
│       └── App.js        # Main app component
│
├── server/               # Backend Node.js server
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js         # Server entry point
│
└── README.md             # Project documentation
API Endpoints
Endpoint	Method	Description
/api/auth/register	POST	User registration
/api/auth/login	POST	User login
/api/posts	GET	Get all posts
/api/posts	POST	Create new post
/api/posts/:id/like	POST	Like/unlike a post
Environment Variables
See .env.example for required environment variables.

Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
