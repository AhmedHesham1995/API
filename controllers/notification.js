const notificationModel = require("../models/notification");

const addNotifications = async (req, res) => {
  const notification = req.body;
  notification.sender = req.id;

  try {
    const newNotification = await notificationModel.create(notification);
    res.status(201).json({
      message: "Nontification sent successfully",
      data: newNotification,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllNotifications = async (req, res) => {
  const notifications = await notificationModel.find().populate("sender");
  if (!notifications) {
    return res.status(400).json({ message: "No notifications found" });
  }
  res.json({ notifications });
};

const deleteNotification = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }

  try {
    const deleteNotification = await notificationModel.findById(id).exec();
    if (!deleteNotification) {
      return res
        .status(400)
        .json({ message: `Can't find a notification with id: ${id}` });
    }
    const result = await deleteNotification.deleteOne();
    if (!result) {
      return res
        .status(400)
        .json({ message: `Can't delete the notification with id: ${id}` });
    }
    res.json({ message: `Notification with id: ${id} deleted with success` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete All notification
//
const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsDeleteMany = await notificationModel.deleteMany({
    user: id,
  });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: "Error Deleting all notifications as read" });
  }
  res.json({ message: `All notifications for user ${id}marked was deleted` });
};

module.exports = {
  addNotifications,
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
};
