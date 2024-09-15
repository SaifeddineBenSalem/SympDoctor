
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        fetchUserData(userId);
      } catch (error) {
        console.error('Error decoding token', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    } else {
      setLoading(false); // Set loading to false if no token is found
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/getuserbyid`, {
        params: { id: userId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('API response:', response.data);
      setUser(response.data); // Assuming response.data contains the user object directly
    } catch (error) {
      console.error('Error fetching user data', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
