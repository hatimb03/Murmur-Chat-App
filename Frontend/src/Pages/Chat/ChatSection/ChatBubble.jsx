/* eslint-disable react/prop-types */
const ChatBubble = ({ message, userId }) => {
  return (
    <div
      className={`chat ${message.sender == userId ? "chat-start" : "chat-end"}`}
    >
      <div className='chat-bubble bg-blue-500 text-white break-words'>
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;
