import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <>
      <form className='flex items-center gap-2 w-full'>
        <input
          type='text'
          placeholder='Search'
          className='input input-bordered rounded-full flex-1 w-[180px] sm:w-full'
        />
        <button
          type='submit'
          className='btn btn-circle text-white opacity-80 hover:opacity-100 flex-shrink-0'
        >
          <FaSearch />
        </button>
      </form>
    </>
  );
};

export default SearchInput;
