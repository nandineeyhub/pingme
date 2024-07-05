const asyncHandler = require("express-async-handler");
const chat = require("../Model/chatSchema");
const user = require("../Model/userSchema");
const message = require("../Model/messageSchema");

const chatService = {};

chatService.privateChatAcces = asyncHandler(async (req) => {
  const { userId } = req.body;

  var isChat = await chat
    .find({
      isGroupChat: false,
      $and: [
        { Users: { $elemMatch: { $eq: userId } } },
        { Users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
    .select("-latestMessage")
    .populate("Users", "-password");

  if (isChat.length > 0) {
    const messageList = await message
      .find({
        chat: isChat[0]?._id,
        deletedBy:  { $nin: req.user._id } ,
      })
      .select(" -__v -updatedAt -chat")
      .populate("sender", "-password  -email -__v -updatedAt");
    return {
      status: true,
      data: {
        messages: messageList,
        chatDetails: isChat[0],
      },
    };
  } else {
    var chatData = {
      chatName: "private",
      isGroupChat: false,
      Users: [req.user._id, userId],
    };

    const createdChat = await chat.create(chatData);
    const FullChat = await chat
      .findOne({ _id: createdChat._id })
      .populate("Users", "-password");
    return {
      status: true,
      data: FullChat,
    };
  }
});

chatService.groupChatAccess = async (req) => {
  const { userId } = req.body;

  const chatDetails = await chat
    .find({
      _id: userId,
    })
    .select("-latestMessage")
    .populate("Users", "-password");

  if (chatDetails?.length > 0) {
    const messageList = await message
      .find({
        chat: chatDetails[0]._id,
        deletedBy:  { $nin: req.user._id } ,
      })
      .select("-__v -updatedAt -chat")
      .populate("sender", "-password  -email -__v -updatedAt");

    return {
      status: true,
      data: { messages: messageList, chatDetails: chatDetails[0] },
    };
  }
};

module.exports = chatService;
