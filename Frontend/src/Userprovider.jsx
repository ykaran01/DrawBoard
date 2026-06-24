import { createContext, useState, useEffect ,useRef} from 'react';
import API from './service/API.sevice';

export const UserContext = createContext(null);

export  const UserProvider = ({ children }) => {
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const fileInputRef = useRef(null);
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

    <UserContext.Provider value={{ user, loading ,fileInputRef }}>
      {children}
    </UserContext.Provider>
  );
};