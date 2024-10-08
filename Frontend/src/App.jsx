import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { UserContextProvider } from "./Context/UserContext";
import Chat from "./Pages/Chat/Chat";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  axios.defaults.baseURL = apiUrl;
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Router>
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
