import { profileImageRoute } from "../../utills/apiRoutes";
import userImg from "../../assets/user.png";
import { FaAngleDown, FaUsers } from "react-icons/fa";
import { IoMdMore, IoMdSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { BiSolidMessageAdd, BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiRefreshFill } from "react-icons/ri";
import { IoVideocam } from "react-icons/io5";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const Header = ({
  section,
  isVisible,
  setIsVisible,
  user,
  onlineUsers,
  setMessages,
}) => {
  const [mbScreen, setMbScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 430) {
      setMbScreen(true);
    } else {
      setMbScreen(false);
    }
  }, []);

  return (
    <header>
      <div className={styles.currentUser}>
        {mbScreen && section !== "user" && (
          <FaArrowLeft
            onClick={() => setMessages((p) => ({ ...p, sender: "" }))}
          />
        )}
        <div className={styles.logoCnt}>
          <img
            src={
              user?.profileImg ? `${profileImageRoute}/${user?._id}` : userImg
            }
            alt="user logo"
            width={40}
            height={40}
          />
        </div>
        <div className={styles.currentUsername}>
          <div>
            {user?.username[0]?.toUpperCase() + user?.username?.substr(1)}
          </div>
          {onlineUsers && (
            <div className={styles.userStatus}>
              {onlineUsers[user._id] ? (
                <span className={styles.on}>Online</span>
              ) : (
                <span className={styles.off}>Offline</span>
              )}
            </div>
          )}
        </div>
      </div>
      {section === "user" ? (
        <div className={styles.svgCnt}>
          <FaUsers />
          <RiRefreshFill />
          <BiSolidMessageRoundedDetail />
          <BiSolidMessageAdd />
          <IoMdMore
            className={isVisible.menu ? styles.moreAct : ""}
            onClick={() =>
              setIsVisible((p) => ({ ...p, menu: !isVisible.menu }))
            }
          />
        </div>
      ) : (
        <div className={styles.svgCnt}>
          <div className={styles.videoCall}>
            <IoVideocam />
            <FaAngleDown />
          </div>
          <IoMdSearch />
          <IoMdMore />
        </div>
      )}
    </header>
  );
};

export default Header;
