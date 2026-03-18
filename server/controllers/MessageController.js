import cloudinary from "../config/cloudinary.js";
import Messages from "../models/Message.js";
import Users from "../models/Users.js";
import { io, userSocketMap } from "../socket.js";
import mongoose from "mongoose";

// Get all messages between authenticated user and selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Mark messages from selected user as seen
    await Messages.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    // Retrieve messages excluding those deleted for this user
    const messages = await Messages.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
      deletedFor: { $ne: myId },
    });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete all messages between two users for both users
export const deleteMsgsForBoth = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user._id;

    // Remove all messages between the two users
    await Messages.deleteMany({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });

    // Fetch remaining messages (should be empty)
    const messages = await Messages.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });

    // Notify receiver if online
    const receiverSocketId = userSocketMap[contactId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messagesDeleted", userId);
    }

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete messages only for authenticated user
export const deleteMsgsForSelf = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user._id;

    // Add user to deletedFor array to hide messages
    await Messages.updateMany(
      {
        $or: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
        deletedFor: { $ne: userId },
      },
      { $addToSet: { deletedFor: userId } },
    );

    // Fetch messages not deleted for this user
    const messages = await Messages.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
      deletedFor: { $ne: userId },
    });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete entire chat and remove contact for both users
export const deleteChatForBoth = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    // Delete all messages between users
    await Messages.deleteMany({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });

    const messages = await Messages.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });

    // Remove contact from authenticated user's contact list
    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contactId } },
      { new: true },
    ).populate("contacts", "fullName email profilePicture");

    // Check if contact existed before deletion
    const wasContact = await Users.exists({
      _id: userId,
      contacts: contactId,
    });

    // Notify receiver if online
    const receiverSocketId = userSocketMap[contactId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chatDeleted", {
        userId,
        isContact: Boolean(wasContact),
      });
    }

    res.json({ success: true, messages, users: updatedContacts.contacts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete chat only for authenticated user
export const deleteChatForSelf = async (req, res) => {
  try {
    const contactId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    // Hide all messages by adding to deletedFor
    await Messages.updateMany(
      {
        $or: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
        deletedFor: { $ne: userId },
      },
      { $addToSet: { deletedFor: userId } },
    );

    const messages = await Messages.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
      deletedFor: { $ne: userId },
    });

    // Remove contact from authenticated user's list
    const updatedContacts = await Users.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contactId } },
      { new: true },
    ).populate("contacts", "fullName email profilePicture");

    res.json({ success: true, messages, users: updatedContacts.contacts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Mark a single message as seen
export const markMsgAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Messages.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send message to selected user
export const sendMsg = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // Check if sender is blocked by receiver
    const receiver = await Users.findById(receiverId);
    if (receiver.blockedUsers.includes(senderId)) {
      return res.json({
        success: false,
        message: "You are blocked by this user. Message not sent.",
      });
    }

    // Upload image if provided
    let imageUrl;
    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image);
      imageUrl = uploadImg.secure_url;
    }

    // Save message to database
    const newMessage = await Messages.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // emit new msg to receiver socket if online
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
