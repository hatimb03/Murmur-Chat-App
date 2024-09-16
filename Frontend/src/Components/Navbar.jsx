/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { TbArrowBackUp } from "react-icons/tb";
import { UserContext } from "../Context/UserContext";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isSelectedUser, onBackClick }) => {
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const { username } = useContext(UserContext);
  const displayUsername = username ? username.toUpperCase().charAt(0) : "";

  const navigate = useNavigate();

  useEffect(() => {}, []);

  async function handleLogout() {
    try {
      await axios.get("/auth/logout");

      localStorage.removeItem("token");
    } catch (err) {
      console.log("Logout error", err.message);
    } finally {
      navigate("/login");
    }
  }

  return (
    <nav className='relative z-50'>
      <div className='w-full bg-blue-100 border-b fixed top-0 py-4 flex items-center gap-2  px-4  cursor-pointer'>
        {isSelectedUser && (
          <TbArrowBackUp
            className='font-extrabold text-2xl text-zinc-500 cursor-pointer'
            onClick={onBackClick}
          />
        )}

        <div className='flex items-center justify-center flex-grow'>
          <BiSolidMessageRounded className='text-blue-500 text-2xl' />
          <h1 className='text-blue-500 text-center text-2xl '>Murmur</h1>
        </div>

        <div
          className={`avatar opacity-100 relative`}
          onClick={() => setShowLogoutButton(!showLogoutButton)}
        >
          {showLogoutButton && (
            <div
              style={{ display: "flex" }}
              className='absolute top-10 right-5 px-2 py-1 bg-blue-200 text-blue-800 z-100 rounded-md opacity-100 items-center flex-col justify-around'
            >
              <div className='text-xl font-bold border-b pb-1'>@{username}</div>
              <button
                className='p-0 hover:bg-white w-full rounded-lg'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
          <div className='w-10 flex items-center justify-center rounded-full bg-blue-200 text-xl'>
            <div
              className={`h-full w-full flex items-center justify-center transition-all duration-300 transform ${
                showLogoutButton ? "rotate-180 scale-110" : "rotate-0 scale-100"
              }`}
            >
              {showLogoutButton ? <RxCross2 /> : displayUsername}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
