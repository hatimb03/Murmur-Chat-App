/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";
import { getRandomMessage } from "../../../utils/showMessageRandom";
import { UserContext } from "../../../Context/UserContext";
import ChatBubble from "./ChatBubble";
import ChatForm from "./ChatForm";

const ChatSection = ({
  selectedUserId,
  messages,
  messagesToShow,
  loading,
  handleMessageSend,
  newMessageText,
  setNewMessageText,
}) => {
  const { userId } = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <div
      className={`right bg-white md:w-2/3 lg:w-3/4 h-full pt-20 flex flex-col overflow-hidden  ${
        selectedUserId ? "flex" : "hidden md:flex"
      }`}
    >
      <div className='flex-1 overflow-auto p-2'>
        {!selectedUserId && (
          <div className='p-8 text-zinc-500 text-xl'>
            <div className='mb-10 text-zinc-400'>{getRandomMessage()}</div>
            <p>&larr; Select someone to chat</p>
          </div>
        )}

        {!!selectedUserId && messages && (
          <div>
            {messagesToShow.map((message) => (
              <div key={message._id}>
                <ChatBubble message={message} userId={userId} />
              </div>
            ))}
            <div ref={divUnderMessages}></div>
          </div>
        )}

        {loading && <span className='loading loading-dots loading-sm'></span>}

        {!!selectedUserId && !loading && messagesToShow.length === 0 && (
          <div className='text-center text-zinc-600'>No messages yet!</div>
        )}
      </div>

      {!!selectedUserId && (
        <ChatForm
          handleMessageSend={handleMessageSend}
          newMessageText={newMessageText}
          setNewMessageText={setNewMessageText}
        />
      )}
    </div>
  );
};

export default ChatSection;
