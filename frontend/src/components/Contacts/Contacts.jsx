import userImg from "../../assets/user.png";
import { getLatestMsgRoute, profileImageRoute } from "../../utills/apiRoutes";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import styles from "./Contacts.module.css";

const Contacts = ({ allUsers, messages, setMessages }) => {
  const [latestMsgs, setLatestMsgs] = useState([]);

  const { user } = useSelector((state) => state.user);

  const fetchLatestMessages = async (userId) => {
    try {
      const latestMessages = await Promise.all(
        allUsers.map(async (contact) => {
          const { data } = await axios.get(
            `${getLatestMsgRoute}/${contact._id}/${userId}`
          );
          return data;
        })
      );

      setLatestMsgs(latestMessages);
    } catch (error) {
      toast.error(error.response.data.messages);
    }
  };

  useEffect(() => {
    fetchLatestMessages(user?._id);
  }, [allUsers, messages.data]);

  return (
    <div className={styles.usersCnt}>
      {allUsers.length
        ? allUsers?.map((contact) => (
            <div
              className={`${styles.userDet} ${
                messages.sender._id == contact._id ? styles.userActive : ""
              }`}
              key={contact._id}
              onClick={() => setMessages((p) => ({ ...p, sender: contact }))}
            >
              <div className={styles.imgCnt}>
                <img
                  height={49}
                  width={49}
                  src={
                    contact?.profileImg
                      ? `${profileImageRoute}/${contact?._id}`
                      : userImg
                  }
                  alt="user-avatar"
                />
              </div>
              <div className={styles.userName}>
                <div>{contact.username}</div>
                <div className={styles.latestMsg}>
                  {latestMsgs.length > 0 &&
                    latestMsgs.map((msg) => msg.sender === contact._id) &&
                    latestMsgs.map((msg) => {
                      if (
                        msg.sender === contact._id ||
                        msg.receiver === contact._id
                      )
                        return (
                          <>
                            {msg.sender === user._id && <BiCheckDouble />}
                            {msg.message.substr(0, 50) +
                              (msg.message.length > 50 ? "..." : "")}
                          </>
                        );
                    })}
                </div>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};

export default Contacts;
