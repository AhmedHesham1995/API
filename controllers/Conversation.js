
const ConversationModel = require('../models/Conversation') // Import the message model

//create a new Conversation
const createConversation = async(req,res) => {
    const newConversation = new ConversationModel({
        members: [req.body.senderId, req.body.receiverId],
    })

    try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation)
    }
    catch (error) {
        res.status(400).json({message: 'Error creating the conversation', error: error.message})
    }
}

//function to get conversations for a user
const getConversationsByUserId = async(req,res) => {

    try{
        const conversations = await ConversationModel.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(conversations)
    } 
    catch (error) {
        res.status(400).json({message:'Error getting conversations', error: error.message})
    }
}

//  function to find a conversation by two user IDs
const findConversationByUserIds = async(req,res) => {

    try {
        const conversation = await ConversationModel.findOne({
            members: {$all: [req.params.firstUserId, req.params.secondUserId]}
        })
        res.status(200).json(conversation)
    } 
    catch (error) {
        res.status(400).json({message:'Error finding conversation by user IDs', error: error.message})
    }
}

module.exports = {
    createConversation,
getConversationsByUserId,
findConversationByUserIds
}
// const ConversationModel = require('../models/Conversation');

// // Create a new Conversation
// const createConversation = async (req, res) => {
//     const newConversation = new ConversationModel({
//         members: [req.body.senderId, req.body.receiverId],
//     });

//     try {
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation);
//     } catch (err) {
//         res.status(400).json({ message: ' في كريتت الكونف عصام كنافه بيحي وبيقول انه في حاجه غلط اتاكد يبوالصحاب', error: err.message });
//     }
// };

// // Function to get conversations for a user
// const getConversationsByUserId = async (req, res) => {
//     try {
//         const conversations = await ConversationModel.find({
//             members: { $in: [req.params.userId] },
//         });
//         res.status(200).json(conversations);
//     } catch (err) {
//         res.status(400).json({ message: ' ف الجيت بواحد عصام كنافه بيحي وبيقول انه في حاجه غلط اتاكد يبوالصحاب ', error: err.message });
//     }
// };

// // Function to find a conversation by two user IDs
// const findConversationByUserIds = async (req, res) => {
//     try {
//         const conversation = await ConversationModel.findOne({
//             members: { $all: [req.params.firstUserId, req.params.secondUserId] },
//         });
//         res.status(200).json(conversation);
//     } catch (err) {
//         res.status(400).json({ message: ' ف الجيت بالتنين عصام كنافه بيحي وبيقول انه في حاجه غلط اتاكد يبوالصحاب ', error: err.message });
//     }
// };

// module.exports = {
//     createConversation,
//     getConversationsByUserId,
//     findConversationByUserIds
// };