// api/posts.js
const API_URL = 'http://localhost:4000/api/posts';

export const getPosts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

// api/posts.js
export const createPost = async (postData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // THIS IS CRUCIAL
      body: JSON.stringify(postData)
    });

    // First check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    // Then verify content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    return await response.json();
  } catch (err) {
    console.error('Post creation failed:', err);
    throw new Error(err.message || 'Failed to create post');
  }
};

export const deletePost = async (postId, userId) => {
  const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete post');
  }
  return response.json();
};

export const toggleLike = async (postId, userId) => {
  const response = await fetch(`${API_URL}/${postId}/like`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle like');
  }

  return response.json();
};