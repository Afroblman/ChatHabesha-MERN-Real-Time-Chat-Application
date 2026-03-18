import { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { ContactContext } from "../context/ContactContext";

const ContactPage = ({ onCloseContacts }) => {
  const { getContacts, contacts } = useContext(ContactContext);
  const { setSelectedUser } = useContext(ContactContext);
  const { onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const filteredUsers = input
    ? contacts.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : contacts || [];

  useEffect(() => {
    getContacts();
  }, [onlineUsers]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#1F2937] text-white rounded-lg w-[90%] max-w-md"
    >
      {contacts.length === 0 ? (
        <div className="flex items-center justify-center w-[full] h-20">
          <h1 className="text-lg">No Contacts</h1>
        </div>
      ) : (
        <div>
          <div className="relative flex items-center justify-between p-4">
            <h1>Contacts</h1>
            <button onClick={onCloseContacts} className="cursor-pointer">
              <IoClose className="text-white text-2xl font-bold" />
            </button>
          </div>

          <form className="flex items-center gap-2 py-2 px-4">
            <FaSearch className="text-base" />
            <input
              onChange={(e) => setInput(e.target.value)}
              type="search"
              placeholder="Search User"
              className="bg-transparent outline-none text-base flex-1 text-white"
            />
          </form>

          <hr className="border-white/30 my-1 w-full" />

          <nav className="overflow-y-auto w-full">
            <ul className="flex flex-col">
              {filteredUsers.map((user, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSelectedUser(user);
                    onCloseContacts();
                  }}
                  className="relative flex items-center gap-2 px-2 py-1 rounded cursor-pointer w-full hover:bg-gray-100/5"
                >
                  <img
                    src={user.profilePicture || assets.avatar_icon}
                    alt="Profile image"
                    className="w-10 h-10 rounded-full"
                  />

                  <div>
                    <p>{user.fullName}</p>
                    <span
                      className={`text-xs ${
                        onlineUsers.includes(user._id)
                          ? "text-green-400"
                          : "text-neutral-400"
                      }`}
                    >
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
