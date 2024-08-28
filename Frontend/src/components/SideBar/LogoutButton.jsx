import { IoLogOutOutline } from "react-icons/io5";
import { useLogOut } from "../../hooks/useLogOut";

const LogoutButton = () => {
  const { loading, logout } = useLogOut();

  return (
    <div
      className='mt-6 text-4xl hover:text-white cursor-pointer tooltip w-fit'
      data-tip='Logout'
    >
      {!loading ? (
        <IoLogOutOutline onClick={logout} />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};

export default LogoutButton;
