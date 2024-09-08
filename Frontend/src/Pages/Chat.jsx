/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { IoSendOutline } from "react-icons/io5";
import { UserContext } from "../Context/UserContext";
import { getRandomMessage } from "../utils/showMessageRandom";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, userId } = useContext(UserContext);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username, name }) => {
      people[userId] = { username: username, name: name };
    });

    setOnlinePeople(people);
  };

  // Implementing websockets
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);

    // No cleanup function here due to previous issues
  }, []);

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log({ e, messageData });

    if (`online` in messageData) {
      showOnlinePeople(messageData.online);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: messageData.text, isOur: false },
      ]);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
  }, [navigate]);

  function handleMessageSend(e) {
    e.preventDefault();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [...prev, { text: newMessageText, isOur: true }]);
    } else {
      console.log("WebSocket is not open.");
    }
  }

  function onBackClick() {
    setSelectedUserId(null);
  }

  const onlinePeopleExcludingUser = { ...onlinePeople };
  delete onlinePeopleExcludingUser[userId];

  return (
    <>
      <Navbar isSelectedUser={selectedUserId} onBackClick={onBackClick} />
      <div className='h-screen bg-red-200 flex flex-col md:flex-row'>
        {/* Left Section: User List */}
        <div
          className={`left h-full bg-blue-50 w-full md:w-1/3 lg:w-1/4 overflow-auto pt-20 p-6 flex flex-col ${
            selectedUserId ? "hidden md:flex" : "flex"
          }`}
        >
          {Object.keys(onlinePeopleExcludingUser).map((userId) => (
            <div
              key={userId}
              onClick={() => {
                setSelectedUserId(userId);
                console.log("Selected user id: ", userId);
              }}
              className={`contactContainer border-b py-4 px-2 flex items-center gap-8 hover:cursor-pointer hover:bg-white ${
                userId === selectedUserId ? "bg-blue-100" : ""
              }`}
            >
              <div className='avatar online opacity-70'>
                <div className='w-10 flex items-center justify-center rounded-full bg-blue-200 text-xl'>
                  <div className='h-full w-full flex items-center justify-center'>
                    {onlinePeople[userId].name[0]}
                  </div>
                </div>
              </div>

              <div className='flex flex-col flex-1'>
                <div className='text-xs text-gray-600'>
                  @{onlinePeople[userId].username}
                </div>
                <div className='text-xl'>{onlinePeople[userId].name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section: Chat View */}
        <div
          className={`right bg-white md:w-2/3 lg:w-3/4 h-full flex-col overflow-auto pt-20 px-2 ${
            selectedUserId ? "flex" : "hidden md:flex"
          }`}
        >
          <div className='flex-1'>
            {!selectedUserId && (
              <div className='p-8 text-zinc-500 text-xl'>
                <div className='mb-10 text-zinc-400'>{getRandomMessage()}</div>
                <p>&larr; Select someone to chat</p>
              </div>
            )}

            {!!selectedUserId && (
              <div>
                {messages.map((message, index) => (
                  <div key={index}>{message.text}</div>
                ))}
              </div>
            )}
          </div>

          <div className='relative'>
            {!!selectedUserId && (
              <form className='flex items-center' onSubmit={handleMessageSend}>
                <input
                  type='text'
                  placeholder='Enter your message ...'
                  className='input input-bordered w-full pr-16 mb-1'
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />
                <button
                  type='submit'
                  className='absolute right-0 bottom-1 text-blue-500 p-4 rounded-tl-none rounded-bl-none rounded-br rounded'
                >
                  <IoSendOutline />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
