import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { ContactContext } from "../context/ContactContext";

const ChatMessage = () => {
  const { messages, getMessages } = useContext(ChatContext);
  const { selectedUser } = useContext(ContactContext);
  const { authUser } = useContext(AuthContext);

  const scrollEnd = useRef();

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex-1 overflow-y-auto p-3">
      <ul className="flex flex-col">
        {messages &&
          messages.map((msg, i) => (
            <li
              key={i}
              className={`flex items-end gap-2 justify-end ${
                msg.senderId !== authUser._id && "flex-row-reverse"
              }`}
            >
              {/* Display image messages */}
              {msg.image ? (
                <figure className="mb-8">
                  <img
                    src={msg.image}
                    alt="Sent message image"
                    className="max-w-[230px] border bg-gray-100/12 rounded-lg overflow-hidden"
                  />
                </figure>
              ) : (
                // Display text messages
                <p
                  className={`p-2 max-w-[230px] md:text-sm font-light rounded-lg mb-8 break-all bg-gray-100/12 text-white ${
                    msg.senderId === authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* Message metadata: avatar and timestamp */}
              <aside className="text-center text-xs">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePicture || assets.avatar_icon
                      : selectedUser.profilePicture || assets.avatar_icon
                  }
                  alt="User avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <time className="text-gray-500" dateTime={msg.createdAt}>
                  {formatMessageTime(msg.createdAt)}
                </time>
              </aside>
            </li>
          ))}
      </ul>

      {/* Dummy element to scroll into view */}
      <span ref={scrollEnd} />
    </section>
  );
};

export default ChatMessage;
