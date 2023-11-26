import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import { removeUser } from "../../store/userSlice";
import styles from "./UserMenu.module.css";

const UserMenu = ({ setIsVisible }) => {
  const dispatch = useDispatch();

  return ReactDOM.createPortal(
    <div
      className={styles.userMenuModalOverlay}
      onClick={() => setIsVisible((p) => ({ ...p, menu: false }))}
    >
      <div
        className={styles.userMenuModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.menuItem} onClick={() => dispatch(removeUser())}>
          Log out
        </div>
        <div
          className={styles.menuItem}
          onClick={() => {
            setIsVisible({ menu: false, profile: true });
          }}
        >
          Settings
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default UserMenu;
