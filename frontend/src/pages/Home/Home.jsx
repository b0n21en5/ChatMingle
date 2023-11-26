import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import {
  getAllUsersRoute,
  getReceivedMsgRoute,
  searchUsersRoute,
  sendMsgRoute,
  socketURL,
} from "../../utills/apiRoutes";
import NoChat from "../../assets/no-chat.png";
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import Contacts from "../../components/Contacts/Contacts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import moment from "moment/moment";
import UserMenu from "../../components/UserMenu/UserMenu";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import ChatInput from "../../components/ChatInput/ChatInput";
import Profile from "../../components/Profile/Profile";
import styles from "./Home.module.css";

const Home = () => {
  const [messages, setMessages] = useState({
    sender: "",
    data: [],
    sendText: "",
    showEmoji: false,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState({ isActive: false, keyword: "" });

  const [isVisible, setIsVisible] = useState({ menu: false, profile: false });
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messRef = useRef();

  const socket = useRef();

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get(`${getAllUsersRoute}?uid=${user?._id}`);
      setAllUsers(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    socket.current = io(socketURL);

    socket.current.emit("add-user", user?._id);

    socket.current.on("online-users", (socketUsers) => {
      setOnlineUsers(socketUsers);
    });

    socket.current.on("rcv-msg", (newMsg) => {
      setMessages((p) => ({ ...p, data: [...p.data, newMsg] }));
    });

    fetchAllUsers();

    window.addEventListener("pagehide", () => {
      socket.current.emit("remove-user", user?._id);
    });
  }, []);

  const fetchReceivedMessages = async () => {
    try {
      const { data } = await axios.get(
        `${getReceivedMsgRoute}/${messages.sender._id}/${user._id}`
      );
      setMessages((p) => ({ ...p, data: data }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setMessages((p) => ({ ...p, data: [], sendText: "", showEmoji: false }));
    if (messages.sender) {
      fetchReceivedMessages();
    }
  }, [messages.sender]);

  const searchUsers = async () => {
    try {
      const { data } = await axios.get(`${searchUsersRoute}/${search.keyword}`);
      setAllUsers(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (search.keyword) {
      searchUsers();
    } else {
      fetchAllUsers();
    }
  }, [search.keyword]);

  const handleEmojiClick = (event) => {
    let message = messages.sendText;
    message += event.emoji;
    setMessages((p) => ({ ...p, sendText: message }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(sendMsgRoute, {
        sender: user._id,
        receiver: messages.sender._id,
        message: messages.sendText,
      });

      socket.current.emit("send-msg", data);

      setMessages((p) => ({
        ...p,
        data: [...p.data, data],
        sendText: "",
        showEmoji: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (messRef.current) {
      messRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messRef.current, messages.data]);

  return (
    <div className={styles.chatCnt}>
      {/* User / left Container*/}
      <div className={styles.leftCnt}>
        {/* User container Header */}
        <Header
          section="user"
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          user={user}
        />

        {isVisible.menu && <UserMenu setIsVisible={setIsVisible} />}
        {isVisible.profile && <Profile setIsVisible={setIsVisible} />}

        {/* search users/ contacts */}
        <div className={styles.searchSec}>
          <div className={styles.searchBar}>
            <IoSearch />
            <input
              type="text"
              placeholder="Search for users"
              onChange={(e) =>
                setSearch((p) => ({ ...p, keyword: e.target.value }))
              }
            />
          </div>
          <IoFilter />
        </div>

        {/* Contacts list */}
        <div className={styles.scrollableCnt}>
          <Contacts
            allUsers={allUsers}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>

      {/* Message / Right container */}
      <div
        className={`${styles.rightCnt} ${
          messages.sender ? "" : styles.noMsgBg
        }`}
      >
        {messages.sender ? (
          <>
            {/* Sender container header */}
            <Header
              section="sender"
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              user={messages.sender}
              onlineUsers={onlineUsers}
            />

            {/* Messages container */}
            <div className={styles.scrollableCnt}>
              <div className={styles.receivedChats}>
                {messages.data.length
                  ? messages.data?.map((item, idx) => (
                      <div
                        className={`${styles.message} ${
                          messages.sender._id !== item.sender
                            ? styles.myMessage
                            : ""
                        }`}
                        key={idx}
                        ref={messRef}
                      >
                        <span>{item.message}</span>
                        <span className={styles.time}>
                          {moment(item.createdAt).format("h:mm a")}
                        </span>
                      </div>
                    ))
                  : ""}
                {messages.showEmoji && (
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={"100%"}
                    height={300}
                    theme="dark"
                    suggestedEmojisMode="recent"
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                )}
              </div>
            </div>

            <ChatInput
              messages={messages}
              setMessages={setMessages}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className={styles.noChatBg}>
            <img width={320} height={188} src={NoChat} alt="no chat selected" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
