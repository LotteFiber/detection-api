const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Status = mongoose.model("status_program");

router.get("/api/programstatus/insert", async (req, res) => {
  const status = new Status({
    status_program_ai: true,
  });
  status
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.get("/api/programstatus/get", async (req, res) => {
  await Status.findOne({ _id: "606b1890857f026c4ec6ab9f" }).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(422).json({ message: "No data in db." });
    }
  });
});

router.get("/api/programstatus/getStatusImage", async (req, res) => {
  await Status.findOne({ _id: "608ea210bd9790f929ce9761" }).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(422).json({ message: "No data in db." });
    }
  });
});

router.put("/api/programstatus/update", async (req, res) => {
  console.log(req.body);
  const id = "606b1890857f026c4ec6ab9f";
  const status = { status_program_ai: false };

  Status.findByIdAndUpdate(id, status)
    .then((result) => {
      console.log(result);
      res.json({ message: "อัพเดทข้อมูลเรียบร้อย", result });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

router.put("/api/programstatus/updateStatusImage", async (req, res) => {
  console.log(req.body);
  const id = "608ea210bd9790f929ce9761";
  const status = { status_program_ai: false };

  Status.findByIdAndUpdate(id, status)
    .then((result) => {
      console.log(result);
      res.json({ message: "อัพเดทข้อมูลเรียบร้อย", result });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

module.exports = router;
