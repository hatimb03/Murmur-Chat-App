/* eslint-disable react/prop-types */
import { IoSendOutline } from "react-icons/io5";

const ChatForm = ({ handleMessageSend, newMessageText, setNewMessageText }) => {
  return (
    <form
      className='flex items-center  bg-white border-t p-2'
      onSubmit={handleMessageSend}
    >
      <input
        type='text'
        placeholder='Enter your message ...'
        className='input input-bordered w-full mr-1  relative'
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
      />

      <button
        type='submit'
        className='p-4 rounded-md text-xl  bg-blue-500 hover:bg-blue-700 text-white'
      >
        <IoSendOutline />
      </button>
    </form>
  );
};

export default ChatForm;
