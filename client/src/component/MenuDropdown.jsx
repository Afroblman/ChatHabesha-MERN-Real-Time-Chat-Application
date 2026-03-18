import { useContext } from "react";
import assets from "../assets/assets";
import { MdAccessTime } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";
import { ContactContext } from "../context/ContactContext";

const MenuDropdown = ({
  setOpenProfile,
  setOpenContacts,
  setOpenBlockedContacts,
  setOpen,
  setOpenLastSeenAndOnline,
}) => {
  const { owner } = useContext(ContactContext);
  const { logout } = useContext(AuthContext);

  return (
    <ul className="absolute top-0 h-screen left-[-8px] w-54 p-2 z-1250 bg-[#1F2937] text-white border border-gray-600 flex flex-col">
      {/* Owner profile info at the top of dropdown */}
      <div className="pt-4 pb-4 flex flex-col gap-2">
        <img
          src={owner.profilePicture || assets.avatar_icon}
          alt="User profile"
          className="w-20 aspect-square rounded-full ml-7"
        />
        <p className="text-base font-medium ml-3">{owner.fullName}</p>
        <p className="text-sm opacity-90 ml-3">{owner.bio}</p>
      </div>
      <hr className="my-2 border-gray-500" />
      {/* Dropdown menu items */}
      <li
        onClick={() => {
          setOpenProfile(true);
          setOpen(false);
        }}
        className="px-2 py-2 text-base cursor-pointer rounded hover:bg-gray-100/12 flex items-center justify-content-between gap-5"
      >
        <FiEdit className="text-white text-lg" /> Edit Profile
      </li>
      <li
        onClick={() => {
          setOpenLastSeenAndOnline(true);
          setOpen(false);
        }}
        className="px-2 py-2 text-base cursor-pointer rounded hover:bg-gray-100/12 flex items-center justify-content-between gap-5"
      >
        <MdAccessTime className="text-white text-lg" /> Last Seen & Online
      </li>
      <li
        onClick={() => {
          setOpenContacts(true);
          setOpen(false);
        }}
        className="px-2 py-2 text-base cursor-pointer rounded hover:bg-gray-100/12 flex items-center justify-content-between gap-5"
      >
        <HiUserGroup className="text-white text-lg" />
        Contacts
      </li>
      <li
        onClick={() => {
          setOpenBlockedContacts(true);
          setOpen(false);
        }}
        className="px-2 py-2 text-base cursor-pointer rounded hover:bg-gray-100/12 flex items-center justify-content-between gap-5"
      >
        <MdBlock className="text-white text-lg" /> Blocked Users
      </li>
      <li
        onClick={logout}
        className="px-2 py-2 text-base cursor-pointer rounded hover:bg-gray-100/12 flex items-center justify-content-between gap-5"
      >
        <FiLogOut className="text-white text-lg" /> Logout
      </li>
    </ul>
  );
};

export default MenuDropdown;
