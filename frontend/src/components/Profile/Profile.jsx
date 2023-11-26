import ReactDOM from "react-dom";
import { FaArrowLeft } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { profileImageRoute, updateUserRoute } from "../../utills/apiRoutes";
import toast from "react-hot-toast";
import { updateUser } from "../../store/userSlice";
import userImg from "../../assets/user.png";
import styles from "./Profile.module.css";

const Profile = ({ setIsVisible }) => {
  const [isEdit, setIsEdit] = useState({
    username: false,
    password: false,
    answer: false,
  });
  const [auth, setAuth] = useState({
    username: "",
    password: "",
    answer: "",
    profileImg: "",
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setAuth({
        username: user.username,
        password: "",
        answer: user.answer,
        profileImg: "",
      });
    }
  }, [user]);

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("username", auth.username);
      formData.append("answer", auth.answer);
      if (auth.password) {
        formData.append("password", auth.password);
      }
      if (auth.profileImg) {
        formData.append("profileImg", auth.profileImg);
      }

      const { data } = await axios.put(updateUserRoute, formData);
      if (data.username) {
        dispatch(updateUser(data));
        toast.success("Profile Updated");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputFields = (e, fieldName) => {
    if (fieldName === "profileImg") {
      setAuth((p) => ({ ...p, [fieldName]: e.target.files[0] }));
    } else {
      setAuth((p) => ({ ...p, [fieldName]: e.target.value }));
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.profileModalOverlay}>
      <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.heading}>
          <FaArrowLeft
            onClick={() => setIsVisible({ menu: false, profile: false })}
          />
          <span>Profile</span>
        </div>
        <form className={styles.profileUpdateSec} onSubmit={handleUserUpdate}>
          <div className={styles.editValue}>
            <div className={styles.imgCnt}>
              <img
                width={80}
                height={80}
                src={
                  user.profileImg
                    ? `${profileImageRoute}/${user?._id}`
                    : userImg
                }
                alt="profile picture"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputFields(e, "profileImg")}
              />
            </div>
          </div>

          <div className={styles.editValue}>
            <label>User name</label>
            <div className={styles.inputCnt}>
              <input
                type="text"
                value={auth?.username}
                disabled={!isEdit.username}
                onChange={(e) => handleInputFields(e, "username")}
                required
              />
              <RiPencilFill
                onClick={() =>
                  setIsEdit((p) => ({ ...p, username: !p.username }))
                }
              />
            </div>
          </div>

          <div className={styles.editValue}>
            <label>Password</label>
            <div className={styles.inputCnt}>
              <input
                type="password"
                value={auth?.password}
                disabled={!isEdit.password}
                onChange={(e) => handleInputFields(e, "password")}
              />
              <RiPencilFill
                onClick={() =>
                  setIsEdit((p) => ({ ...p, password: !p.password }))
                }
              />
            </div>
          </div>

          <div className={styles.editValue}>
            <label>Favorite food</label>
            <div className={styles.inputCnt}>
              <input
                type="text"
                value={auth?.answer}
                disabled={!isEdit.answer}
                onChange={(e) => handleInputFields(e, "answer")}
                required
              />
              <RiPencilFill
                onClick={() => setIsEdit((p) => ({ ...p, answer: !p.answer }))}
              />
            </div>
          </div>

          <button type="submit" className={styles.updateBtn}>
            update
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Profile;
