import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { IoSendOutline } from "react-icons/io5";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import UserList from "./UserList";
import { uniqBy } from "lodash";
import { getRandomMessage } from "../../utils/showMessageRandom";

// ... other imports

const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId } = useContext(UserContext);
  const divUnderMessages = useRef();

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username, name }) => {
      people[userId] = { username: username, name: name };
    });
    setOnlinePeople(people);
  };

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected, trying to reconnect ...");
        connectToWs();
      }, 1000);
    });
  }

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);

    if (`online` in messageData) {
      try {
        setLoading(true);
        showOnlinePeople(messageData.online);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else if (`text` in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
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
      const messageText = newMessageText;
      if (messageText.trim() === "") return;
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          sender: userId,
          text: newMessageText,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          sender: userId,
          recipient: selectedUserId,
          text: messageText,
          isOur: true,
          _id: Date.now(),
        },
      ]);
    } else {
      console.log("WebSocket is not open.");
    }
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data.users
        .filter((p) => p._id !== userId)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople, userId]);

  async function getMessages() {
    if (!selectedUserId) return;
    try {
      setLoading(true);
      const res = await axios.get(`/messages/${selectedUserId}`);
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMessages();
  }, [selectedUserId]);

  const onBackClick = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  const handleUserClick = useCallback((userId) => {
    setSelectedUserId(userId);
    getMessages();
  }, []);

  const onlinePeopleExcludingUser = { ...onlinePeople };
  delete onlinePeopleExcludingUser[userId];

  const messagesWithoutDuplicates = uniqBy(messages, "_id");
  const messagesToShow = messagesWithoutDuplicates.filter(
    (message) =>
      message.recipient === selectedUserId || message.sender === selectedUserId
  );

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
            <UserList
              userId={userId}
              online={true}
              selectedUserId={selectedUserId}
              onlinePeople={onlinePeople}
              key={userId}
              onClick={handleUserClick}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <UserList
              userId={userId}
              online={false}
              selectedUserId={selectedUserId}
              onlinePeople={offlinePeople}
              key={userId}
              onClick={handleUserClick}
            />
          ))}
        </div>

        {/* Right Section: Chat View */}
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
                    <div
                      className={`chat ${
                        message.sender == userId ? "chat-start" : "chat-end"
                      }`}
                    >
                      <div className='chat-bubble bg-blue-500 text-white break-words'>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            )}

            {loading && (
              <span className='loading loading-dots loading-sm'></span>
            )}

            {!!selectedUserId && !loading && messagesToShow.length === 0 && (
              <div className='text-center text-zinc-600'>No messages yet!</div>
            )}
          </div>

          {!!selectedUserId && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
