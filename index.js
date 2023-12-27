const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages");
const notificationsRoutes = require("./routes/notification");
const ConversationRoutes = require("./routes/Conversation");


app.use(
  cors({
    origin: "*",
  })
);

//middleware
app.use(express.json());

app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messagesRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/conversation", ConversationRoutes);


//not found middleware
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "not found" });
});

//error handling middleware
app.use(function (err, req, res, next) {
  res.status(500).json({ message: "something went wrong" });
});

mongoose
  // .connect("mongodb://127.0.0.1:27017/twitterX-H")
  .connect('mongodb+srv://ahmedheshamTeam2:twitterClonePass@cluster0.dnj7z6t.mongodb.net/')

  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

  const port =  4005;
  app.listen(port, () => console.log(`Listening on port ${port}...`));
  