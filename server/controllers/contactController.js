import Messages from "../models/Message.js";
import Users from "../models/Users.js";
import mongoose from "mongoose";
import { io, userSocketMap } from "../socket.js";

// Fetch authenticated user's contacts, blocked users, and message-related data
export const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's contacts and blocked users
    const owner = await Users.findById(userId)
      .populate("contacts", "fullName email profilePicture blockedUsers")
      .populate("blockedUsers", "fullName email profilePicture");

    // Get all other users (excluding self)
    const allUsers = await Users.find({ _id: { $ne: userId } }).select(
      "fullName email profilePicture blockedUsers",
    );

    // Find users the authenticated user has sent messages to
    const sentToIds = await Messages.find({
      senderId: userId,
      deletedFor: { $ne: userId },
    }).distinct("receiverId");

    // Find users who have sent messages to authenticated user
    const receivedFromIds = await Messages.find({
      receiverId: userId,
      deletedFor: { $ne: userId },
    }).distinct("senderId");

    // Combine and remove duplicates, excluding self
    const messageUserIds = [
      ...new Set([...sentToIds, ...receivedFromIds]),
    ].filter((id) => id.toString() !== userId.toString());

    // Fetch user details for message-related users
    const messageUsers = await Users.find({
      _id: { $in: messageUserIds },
    }).select("fullName email profilePicture blockedUsers");

    // Count unseen messages per user
    const unseenMessages = {};
    const promises = messageUsers.map(async (user) => {
      const messages = await Messages.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({
      success: true,
      users: owner.contacts,
      blockedUsers: owner.blockedUsers,
      unseenMessages,
      owner,
      allUsers,
      messageUsers,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a contact to authenticated user's contact list
export const addContact = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $addToSet: { contacts: contactId } },
      { new: true },
    ).populate("contacts", "fullName email profilePicture");

    res.json({
      success: true,
      users: updatedContacts.contacts,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove a contact from authenticated user's contact list
export const deleteContact = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contactId } },
      { new: true },
    ).populate("contacts", "fullName email profilePicture");

    res.json({
      success: true,
      users: updatedContacts.contacts,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Block a contact: add to blockedUsers list
export const blockContact = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $addToSet: { blockedUsers: contactId } },
      { new: true },
    ).populate("blockedUsers", "fullName email profilePicture");

    // find receiver socket
    const receiverSocketId = userSocketMap[contactId];

    // Notify the blocked user in real-time if online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("blockedByUser", userId);
    }

    res.json({
      success: true,
      blockedUsers: updatedContacts.blockedUsers,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Unblock a contact: remove from blockedUsers list
export const unblockContact = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $pull: { blockedUsers: contactId } },
      { new: true },
    ).populate("blockedUsers", "fullName email profilePicture");

    // Notify the unblocked user in real-time if online
    const receiverSocketId = userSocketMap[contactId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("unblockedByUser", userId);
    }

    res.json({
      success: true,
      blockedUsers: updatedContacts.blockedUsers,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
