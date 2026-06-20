import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const UserContext = createContext(null);
const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    withCredentials: true
})
export  const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {

    API.get('/user/me')
      .then((response) => {
        
        setUserData(response.data.data);
        window.location.assign = '/'
      
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
       console.log(err)
        setUserData(null); 
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  return (

    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};