const conversationModel = require("../models/conversation.model.js");
const messageModel = require("../models/message.model.js");

module.exports.sendMessage = async function (req, res) {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id; //We get this from the protectRout middleware

    let conversation = await conversationModel.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = await messageModel.create({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    //Socket.io functionality comes here

    await conversation.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log("Error in send message controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getMessages = async function (req, res) {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    const conversation = await conversationModel
      .findOne({
        participants: { $all: [senderId, userToChatId] },
      })
      .populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.log("Error in get messages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
