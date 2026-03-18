import { useContext } from "react";
import { ContactContext } from "../context/ContactContext";

const ChatHeaderDropdownMenu = ({
  menuRef,
  setIsMenuOpen,
  selectedUser,
  setOpenClearMsgPage,
  setOpenDeleteChatPage,
}) => {
  const {
    addContact,
    blockContact,
    contacts,
    blockedUsers,
    deleteContact,
    unblockContact,
  } = useContext(ContactContext);

  const isContact = contacts.some((user) => user._id === selectedUser._id);
  const isBlocked = blockedUsers.some((user) => user._id === selectedUser._id);

  return (
    <ul
      ref={menuRef}
      className="absolute top-full right-0 w-44 p-2 rounded-md bg-[#111827] text-white border border-gray-600 flex flex-col"
    >
      <li
        onClick={() => setIsMenuOpen(false)}
        className="px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100/12"
      >
        Mute notifications
      </li>
      <hr className="my-1 border-gray-600" />

      <li
        onClick={() => {
          if (isContact) {
            deleteContact(selectedUser._id);
          } else {
            addContact(selectedUser._id);
          }
          setIsMenuOpen(false);
        }}
        className="px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100/12"
      >
        {isContact ? "Delete Contact" : "Add Contact"}
      </li>
      <hr className="my-1 border-gray-600" />

      <li
        onClick={() => {
          if (isBlocked) {
            unblockContact(selectedUser._id);
          } else {
            blockContact(selectedUser._id);
          }
          setIsMenuOpen(false);
        }}
        className="px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100/12"
      >
        {isBlocked ? "UnBlock User" : "Block User"}
      </li>
      <hr className="my-1 border-gray-600" />

      <li
        onClick={() => {
          setIsMenuOpen(false);
          setOpenClearMsgPage(true);
        }}
        className="px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100/12"
      >
        Clear history
      </li>
      <hr className="my-1 border-gray-600" />

      <li
        onClick={() => {
          setIsMenuOpen(false);
          setOpenDeleteChatPage(true);
        }}
        className="px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100/12 text-red-400"
      >
        Delete Chat
      </li>
    </ul>
  );
};

export default ChatHeaderDropdownMenu;
