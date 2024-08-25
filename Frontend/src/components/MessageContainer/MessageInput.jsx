import { IoMdSend } from "react-icons/io";

const MessageInput = () => {
  return (
    <div className='relative w-full mt-2'>
      <form action=''>
        <input
          type='text'
          placeholder='Enter your message ...'
          className='input input-bordered w-full pl-4 pr-10'
        />
        <button
          type='submit'
          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xl hover:text-white'
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
