/* eslint-disable react/prop-types */
import { BiSolidMessageRounded } from "react-icons/bi";
import { TbArrowBackUp } from "react-icons/tb";

const Navbar = ({ isSelectedUser, onBackClick }) => {
  return (
    <nav>
      <div className='w-full bg-blue-100 border-b fixed top-0 py-4 flex items-center gap-2 pl-4 '>
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
      </div>
    </nav>
  );
};

export default Navbar;
