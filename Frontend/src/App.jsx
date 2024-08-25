import "./App.css";
import Home from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Signup } from "./pages/SignUp/Signup";

function App() {
  return (
    <div className='p-4 h-screen flex justify-center items-center'>
      <Home />
    </div>
  );
}

export default App;
