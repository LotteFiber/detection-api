const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = mongoose.model("Student");

// GET STUDENT
router.get("/api/getdatastudent", async (req, res) => {
  await Student.find().then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(422).json({ message: "ไม่มีข้อมูล" });
    }
  });
});

// ADD STUDENT
router.post("/api/insertstudent/", (req, res) => {
  const {
    first_name,
    last_name,
    faculty,
    student_id,
    licensepartone,
    licenseparttwo,
    licensepartthree,
  } = req.body;
  if (
    !first_name ||
    !last_name ||
    !faculty ||
    !student_id ||
    !licensepartone ||
    !licenseparttwo ||
    !licensepartthree
  ) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({ student_id: student_id })
    .then((result) => {
      console.log(result);
      if (result) {
        return res.status(422).json({ error: "บุคคลนี้มีข้อมูลอยู่แล้ว" });
      } else {
        const student = new Student({
          first_name,
          last_name,
          faculty,
          student_id,
          licensepartone,
          licenseparttwo,
          licensepartthree,
        });
        student
          .save()
          .then((result) => {
            res.json(result);
          })
          .catch((error) => {
            res.status(422).json(error);
          });
      }
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

// UPDATE STUDENT
router.put("/api/updatestudent", async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    faculty,
    student_id,
    licensepartone,
    licenseparttwo,
    licensepartthree,
  } = req.body;
  if (
    !id ||
    !first_name ||
    !last_name ||
    !faculty ||
    !student_id ||
    !licensepartone ||
    !licenseparttwo ||
    !licensepartthree
  ) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  const student = {
    first_name,
    last_name,
    faculty,
    student_id,
    licensepartone,
    licenseparttwo,
    licensepartthree,
  };
  Student.findByIdAndUpdate(id, student)
    .then((result) => {
      console.log(result);
      res.json({ message: "อัพเดทข้อมูลเรียบร้อย", result });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "อัพเดทหรือหาผิดพลาด", error });
    });
});

// DELETE STUDENT
router.delete("/api/deletestudent/", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "ไม่มีข้อมูล id ส่งกลับมา" });
  }
  await Student.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(422).json({ error: "ลบผิดพลาด หรือ ไม่มีข้อมูลให้ลบ" });
    });
});

module.exports = router;
