import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import styles from "./ChatInput.module.css";

const ChatInput = ({ handleSendMessage, messages, setMessages }) => {
  return (
    <form className={styles.sendMessage} onSubmit={handleSendMessage}>
      {messages.showEmoji && (
        <RxCross2
          onClick={() => setMessages((p) => ({ ...p, showEmoji: false }))}
        />
      )}
      <BsEmojiSmile
        className={styles.emoji}
        onClick={() => setMessages((p) => ({ ...p, showEmoji: !p.showEmoji }))}
      />
      <input
        type="text"
        placeholder="Type a message"
        onChange={(e) =>
          setMessages((p) => ({ ...p, sendText: e.target.value }))
        }
        value={messages.sendText}
        autoFocus
      />
      <button className={styles.submit}>
        <IoMdSend type="submit" />
      </button>
    </form>
  );
};

export default ChatInput;
