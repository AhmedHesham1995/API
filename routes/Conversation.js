const express = require ('express')
const router = express.Router()
const {createConversation, getConversationsByUserId, findConversationByUserIds} = require("../controllers/Conversation");
const { auth } = require('../middlewares/auth');

//route to create new conversation
router.post('/', auth, createConversation)
router.get('/:userId', auth, getConversationsByUserId)
router.get('/find/:firstUserId/:secondUserId', auth, findConversationByUserIds)

module.exports = router