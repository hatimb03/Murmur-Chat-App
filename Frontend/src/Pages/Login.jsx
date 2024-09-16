import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    setUsername: setLoggedInUsername,
    setUserId,
    setName: setLoggedInName,
  } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All the fields are required");
      toast.error("All the fields are required");
      return;
    }

    setError("");

    //sending data, api call
    try {
      setLoading(true);
      const response = await axios.post("/auth/login", {
        username: username,
        password: password,
      });

      if (response.data && response.data.token) {
        setLoggedInUsername(response.data.username);
        setUserId(response.data.userId);
        setLoggedInName(response.data.name);

        localStorage.setItem("token", response.data.token);
      } else {
        setError(error.response.data.message);
      }

      toast.success(response.data.message);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      navigate("/chat");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    if (token) return navigate("/chat");
  }, [navigate]);
  return (
    <>
      <div className='h-screen  bg-blue-50'>
        <div className='flex items-center justify-center h-full'>
          <div className='sm:shadow-custom-shadow lg:w-9/28 px-12 py-8 bg-white max-w-full rounded-md'>
            <h2 className='text-center text-3xl mb-4'>
              Welcome to <span className='text-blue-400'>Murmur</span>
            </h2>
            <h3 className='text-center text-xl font-bold mb-6'>Login</h3>
            <form className='flex flex-col gap-4' onSubmit={handleLogin}>
              <label className='input input-bordered flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='h-4 w-4 opacity-70'
                >
                  <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
                </svg>
                <input
                  type='text'
                  className='grow'
                  placeholder='Username'
                  autoComplete='Username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </label>
              <label className='input input-bordered flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='h-4 w-4 opacity-70'
                >
                  <path
                    fillRule='evenodd'
                    d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                    clipRule='evenodd'
                  />
                </svg>
                <input
                  type='password'
                  className='grow'
                  placeholder='Password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </label>

              {error && <p className='text-red-500 text-center'>{error}</p>}

              <button className='btn btn-outline btn-primary' type='submit'>
                {loading ? (
                  <span className='loading loading-dots loading-sm'></span>
                ) : (
                  "Login"
                )}
              </button>
              <Link
                to='/register'
                className='text-sm text-blue-600 hover:underline'
              >
                Do not have an account?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
