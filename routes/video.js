const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Video = mongoose.model("Video");
const path = require("path");
const requiredLogin = require("../middleware/requiredLogin");
const Status = mongoose.model("status_program");
var multer = require("multer");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1883");

var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log("test1 => ", file);
    console.log(Date.now());
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var fileFilter = (req, file, cb) => {
  console.log("test => ", file);
  if (file.mimetype == "video/mp4") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

var storageImage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Images/");
    // callback(null, "./Images/");
  },
  filename: function (req, file, callback) {
    const name = "plate_" + Date.now() + path.extname(file.originalname);
    callback(null, name);
  },
});

var fileFilterImage = (req, file, cb) => {
  console.log("test => ", file);
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/JPG" ||
    file.mimetype == "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var uploadImage = multer({
  storage: storageImage,
  fileFilter: fileFilterImage,
});

router.post(
  "/api/upload-file-image",
  uploadImage.array("uploadedImages", 10),
  function (req, res, next) {
    //console.log(req)
    console.log("file plate image => ", req.files);
    const { filename } = req.files[0];
    if (req.files) {
      res.status(200).json({
        message: "Success to upload.",
        uuid: filename.split(".")[0],
      });
    } else {
      res.status(400).json({ message: "Upload image only." });
    }
  }
);

// upload - file - idcard - image;
var storageCardImage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Images/");
  },
  filename: function (req, file, callback) {
    callback(null, "card_" + Date.now() + path.extname(file.originalname));
  },
});

var fileFilterImage = (req, file, cb) => {
  console.log("test => ", file);
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/JPG" ||
    file.mimetype == "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var uploadCardImage = multer({
  storage: storageCardImage,
  fileFilter: fileFilterImage,
});

router.post(
  "/api/upload-file-card-image",
  uploadCardImage.array("uploadedImageCard", 10),
  function (req, res, next) {
    console.log("file card image", req.file);
    const { filename } = req.files[0];
    if (req.files) {
      res.status(200).json({
        message: "Success to upload.",
        uuid: filename.split(".")[0],
      });
    } else {
      res.status(400).json({ message: "Upload image only." });
    }
  }
);

var storageImagePlate = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Images/");
  },
  filename: function (req, file, callback) {
    callback(null, "img_" + Date.now() + path.extname(file.originalname));
  },
});

var uploadImagePlate = multer({
  storage: storageImagePlate,
  fileFilter: fileFilterImage,
});

router.post(
  "/api/upload-image-plate",
  uploadImagePlate.array("uploadedImages", 10),
  function (req, res, next) {
    // console.log(req)
    console.log("file11 => ", req.files);
    const { filename } = req.files[0];
    if (req.files) {
      res.status(200).json({
        message: "Success to upload.",
        uuid: filename,
      });
    } else {
      res.status(400).json({ message: "Upload image only." });
    }
  }
);

var storageImageCard = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Images/");
  },
  filename: function (req, file, callback) {
    callback(null, "card_" + Date.now() + path.extname(file.originalname));
  },
});

var uploadImageCard = multer({
  storage: storageImageCard,
  fileFilter: fileFilterImage,
});

router.post(
  "/api/upload-image-card",
  uploadImageCard.array("uploadedImageCard", 10),
  function (req, res, next) {
    // console.log(req)
    console.log("file12 => ", req.files);
    const { filename } = req.files[0];
    if (req.files) {
      res.status(200).json({
        message: "Success to upload.",
        uuid: filename.split(".")[0],
      });
    } else {
      res.status(400).json({ message: "Upload image only." });
    }
  }
);

var storageImageEvent = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Images/");
  },
  filename: function (req, file, callback) {
    callback(null, "event_" + Date.now() + path.extname(file.originalname));
  },
});

var uploadImageEvent = multer({
  storage: storageImageEvent,
  fileFilter: fileFilterImage,
});

router.post(
  "/api/upload-image-event",
  uploadImageEvent.array("uploadedImageEvent", 10),
  function (req, res, next) {
    // console.log(req)
    console.log("file13 => ", req.files);
    // const { filename } = req.files[0];
    if (req.files) {
      res.status(200).json({
        message: "Success to upload.",
        // uuid: filename.split(".")[0],
      });
    } else {
      res.status(400).json({ message: "Upload image only." });
    }
  }
);

