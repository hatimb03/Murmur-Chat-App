import { FaSearch } from "react-icons/fa";
import useSendMessage from "../../hooks/useSendMessage";
import { useState } from "react";

const SearchInput = () => {
  const { loading, sendMessage } = useSendMessage();
  const [message, setMessage] = useState("");

  const handleMessageSend = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    e.stopPropagation();
    localStorage.setItem("preventDefaultCalled", "true");

    if (!message) return;

    try {
      await sendMessage(message);
      // setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <form
      className='flex items-center gap-2 w-full'
      onSubmit={(e) => handleMessageSend(e)}
    >
      <input
        type='text'
        placeholder='Search'
        className='input input-bordered rounded-full flex-1 w-[180px] sm:w-full'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type='submit'
        className='btn btn-circle text-white opacity-80 hover:opacity-100 flex-shrink-0'
      >
        {!loading ? (
          <FaSearch />
        ) : (
          <span className='loading loading-spinner'></span>
        )}
      </button>
    </form>
  );
};

export default SearchInput;
