import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    setUsername: setLoggedInUsername,
    setUserId,
    setName: setLoggedInName,
  } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !username || !password || !confirmPassword) {
      setError("All the fields are required");
      toast.error("All the fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password too short, atleast 8 characters required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    setError("");

    //sending the data
    try {
      setLoading(true);
      const response = await axios.post("/auth/register", {
        name,
        username,
        password,
        confirmPassword,
      });
      if (response.data && response.data.token) {
        setLoggedInUsername(username);
        setUserId(response.data.userId);
        setLoggedInName(response.data.name);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
        toast.error(err.response.data.message || "An error occurred");
      } else {
        setError("Network error or unexpected issue");
        toast.error("Network error or unexpected issue");
      }
    } finally {
      setLoading(false);
      navigate("/chat");
    }
  };

  return (
    <>
      <div className='h-screen  bg-blue-50'>
        <div className='flex items-center justify-center h-full'>
          <div className='sm:shadow-custom-shadow lg:w-9/28 px-12 py-8 bg-white max-w-full rounded-md'>
            <h2 className='text-center text-3xl mb-4'>
              Welcome to <span className='text-blue-400'>Murmur</span>
            </h2>
            <h3 className='text-center text-xl font-bold mb-6'>Register</h3>
            <form className='flex flex-col gap-4' onSubmit={handleRegister}>
              <label className='input input-bordered flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='h-4 w-4 opacity-70'
                >
                  <path d='M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm2-.5A.5.5 0 0 0 4.5 2v12a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5H5z' />
                  <path d='M6 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z' />
                </svg>
                <input
                  type='text'
                  className='grow'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
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
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
                  placeholder='Confirm Password'
                  autoComplete='off'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </label>
              {error && <p className='text-red-500 text-sm w-3/4'>{error}</p>}
              <button className='btn btn-outline btn-primary' type='submit'>
                {loading ? (
                  <span className='loading loading-dots'></span>
                ) : (
                  "Register"
                )}
              </button>
              <Link
                to='/login'
                className='text-sm text-blue-600 hover:underline'
              >
                Already have an account?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
