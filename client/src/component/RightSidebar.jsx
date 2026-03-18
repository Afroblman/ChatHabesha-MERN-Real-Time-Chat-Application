import assets from "../assets/assets";
import { IoClose } from "react-icons/io5";
import {
  FiImage,
  FiVideo,
  FiFileText,
  FiLink,
  FiTrash2,
  FiSlash,
} from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ContactContext } from "../context/ContactContext.jsx";

// Common styles for each media list item
const mediaListStyle =
  "hover:bg-gray-100/12 flex items-center gap-5 p-2 pl-6 rounded cursor-pointer";

const RightSidebar = ({
  onMediaClick,
  style,
  isOverlayMode = false,
  onCloseRightSidebarOverlay,
  onCloseRightSidebarInline,
  setOpenDeleteChatPage,
}) => {
  const { selectedUser, blockContact, blockedUsers, unblockContact, owner } =
    useContext(ContactContext);
  const { onlineUsers } = useContext(AuthContext);

  if (!selectedUser) return null;

  // Check if the selected user is blocked
  const isBlocked = blockedUsers.some((user) => user._id === selectedUser._id);

  return (
    selectedUser && (
      <aside
        style={isOverlayMode ? style : null}
        className={`bg-[#1F2937] text-white w-full relative overflow-y-scroll ${
          selectedUser && !isOverlayMode ? "hidden xl:block" : ""
        }`}
      >
        {/* Header with close button and user info */}
        <div className="sticky top-0 z-20 bg-[#1F2937]">
          <button
            onClick={
              isOverlayMode
                ? onCloseRightSidebarOverlay
                : onCloseRightSidebarInline
            }
            className="absolute right-5 top-4 cursor-pointer"
          >
            <IoClose className="text-white text-2xl font-bold" />
          </button>
          <header className="pt-7 px-6 flex flex-col items-center gap-2">
            {/* User profile picture */}
            <img
              src={
                selectedUser.blockedUsers?.includes(owner._id)
                  ? assets.avatar_icon
                  : selectedUser?.profilePicture || assets.avatar_icon
              }
              alt="User profile"
              className="w-20 aspect-square rounded-full"
            />

            {/* User name with online indicator if not blocked */}
            <p className="text-lg font-medium flex items-center gap-2">
              {!selectedUser.blockedUsers?.includes(owner._id) &&
                onlineUsers.includes(selectedUser._id) && (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                )}
              {selectedUser.fullName}
            </p>

            {/* User bio */}
            <p className="text-sm opacity-70">{selectedUser.bio}</p>
          </header>

          <hr className="border-white/30 my-4 w-full" />
        </div>

        {/* Media and action list */}
        <section className="overflow-y-auto">
          <ul className="overflow-y-scroll grid grid-cols-1 gap-3 opacity-80">
            <li
              onClick={() => onMediaClick("photos")}
              className={mediaListStyle}
            >
              <FiImage className="text-lg" />
              <span>3 Photos</span>
            </li>
            <li
              onClick={() => onMediaClick("videos")}
              className={mediaListStyle}
            >
              <FiVideo className="text-lg" />
              <span>4 Videos</span>
            </li>
            <li
              onClick={() => onMediaClick("files")}
              className={mediaListStyle}
            >
              <FiFileText className="text-lg" />
              <span>10 Files</span>
            </li>

            <li
              onClick={() => onMediaClick("links")}
              className={mediaListStyle}
            >
              <FiLink className="text-lg" />
              <span>2 Shared Links</span>
            </li>

            <hr className="border-white/30 my-3 w-full" />

            <li
              onClick={() => {
                if (isBlocked) {
                  unblockContact(selectedUser._id);
                } else {
                  blockContact(selectedUser._id);
                }
              }}
              className={mediaListStyle}
            >
              <FiSlash className="text-lg" />
              <span>{isBlocked ? "UnBlock User" : "Block User"}</span>
            </li>

            <li
              onClick={() => {
                setOpenDeleteChatPage(true);
              }}
              className={`${mediaListStyle} text-red-400 opacity-100`}
            >
              <FiTrash2 className="text-lg" />
              <span>Delete Chat</span>
            </li>
          </ul>
        </section>
      </aside>
    )
  );
};

export default RightSidebar;
