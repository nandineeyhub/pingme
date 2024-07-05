const asyncHandler = require("express-async-handler");
const chat = require("../Model/chatSchema");
const user = require("../Model/userSchema");
const message = require("../Model/messageSchema");
const chatService = require("../Services/chatServices");

const accessChat = asyncHandler(async (req, res) => {
  const { userId, isGroupChat } = req.body;

  if (!userId) {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  }

  let response;
  if (isGroupChat) {
    response = await chatService.groupChatAccess(req);
  } else response = await chatService.privateChatAcces(req);
   res.status(200).json(response);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.query;

  if (!messageId) {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  }

  const messages = message.find({ _id: messageId });
  if (messages.length == 0) {
    res.status(200).json({
      status: true,
      message: "Message not Found",
    });
  } else {
    const newData = await message.findByIdAndUpdate(
      messageId,
      {
        $push: { deletedBy: req.user },
      },
      {
        new: true,
      }
    );
    if (newData)
      res.status(200).json({
        data: newData,
        status: true,
      });
    else
      res.status(200).json({
        status: true,
        message: "Something went wrong",
      });
  }
});

const forwardMessage = asyncHandler(async (req, res) => {
  const { messageId, recipientIds } = req.body;

  const messageExist = await message.find({ _id: messageId });

  if (messageExist.length > 0) {
    const forwardedMessages = [];
    for (const recipientId of recipientIds) {
      var newMessage = {
        sender: req.user._id,
        content: messageExist[0]?.content,
        chat: recipientId,
        forward: true,
      };

      var forwardedmessage = await message.create(newMessage);
      forwardedmessage = await forwardedmessage.populate(
        "sender",
        "name profilePicture"
      );
      forwardedmessage = await forwardedmessage.populate("chat");
      forwardedmessage = await user.populate(forwardedmessage, {
        path: "chat.Users",
        select: "name profilePicture email",
      });
      forwardedMessages.push(forwardedmessage);
      await chat.findByIdAndUpdate(recipientId, { latestMessage: forwardedmessage });
    }
    if (forwardedMessages.length > 0) {
      res.json({
        status: true,
        data: {
          message: forwardedMessages,
        },
        message: "Message forwarded Successfully",
      });
    }
  } else {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    chat
      .find({ Users: { $elemMatch: { $eq: req.user._id } } })
      .populate("Users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await user.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePicture email",
        });
        res.status(200).json({
          status: true,
          data: results,
        });
      });
  } catch (error) {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await chat.create({
      chatName: req.body.name,
      Users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chat
      .findOne({ _id: groupChat._id })
      .populate("Users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({ data: fullGroupChat, status: true });
  } catch (error) {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chat
    .findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(200).json({
      status: true,
      message: "Something went wrong",
    });
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await chat
    .findByIdAndUpdate(
      chatId,
      {
        $pull: { Users: userId },
      },
      {
        new: true,
      }
    )
    .populate("Users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(200).json({
      status: true,
      message: "Chat not found",
    });
  } else {
    res.json({ data: removed, status: true });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // check if the requester is admin

  const added = await chat
    .findByIdAndUpdate(
      chatId,
      {
        $push: { Users: userId },
      },
      {
        new: true,
      }
    )
    .populate("Users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(200).json({
      status: true,
      message: "Chat not found",
    });
  } else {
    res.json({ data: added, status: true });
  }
});

module.exports = {
  renameGroup,
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  deleteMessage,
  forwardMessage,
};
