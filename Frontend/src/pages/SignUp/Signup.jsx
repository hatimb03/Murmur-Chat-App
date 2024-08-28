import { useState } from "react";
import { GenderCheck } from "./GenderCheck";
import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/useSignUp";

export const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignUp();

  const handleGender = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    signup(inputs);
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center sm:min-w-96 w-80 mx-auto'>
        <div className='h-full p-6 w-full bg-green-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10'>
          <h1 className='text-3xl  font-semibold text-center text-gray-300 mb-10'>
            SignUp <span className='text-[#333333]'>Murmur</span>
          </h1>
          <form onSubmit={handleSignUp}>
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
                  placeholder='Full Name'
                  value={inputs.fullName}
                  onChange={(e) => {
                    setInputs({ ...inputs, fullName: e.target.value });
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
                  <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
                </svg>
                <input
                  type='text'
                  className='grow'
                  placeholder='Username'
                  value={inputs.username}
                  onChange={(e) => {
                    setInputs({ ...inputs, username: e.target.value });
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
                  value={inputs.password}
                  onChange={(e) => {
                    setInputs({ ...inputs, password: e.target.value });
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
                  placeholder='Confirm Password'
                  value={inputs.confirmPassword}
                  onChange={(e) => {
                    setInputs({ ...inputs, confirmPassword: e.target.value });
                  }}
                />
              </label>
            </div>
            <GenderCheck
              onCheckBoxChange={handleGender}
              selectedGender={inputs.gender}
            />
            <div>
              <button
                type='submit'
                className='btn btn-block mt-5'
                disabled={loading}
              >
                {!loading ? (
                  "SignUp"
                ) : (
                  <span className='loading loading-spinner'></span>
                )}
              </button>
            </div>
            <Link
              to='/login'
              className='text-sm hover:underline text-[#333333] hover:text-blue-400 mt-5 inline-block'
            >
              {"Already have an account?"}
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};
