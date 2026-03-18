import Welcome from "./WelcomePage";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useContext } from "react";
import { ContactContext } from "../context/ContactContext";

const ChatContainer = ({
  onOpenRightSidebar,
  onToggleRightSidebar,
  isRightSidebarInlineOpen,
  setOpenDeleteChatPage,
}) => {
  const { selectedUser } = useContext(ContactContext);

  if (!selectedUser) {
    return <Welcome />;
  }

  return (
    <section className="bg-[#111827] h-full flex flex-col overflow-y-hidden">
      {/* Chat header with actions for right sidebar and delete chat */}
      <ChatHeader
        onOpenRightSidebar={onOpenRightSidebar}
        onToggleRightSidebar={onToggleRightSidebar}
        isRightSidebarInlineOpen={isRightSidebarInlineOpen}
        setOpenDeleteChatPage={setOpenDeleteChatPage}
      />
      <hr className="w-full  border-white/30" />

      {/* Chat message list */}
      <ChatMessage />

      {/* Input box for sending messages */}
      <ChatInput />
    </section>
  );
};

export default ChatContainer;
