import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { ContactContext } from "./ContactContext";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const { socket, axios } = useContext(AuthContext);
  const { setUnseenMessages, setContacts, selectedUser, setSelectedUser } =
    useContext(ContactContext);

  // Fetch messages for a selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        // Reset unseen message count for this conversation
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: "",
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Send a new message to the currently selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prevMsgs) => [...prevMsgs, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete messages only for the current user
  const deleteMessagesSelf = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/delete-msg-self/${contactId}`);
      if (data.success) {
        setMessages(data.messages);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete messages for both users
  const deleteMessagesBoth = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/delete-msg-both/${contactId}`);
      if (data.success) {
        setMessages(data.messages);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete entire chat for both users
  const deleteChatForBoth = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/delete-chat-both/${contactId}`);
      if (data.success) {
        setMessages(data.messages);
        setContacts(data.users);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete entire chat only for the current user
  const deleteChatForSelf = async (contactId) => {
    try {
      const { data } = await axios.post(`/api/delete-chat-self/${contactId}`);
      if (data.success) {
        setMessages(data.messages);
        setContacts(data.users);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Subscribe to socket events related to chat updates
  const subscribeToChatEvents = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // If the message belongs to the currently open chat
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMsgs) => [...prevMsgs, newMessage]);
        // Mark message as seen on server
        axios.put(`/api/mark/${newMessage._id}`);
      } else {
        // Increase unseen message count for the message sender
        setUnseenMessages((prevUnseenMsgs) => ({
          ...prevUnseenMsgs,
          [newMessage.senderId]: prevUnseenMsgs[newMessage.senderId]
            ? prevUnseenMsgs[newMessage.senderId] + 1
            : 1,
        }));
      }
    });

    // When messages are deleted
    socket.on("messagesDeleted", (userId) => {
      if (selectedUser?._id === userId) {
        setMessages([]);
      }
    });

    // When entire chat is deleted
    socket.on("chatDeleted", ({ userId, isContact }) => {
      if (selectedUser?._id === userId) {
        setMessages([]);
      }

      // If the contact removed the chat entirely
      if (!isContact && selectedUser?._id === userId) {
        setSelectedUser(null);
      }
    });
  };

  // Remove socket listeners to prevent duplicate event handlers
  const unsubscribeFromChatEvents = () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("messagesDeleted");
      socket.off("chatDeleted");
    }
  };

  // Load messages whenever the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Manage socket event subscriptions
  useEffect(() => {
    subscribeToChatEvents();
    return () => unsubscribeFromChatEvents();
  }, [socket, selectedUser]);

  const value = {
    messages,
    setMessages,
    sendMessage,
    getMessages,
    deleteMessagesBoth,
    deleteMessagesSelf,
    deleteChatForBoth,
    deleteChatForSelf,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
