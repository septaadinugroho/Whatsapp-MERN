//import
import express from "express";
import Message from "./dbMessages.js";
import "dotenv/config";
import mongoose, { mongo } from "mongoose";
import Pusher from "pusher";
import cors from "cors";

//app config
const app = express();
const PORT = process.env.PORT || 9000;

const pusherConfig = JSON.parse(process.env.PUSHER_CONFIG);
const pusher = new Pusher(pusherConfig);

//middleware
//jika tidak ada middleware json ini, maka output yang muncul hanyalah id dan version, data tidak akan muncul
app.use(express.json());
app.use(cors());

//dbconfig
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const db = mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");

  //memunculkan informasi perubahan pada console
  const msgCollection = db.collection("messagecontents"); //harus sama dengan yang ada di schema dan juga mongoDB
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      //trigger pusher function
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});

//api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

app.get("/messages/sync", async (req, res) => {
  try {
    const data = await Message.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/messages/new", async (req, res) => {
  const dbMessage = req.body;

  try {
    const data = await Message.create(dbMessage);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

//listener
//DB Config
// import { mongoConnect } from "./services/mongo.js";
// async function startServer() {
//   await mongoConnect();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
//}

//startServer();
