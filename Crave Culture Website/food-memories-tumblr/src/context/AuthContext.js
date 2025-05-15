import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData.user || userData); // Handle both response structures
        localStorage.setItem('user', JSON.stringify(userData.user || userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

   // In your AuthContext.js
return (
  <AuthContext.Provider value={{ 
    user, 
    setUser, // Add this line
    login, 
    logout 
  }}>
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
    return useContext(AuthContext);
}