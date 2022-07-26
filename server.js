require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1883");
require("./models/user");
require("./models/student");
require("./models/video");
require("./models/status");
require("./models/data");
mongoose.model("User");
mongoose.model("Student");
mongoose.model("Video");
mongoose.model("Data");
const Status = mongoose.model("status_program");
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.set("useFindAndModify", false);

// HANDLE MIDDLEWARE
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.listen(PORT, () => console.log("Server running on port", PORT));

// HANDLE ROUTES
app.use(require("./routes/auth"));
app.use(require("./routes/student"));
app.use(require("./routes/video"));
app.use(require("./routes/programstatus"));
app.use(require("./routes/data"));
app.use(require("./routes/exportData"));
app.use(require("./routes/filter"));
app.use(require("./routes/importData"));

// HANDLE CONNECT MONGO DATABASE
const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (error) => {
  console.log("error connection", error);
});

// HANDLE MQTT PROTOCOL
client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  // client.subscribe("program_status_update");
});

client.on("message", (topic, message) => {
  console.log(topic, message.toString());
  if (topic === "program_status_update") {
    const id = "608ea210bd9790f929ce9761";
    const status = { status_program_ai: false };
    Status.findByIdAndUpdate(id, status)
      .then((result) => {
        console.log(result);
        console.log("OK starting process detection (false).");
      })
      .catch((error) => {
        console.log(error);
        console.log("อัพเดทหรือหาผิดพลาด");
      });
  }
});
