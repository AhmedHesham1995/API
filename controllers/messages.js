const MessageModel = require("../models/messages"); // Import the message model

//create a new message
const createMessage=async(req,res)=>{
  var message=req.body
  message.senderId = req.id;
  try{
      const newMessage=await MessageModel.create(message)
      res.status(201).json({message:"added successfully",data:newMessage})
  }
  catch(err){
      res.status(400).json({message:err.message})
  }

}

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({
      conversationId: req.params.conversationId,
    })
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get message by message ID
const getMessageById = async (req, res) => {
  const messageId = req.params.id;

  try {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update message by ID
const updateMessageById = async (req, res) => {
  const messageId = req.params.id;
  const { content } = req.body;

  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete message by ID
const deleteMessageById = async (req, res) => {
  const messageId = req.params.id;

  try {
    const deletedMessage = await MessageModel.findByIdAndRemove(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully', data: deletedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller function to get messages for a specific conversation
const getMessagesByConversationId = async (req, res) => {
  try {
    const message = await MessageModel.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(message)
  } catch (err) {
    res.status(500).json(err)
  }
}


module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
  getMessagesByConversationId
};
