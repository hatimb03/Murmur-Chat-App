import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const SideBar = () => {
  return (
    <>
      <div className='flex flex-col  border-r border-slate-400 p-4'>
        <SearchInput />
        <div className='divider px-3'></div>
        <Conversations />
        <LogoutButton />
      </div>
    </>
  );
};

export default SideBar;
