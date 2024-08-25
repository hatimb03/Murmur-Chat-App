import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center sm:min-w-96 w-64 mx-auto'>
        <div className='h-full p-6 w-full bg-green-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10'>
          <h1 className='text-3xl  font-semibold text-center text-gray-300'>
            Login <span className='text-[#333333]'>Murmur</span>
          </h1>
          <form onSubmit={handleLogin}>
            <div>
              <label className='input input-bordered flex items-center gap-2 mt-5'>
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
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </label>
            </div>
            <div>
              <label className='input input-bordered flex items-center gap-2 mt-5'>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div>
              <button type='submit' className='btn btn-block mt-5'>
                Login
              </button>
            </div>
            <a
              href='#'
              className='text-sm hover:underline text-[#333333] hover:text-blue-400 mt-5 inline-block'
            >
              {"Don't have an account?"}
            </a>
          </form>
        </div>
      </div>
    </>
  );
};
