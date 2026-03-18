import { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import { FaPaperPlane } from "react-icons/fa";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { ContactContext } from "../context/ContactContext";

const ChatInput = () => {
  const { selectedUser, blockedUsers, unblockContact } =
    useContext(ContactContext);
  const { sendMessage } = useContext(ChatContext);
  const [msgInput, setMsgInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef();
  const hoverTimeout = useRef();

  const isBlocked = blockedUsers.some((user) => user._id === selectedUser._id);

  // Handle sending a text message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msgInput.trim() === "") return null;
    await sendMessage({ text: msgInput.trim() });
    setMsgInput("");
  };

  // Handle sending an image message
  const handleSendImg = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Show emoji picker on hover
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setShowEmojiPicker(true);
  };

  // Hide emoji picker after a short delay
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowEmojiPicker(false);
    }, 300);
  };

  // Insert emoji at cursor position
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current.selectionStart;
    const newMessage =
      msgInput.slice(0, cursorPos) + emoji + msgInput.slice(cursorPos);
    setMsgInput(newMessage);

    inputRef.current.focus();
  };

  // If user is blocked, show unblock button instead of input
  return isBlocked ? (
    <div
      className="bg-gray-100/12 left-0 right-0 flex px-3 pb-3 items-center justify-center min-h-[50px] sm:min-h-[60px]
      max-[360px]:px-1 max-[360px]:pb-2 max-[360px]:min-h-[45px] text-white"
    >
      <button
        onClick={() => unblockContact(selectedUser._id)}
        className="text-red-400 cursor-pointer"
      >
        UnBlock User
      </button>
    </div>
  ) : (
    <form
      // onSubmit={handleSubmit}
      className="bg-[#111827]  left-0 right-0 flex px-3 pb-3 items-center gap-4 min-h-[50px] sm:min-h-[60px]
            max-[360px]:px-1 max-[360px]:pb-2 max-[360px]:min-h-[45px]"
    >
      {/* Input container with file attachment, emoji picker, and text input */}
      <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full relative min-h-[40px] max-[360px]:px-2 max-[360px]:min-h-[36px]">
        <input type="file" id="fileInput" hidden onChange={handleSendImg} />

        {/* Attachment button triggers file input */}
        <button
          type="button"
          onClick={() => document.getElementById("fileInput").click()}
          className="text-lg font-medium cursor-pointer text-white"
        >
          <GrAttachment />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Send a message"
          className="flex-1 p-2 sm:p-3  max-[360px]:p-1.5 max-[360px]:text-sm outline-none bg-transparent text-white"
          value={msgInput}
          onKeyDown={(e) => (e.key == "Enter" ? handleSubmit(e) : null)}
          onChange={(e) => setMsgInput(e.target.value)}
        />

        {/* Emoji picker button */}
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button type="button" className="text-lg cursor-pointer">
            😄
          </button>

          {showEmojiPicker && (
            <div
              className="absolute bottom-14 right-0 z-50 origin-bottom-right"
              style={{
                transform: "scale(0.8)",
                transformOrigin: "bottom right",
              }}
            >
              <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSubmit}
        type="submit"
        className=" bg-gray-100/12 cursor-pointer w-6 h-6 
            min-[361px]:w-10 min-[361px]:h-10 min-[361px]:text-sm
            min-[421px]:w-12 min-[421px]:h-12 min-[421px]:text-base
            rounded-full flex items-center justify-center"
      >
        <FaPaperPlane className="text-xl max-[361px]:text-sm min-[361px]:max-[420px]:text-sm min-[421px]:max-[1024px]:text-base font-medium cursor-pointer text-white rotate-45" />
      </button>
    </form>
  );
};

export default ChatInput;
