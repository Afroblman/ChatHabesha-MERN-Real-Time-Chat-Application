import { useState, useEffect, useRef, useContext } from "react";
import assets from "../assets/assets";
import { FaSearch } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import EditProfile from "./Profile";
import MenuDropdown from "./MenuDropdown";
import { AuthContext } from "../context/AuthContext";
import ContactPage from "./ContactPage";
import { ContactContext } from "../context/ContactContext";
import BlockedContactPage from "./BlockedUsersPage";
import LastSeenAndOnline from "./LastSeenAndOnline";

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

const LeftSidebar = () => {
  const {
    selectedUser,
    setSelectedUser,
    getContacts,
    contacts,
    unseenMessages,
    allUsers,
    allRelevantUsers,
    owner,
  } = useContext(ContactContext);
  const { loading } = useContext(AuthContext);

  const { onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openContacts, setOpenContacts] = useState(false);
  const [openBlockedContacts, setOpenBlockedContacts] = useState(false);
  const [openLastSeenAndOnline, setOpenLastSeenAndOnline] = useState(false);
  const menRef = useRef();

  // Filter users based on search input or combine contacts and relevant users
  const filteredUsers = input
    ? allUsers.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : [
        ...new Map(
          [...(allRelevantUsers || []), ...contacts].map((user) => [
            user._id,
            user,
          ]),
        ).values(),
      ];

  // Fetch contacts whenever onlineUsers changes
  useEffect(() => {
    getContacts();
  }, [onlineUsers]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menRef.current && !menRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <aside
      className={`bg-[#1F2937] w-full h-full flex flex-col overflow-y-hidden text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Profile modal */}
      {openProfile && (
        <div style={overlayBackground} onClick={() => setOpenProfile(false)}>
          <EditProfile onCloseProfile={() => setOpenProfile(false)} />
        </div>
      )}

      {/* Contacts modal */}
      {openContacts && (
        <div style={overlayBackground} onClick={() => setOpenContacts(false)}>
          <ContactPage onCloseContacts={() => setOpenContacts(false)} />
        </div>
      )}

      {/* Blocked users modal */}
      {openBlockedContacts && (
        <div
          style={overlayBackground}
          onClick={() => setOpenBlockedContacts(false)}
        >
          <BlockedContactPage
            onCloseBlockedContacts={() => setOpenBlockedContacts(false)}
          />
        </div>
      )}

      {/* Last seen and online modal */}
      {openLastSeenAndOnline && (
        <div
          style={overlayBackground}
          onClick={() => setOpenLastSeenAndOnline(false)}
        >
          <LastSeenAndOnline
            onCloseLastSeenAndOnline={() => setOpenLastSeenAndOnline(false)}
            selectedUser={selectedUser}
          />
        </div>
      )}

      <header className="pb-1 px-2">
        <div ref={menRef} className="flex justify-between items-center">
          {/* menu button */}
          <div className="relative pt-2">
            <button
              onClick={() => {
                setOpen(!open);
              }}
              className={`flex items-center justify-center rounded-full ${
                open ? "bg-gray-100/12" : ""
              } w-9 h-9 cursor-pointer`}
            >
              <HiOutlineMenu className="text-2xl text-white" />
            </button>

            {/* Dropdown menu */}
            {open && (
              <MenuDropdown
                setOpenProfile={setOpenProfile}
                setOpenContacts={setOpenContacts}
                setOpenBlockedContacts={setOpenBlockedContacts}
                setOpen={setOpen}
                setOpenLastSeenAndOnline={setOpenLastSeenAndOnline}
              />
            )}
          </div>

          <h1 className="mx-auto max-w-60 font-bold">ChatHabesha</h1>
        </div>

        {/* Search bar */}
        <form className="bg-gray-100/12 rounded-full flex items-center gap-2 py-2 px-4 mt-5">
          <FaSearch className="text-base" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="search"
            placeholder="Search User"
            className="bg-transparent outline-none text-base flex-1 text-white"
          />
        </form>
      </header>

      {/* Users list */}
      <nav className="overflow-y-auto">
        <ul className="flex flex-col">
          {filteredUsers.map((user, i) => (
            <li
              key={i}
              onClick={() => {
                setSelectedUser(user);
              }}
              className={`relative flex items-center gap-2 p-2 rounded cursor-pointer ${
                selectedUser?._id === user._id
                  ? "bg-gray-100/20"
                  : "hover:bg-gray-100/5"
              }`}
            >
              {/* user profile image */}
              <img
                src={
                  user.blockedUsers?.includes(owner._id)
                    ? assets.avatar_icon
                    : user.profilePicture || assets.avatar_icon
                }
                alt="Profile image"
                className="w-10 h-10 rounded-full"
              />

              {/* user info */}
              <div>
                <p>{user.fullName}</p>
                <span
                  className={`text-xs ${
                    user.blockedUsers?.includes(owner._id)
                      ? "text-neutral-400"
                      : onlineUsers.includes(user._id)
                        ? "text-green-400"
                        : "text-neutral-400"
                  }`}
                >
                  {user.blockedUsers?.includes(owner._id)
                    ? "Blocked"
                    : onlineUsers.includes(user._id)
                      ? "Online"
                      : "Offline"}
                </span>
              </div>

              {/* unseen messages badge */}
              {unseenMessages && unseenMessages[user._id] && (
                <p className="absolute top-4 right-3 text-xs h-5 min-w-[1.25rem] px-1 flex justify-center items-center rounded-full bg-gray-100/12">
                  {unseenMessages[user._id]}
                </p>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
