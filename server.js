const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const path = require("path");
const { MONGOURI } = require("./key");
const { Server } = require("socket.io");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1883");

app.use(cors());
app.use(express.static("public"));
// app.use('/Images', express.static(path.join(__dirname, '/Images')))
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.listen(PORT, () => console.log("Server connected to port", PORT));

require("./models/user");
require("./models/student");
require("./models/video");
require("./models/status");
require("./models/data");
mongoose.model("User");
mongoose.model("Student");
mongoose.model("Video");
const Status = mongoose.model("status_program");
mongoose.model("Data");
app.use(require("./routes/auth"));
app.use(require("./routes/student"));
app.use(require("./routes/video"));
app.use(require("./routes/programstatus"));
app.use(require("./routes/data"));
app.use(require("./routes/exportData"));
app.use(require("./routes/filter"));
app.use(require("./routes/importData"));

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb successfully");
});
mongoose.connection.on("error", (error) => {
  console.log("error connection", error);
});

client.on("connect", () => {
  client.subscribe("program_status_update");
});

client.on("message", (topic, message) => {
  console.log(topic, message.toString());
  if (topic === "program_status_update") {
    const id = "606b1890857f026c4ec6ab9f";
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
