const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Data = mongoose.model("Data");
const requiredLogin = require("../middleware/requiredLogin");
const moment = require("moment");

// FILTER DATA BY DATE
router.post("/api/getDatafilter", requiredLogin, async (req, res) => {
  const start_date = moment(req.body.start_date).startOf("day");
  const end_date = moment(req.body.end_date).endOf("day");
  console.log("Date start => ", start_date, " Date End => ", end_date);
  Data.find({
    //query today up to tonight
    date_data: {
      $gte: start_date,
      $lt: end_date,
    },
  })
    .sort({ date_data: -1 })
    .exec(function (_err, result) {
      if (result) {
        res.json(result);
      } else {
        res.status(422).json({ message: "ไม่มีข้อมูล" });
      }
    });
});

module.exports = router;
