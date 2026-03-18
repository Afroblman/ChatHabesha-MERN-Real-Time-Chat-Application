import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allRelevantUsers, setAllRelevantUsers] = useState([]);
  const [owner, setOwner] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  const { socket, axios } = useContext(AuthContext);

  // Fetch contacts and related user data
  const getContacts = async () => {
    try {
      const { data } = await axios.get("/api/contacts");
      if (data.success) {
        setContacts(data.users);
        setAllUsers(data.allUsers);
        setOwner(data.owner);
        setBlockedUsers(data.blockedUsers);
        setUnseenMessages(data.unseenMessages);
        setAllRelevantUsers(data.messageUsers);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Add a new contact
  const addContact = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/add-contact/${contactId}`);
      if (data.success) {
        setContacts(data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Remove a contact
  const deleteContact = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/delete-contact/${contactId}`);
      if (data.success) {
        setContacts(data.users);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Block a contact
  const blockContact = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/block-contact/${contactId}`);

      if (data.success) {
        setBlockedUsers(data.blockedUsers);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Unblock a contact
  const unblockContact = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/unblock-contact/${contactId}`);

      if (data.success) {
        setBlockedUsers(data.blockedUsers);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Mark contact as online when server emits event
    const handleUserOnline = (userId) => {
      setContacts((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline: true } : u)),
      );
      // Update selectedUser if they are the one currently open
      setSelectedUser((prev) =>
        prev?._id === userId ? { ...prev, isOnline: true } : prev,
      );
    };

    // Mark contact as offline and update lastSeen
    const handleUserOffline = ({ userId, lastSeen }) => {
      setContacts((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: false, lastSeen } : u,
        ),
      );
      // Update selectedUser
      setSelectedUser((prev) =>
        prev?._id === userId ? { ...prev, isOnline: false, lastSeen } : prev,
      );
    };

    // Update state when another user blocks the owner
    const handleBlockedByUser = (userId) => {
      setContacts((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, blockedUsers: [...(u.blockedUsers || []), owner._id] }
            : u,
        ),
      );
      // Update selectedUser
      setSelectedUser((prev) => {
        if (prev?._id === userId) {
          return {
            ...prev,
            blockedUsers: [...(prev.blockedUsers || []), owner._id],
          };
        }
        return prev;
      });
    };

    // Update state when another user unblocks the owner
    const handleUnblockedByUser = (userId) => {
      setContacts((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                blockedUsers: (u.blockedUsers || []).filter(
                  (id) => id !== owner._id,
                ),
              }
            : u,
        ),
      );
      // Update selectedUser
      setSelectedUser((prev) => {
        if (prev?._id === userId) {
          return {
            ...prev,
            blockedUsers: (prev.blockedUsers || []).filter(
              (id) => id !== owner._id,
            ),
          };
        }
        return prev;
      });
    };

    // Subscribe to socket events
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("blockedByUser", handleBlockedByUser);
    socket.on("unblockedByUser", handleUnblockedByUser);

    // Cleanup listeners to avoid duplicate handlers
    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("blockedByUser", handleBlockedByUser);
      socket.off("unblockedByUser", handleUnblockedByUser);
    };
  }, [socket, owner._id]);

  // Load contacts when the provider mounts
  useEffect(() => {
    getContacts();
  }, []);

  const value = {
    contacts,
    setContacts,
    selectedUser,
    setSelectedUser,
    allUsers,
    setAllUsers,
    owner,
    setOwner,
    blockedUsers,
    setBlockedUsers,
    unseenMessages,
    setUnseenMessages,
    getContacts,
    addContact,
    deleteContact,
    blockContact,
    unblockContact,
    allRelevantUsers,
  };
  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
};
