// AuthContext.js
import React, { createContext, useState ,useContext} from 'react';
import axios from 'axios';
import servers from '../environment';


// Create the Auth context
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Create axios client
const client = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL:`${servers}`
});

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (userData) => {
    try {
      const response = await client.post('/register', userData);
      setUsername(response.data.Username);
      setName("");
      setPassword("");
      setUsername("");

    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const handleLogin = async (userData) => {
    try {
      const response = await client.post('/login', userData);
      setUsername(response.data.username);
      setPassword("");
      setUsername("");
      
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

 
    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    Token: localStorage.getItem("Token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (Meetingcode) => {
        try {
            let request = await client.post("/add_to_activity", {
                Token: localStorage.getItem("Token"),
                Meetingcode:Meetingcode,
            });
            return request
        } catch (e) {
            throw e;
        }
    }


  const value = {
    username,setUsername,
    name,setName,
    password,setPassword,
    handleLogin,handleRegister,
    addToUserHistory,getHistoryOfUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, client };
