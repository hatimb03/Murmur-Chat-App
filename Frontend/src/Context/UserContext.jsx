/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    axios.get("/profile", { withCredentials: true }).then((response) => {
      setUserId(response.data.userId);
      setUsername(response.data.username);
      setName(response.data.name);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, userId, setUserId, name, setName }}
    >
      {children}
    </UserContext.Provider>
  );
};
