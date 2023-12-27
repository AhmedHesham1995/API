const express = require("express");
const router = express.Router();
const {auth} = require('../middlewares/auth') ; 

const {
  addNotifications,
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notification");

router.post("/",auth, addNotifications);
router.get("/",auth, getAllNotifications);
router.delete("/",auth, deleteNotification);
router.delete("/all",auth, deleteAllNotifications);


module.exports = router;
