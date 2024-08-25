import { IoLogOutOutline } from "react-icons/io5";

const LogoutButton = () => {
  return (
    <div
      className='mt-6 text-4xl hover:text-white cursor-pointer tooltip w-fit'
      data-tip='Logout'
    >
      <IoLogOutOutline />
    </div>
  );
};

export default LogoutButton;
