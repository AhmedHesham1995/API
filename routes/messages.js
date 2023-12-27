
const express = require('express');
var router = express.Router() ; 
var {createMessage, getAllMessages,getMessageById,updateMessageById,deleteMessageById} = require("../controllers/messages") ; 

const {auth} = require('../middlewares/auth') ; 



router.post('/' ,auth, createMessage)

router.get('/:conversationId' ,auth, getAllMessages)

router.get ('/:id' ,auth,getMessageById)

router.patch ('/:id',auth ,updateMessageById )

router.delete('/:id',auth ,deleteMessageById)


module.exports=router ; 