router.post(
  "/api/upload-file",
  requiredLogin,
  upload.single("file"),
  function (req, res, next) {
    console.log("Next !");
    if (req.file) {
      console.log(req.user);
      const video = new Video({
        video_name: req.file.originalname,
        video_status: "F",
        video_timestamp: Date.now(),
        video_file: req.file.filename,
        video_path: req.file.path,
        video_size: req.file.size,
        video_uploadby: req.user.user_name,
      });
      video
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Success to upload.",
            data: req.file,
            result: result,
          });
        })
        .catch((error) => {
          res.status(422).json({ error: "Error upload to DB.", data: error });
        });
    } else {
      res.status(400).json({ message: "Upload video only." });
    }
  }
);

router.get("/api/video/getAll", async (req, res) => {
  await Video.find().then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(422).json({ message: "No data in db." });
    }
  });
});

router.delete("/api/video/delete", requiredLogin, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "Need id for delete." });
  }
  await Video.findByIdAndDelete(id)
    .then((result) => {
      res.json({ result: result, message: "delete success." });
    })
    .catch((error) => {
      res.status(422).json({ error: "delete error", data: error });
    });
});

router.get("/api/video/:getvideo", (req, res) => {
  var filename = req.params.getvideo;
  res.sendFile(path.resolve(`./uploads/${filename}`));
});

router.post("/api/video/startProgram", async (req, res) => {
  console.log("RES => ", req.body.video_file);
  if (!req.body.video_file || !req.body._id) {
    return res.status(422).json({ message: "require video_file" });
  }
  const id = { _id: "606b1890857f026c4ec6ab9f" };
  const status = { status_program_ai: true };
  Status.findOneAndUpdate(id, status)
    .then((result) => {
      console.log(result);
      const data = { video_file: req.body.video_file, id: req.body._id };
      client.publish("start_Program_Detection", JSON.stringify(data));
      id_video = { _id: req.body._id };
      const data_video = { video_status: "W" };
      Video.findOneAndUpdate(id_video, data_video)
        .then((result) => {
          res.json({ message: "OK starting process detection (true)." });
        })
        .catch((error) => {
          res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

router.post("/api/video/startProgramImage", async (req, res) => {
  const id = { _id: "608ea210bd9790f929ce9761" };
  const status = { status_program_ai: true };
  //const uuid = Date.now() + Math.floor(Math.random()*10);
  const { uuid } = req.body;
  Status.findOneAndUpdate(id, status)
    .then((result) => {
      console.log("startProgram => ", result);
      console.log("idjson => ", uuid);
      const data = {
        message: "start program",
        uuid: uuid,
      };
      client.publish("start_Program_Detection_Image", JSON.stringify(data));
      res.json({ message: "OK starting process detection (true)." });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

router.post("/api/video/startProgramCardImage", async (req, res) => {
  const id = { _id: "62953eb1139d43e03c44c17e" };
  const status = { status_program_ai: true };
  //const uuid = Date.now() + Math.floor(Math.random()*10);
  const { uuid } = req.body;
  Status.findOneAndUpdate(id, status)
    .then((result) => {
      console.log("startProgram => ", result);
      console.log("idjsonCard => ", uuid);
      const data = {
        message: "start program card",
        uuid: uuid,
      };
      client.publish(
        "start_Program_Card_Detection_Image",
        JSON.stringify(data)
      );
      res.json({ message: "OK starting process detection (true)." });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

router.put("/api/video/updateStatusVideo", async (req, res) => {
  if (!req.body._id) {
    return res.status(422).json({ message: "error" });
  }
  const id = { _id: "606b1890857f026c4ec6ab9f" };
  const status = { status_program_ai: false };
  Status.findOneAndUpdate(id, status)
    .then((result) => {
      console.log(result);
      const id_video = { _id: req.body._id };
      const data = { video_status: "T" };
      Video.findOneAndUpdate(id_video, data)
        .then((result) => {
          res.json({ message: "OK starting process detection (true)." });
        })
        .catch((error) => {
          res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

router.put("/api/video/updateStatusImage", async (req, res) => {
  const id = { _id: "608ea210bd9790f929ce9761" };
  const status = { status_program_ai: false };
  Status.findOneAndUpdate(id, status)
    .then((result) => {
      console.log(result);
      res.json({ message: "OK starting process detection (true)." });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

module.exports = router;
