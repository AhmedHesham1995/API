const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
          },
  receiver: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  text: {
    type: String,
    require: true,
           },
  type: {
    type: String,
    require: true,
         },

  
},{
    timestamps: true 
});

const notificationModel=mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
