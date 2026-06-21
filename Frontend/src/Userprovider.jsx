import { createContext, useState, useEffect } from 'react';
import API from './service/API.sevice';
export const UserContext = createContext(null);

export  const UserProvider = ({ children }) => {
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {

    API.get('/user/me')
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => {
          console.log(err.message)
        setUserData(null); 
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  return (

    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};