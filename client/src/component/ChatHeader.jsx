import { useState, useEffect, useRef } from "react";
import assets from "../assets/assets";
import { FaArrowLeft } from "react-icons/fa";
import { BiWindows } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatHeaderDropdownMenu from "./ChatHeaderDropdownMenu";
import ClearMessagesPage from "./ClearMessagesPage";
import { ContactContext } from "../context/ContactContext";

// Overlay style for modals
const overlayBackground = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.5)",
  zIndex: 900,
};

const ChatHeader = ({
  onOpenRightSidebar,
  onToggleRightSidebar,
  isRightSidebarInlineOpen,
  setOpenDeleteChatPage,
}) => {
  const { selectedUser, setSelectedUser, owner } = useContext(ContactContext);
  const { onlineUsers } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openClearMsgPage, setOpenClearMsgPage] = useState(false);

  const menuRef = useRef();
  const menuBtnRef = useRef();

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between py-3 pl-3 pr-2">
      {/* Clear message modal */}
      {openClearMsgPage && (
        <div
          style={overlayBackground}
          onClick={() => setOpenClearMsgPage(false)}
        >
          <ClearMessagesPage
            onCloseClearMsgPage={() => setOpenClearMsgPage(false)}
            selectedUser={selectedUser}
          />
        </div>
      )}

      {/* Left section: back button and user info */}
      <div className="relative flex flex-row justify-between items-center w-56">
        {/* Back button for mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden text-sm text-white  cursor-pointer w-7"
        >
          <FaArrowLeft />
        </button>

        {/* User profile and name, click opens right sidebar */}
        <div
          className="cursor-pointer flex items-center gap-3"
          onClick={onOpenRightSidebar}
        >
          <img
            src={
              selectedUser.blockedUsers?.includes(owner._id)
                ? assets.avatar_icon
                : selectedUser.profilePicture || assets.avatar_icon
            }
            alt="Profile image"
            className="w-8 h-8 rounded-full"
          />

          <h2 className="flex-1 text-lg text-white flex items-center gap-2">
            {selectedUser.fullName}
            {!selectedUser.blockedUsers?.includes(owner._id) &&
              onlineUsers.includes(selectedUser._id) && (
                <span className="mt-2 w-2 h-2 rounded-full bg-green-500" />
              )}
          </h2>
        </div>
      </div>

      {/* Right section: toggle rightSidebar panel and menu */}
      <div className="relative flex flex-row justify-between items-center w-16">
        {/* Toggle right sidebar button (visible on XL screens) */}
        <button
          onClick={onToggleRightSidebar}
          className="invisible xl:visible cursor-pointer text-xl"
        >
          <BiWindows
            className={
              isRightSidebarInlineOpen ? "text-gray-400" : "text-white"
            }
          />
        </button>

        {/* Menu button */}
        <button
          ref={menuBtnRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center justify-center rounded-full text-white ${
            isMenuOpen ? "bg-gray-100/12" : ""
          } w-9 h-9 cursor-pointer`}
        >
          <BsThreeDotsVertical className="text-lg" />
        </button>

        {/* Dropdown menu for chat options */}
        {isMenuOpen && (
          <ChatHeaderDropdownMenu
            menuRef={menuRef}
            setIsMenuOpen={setIsMenuOpen}
            selectedUser={selectedUser}
            setOpenClearMsgPage={setOpenClearMsgPage}
            setOpenDeleteChatPage={setOpenDeleteChatPage}
          />
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
