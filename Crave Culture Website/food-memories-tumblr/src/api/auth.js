export const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
  }

  return await response.json();
};

export const registerUser = async (uName, email, password) => {
  const response = await fetch('http://localhost:4000/user/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uName, email, password }),
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
  }

  return await response.json();
};