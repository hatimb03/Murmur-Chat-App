//The data of offline people can be seen in the network tab, but the frontend doesnt shwo the data, which means that there is some problem in the frontend of the site, the backend is working fine

import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";

import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { uniqBy } from "lodash";
import UserListSection from "./UserListSection/UserListSection";
import ChatSection from "./ChatSection/ChatSection";

const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId } = useContext(UserContext);

  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

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
    // const wsUrl = "wss://murmur-chat-app.onrender.com";
    const wsUrl = websocketUrl;
    const ws = new WebSocket(wsUrl);

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

    if ("online" in messageData) {
      try {
        setLoading(true);
        showOnlinePeople(messageData.online);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else if ("text" in messageData) {
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
    axios
      .get("/users/people")
      .then((res) => {
        const data = res.data.users || [];
        const offlinePeopleArr = data
          .filter((p) => p._id !== userId)
          .filter((p) => !Object.keys(onlinePeople).includes(p._id));
        const offlinePeople = {};
        offlinePeopleArr.forEach((p) => {
          offlinePeople[p._id] = p;
        });
        setOfflinePeople(offlinePeople);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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
        <UserListSection
          selectedUserId={selectedUserId}
          onlinePeople={onlinePeople}
          onlinePeopleExcludingUser={onlinePeopleExcludingUser}
          handleUserClick={handleUserClick}
          offlinePeople={offlinePeople}
        />

        {/* Right Section: Chat View */}
        <ChatSection
          selectedUserId={selectedUserId}
          messages={messages}
          messagesToShow={messagesToShow}
          loading={loading}
          handleMessageSend={handleMessageSend}
          newMessageText={newMessageText}
          setNewMessageText={setNewMessageText}
        />
      </div>
    </>
  );
};

export default Chat;
