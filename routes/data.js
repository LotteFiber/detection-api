const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Data = mongoose.model("Data");
const Student = mongoose.model("Student");
const requiredLogin = require("../middleware/requiredLogin");
const path = require("path");
const moment = require("moment");
var multer = require("multer");

router.get("/api/data/getalldata", async (req, res) => {
  Data.find()
    .sort({ date_data: -1 })
    .exec(function (err, result) {
      if (result) {
        res.json(result);
      } else {
        res.status(422).json({ message: "ไม่มีข้อมูล" });
      }
    });
});

router.delete("/api/deletedata/", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "ไม่มีข้อมูล id ส่งกลับมา" });
  }
  await Data.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(422).json({ error: "ลบผิดพลาด หรือ ไม่มีข้อมูลให้ลบ" });
    });
});

router.get("/api/data/getAmountPerson", async (req, res) => {
  await Data.find().then((result) => {
    // month
    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;
    var six = 0;
    var seven = 0;
    var eight = 0;
    var nine = 0;
    var ten = 0;
    var eleven = 0;
    var twelve = 0;

    // Year of student
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var e = 0;
    var f = 0;

    // Faculty
    var anre = 0;
    var sci = 0;
    var en = 0;
    var arch = 0;
    var dent = 0;
    var med = 0;
    var nurs = 0;
    var phar = 0;
    var medsci = 0;
    var allie = 0;
    var publ = 0;
    var human = 0;
    var law = 0;
    var bec = 0;
    var edu = 0;
    var social = 0;
    var inter = 0;

    if (result) {
      for (i = 0; i < result.length; i++) {
        // check month
        const number = parseInt(moment(result[i].date_data).format("MM"));
        if (1 === number) one += 1;
        if (2 === number) two += 1;
        if (3 === number) three += 1;
        if (4 === number) four += 1;
        if (5 === number) five += 1;
        if (6 === number) six += 1;
        if (7 === number) seven += 1;
        if (8 === number) eight += 1;
        if (9 === number) nine += 1;
        if (10 === number) ten += 1;
        if (11 === number) eleven += 1;
        if (12 === number) twelve += 1;

        // check per student id
        const check1 = result[i].student_id;
        const check = check1.slice(0, 2);
        if ("58" === check) a += 1;
        if ("59" === check) b += 1;
        if ("60" === check) c += 1;
        if ("61" === check) d += 1;
        if ("62" === check) e += 1;
        if ("63" === check) f += 1;

        // check faculty
        const check_faculty = result[i].faculty;
        if ("เกษตรศาสตร์" === check_faculty) anre += 1;
        if ("วิทยาศาสตร์" === check_faculty) sci += 1;
        if ("วิศวกรรมศาสตร์" === check_faculty) en += 1;
        if ("สถาปัตยกรรมศาสตร์" === check_faculty) arch += 1;
        if ("ทันตแพทยศาสตร์" === check_faculty) dent += 1;
        if ("แพทยศาสตร์" === check_faculty) med += 1;
        if ("พยาบาลศาสตร์" === check_faculty) nurs += 1;
        if ("เภสัชศาสตร์" === check_faculty) phar += 1;
        if ("วิทยาศาสตร์การแพทย์" === check_faculty) medsci += 1;
        if ("สหเวชศาสตร์" === check_faculty) allie += 1;
        if ("สาธารณสุขศาสตร์" === check_faculty) publ += 1;
        if ("มนุษยศาสตร์" === check_faculty) human += 1;
        if ("นิติศาสตร์" === check_faculty) law += 1;
        if ("บริหารธุรกิจ" === check_faculty) bec += 1;
        if ("ศึกษาศาสตร์" === check_faculty) edu += 1;
        if ("สังคมศาสตร์" === check_faculty) social += 1;
        if ("วิทยาลัยนานาชาติ" === check_faculty) inter += 1;
      }
      res.json({
        AmountPerMonthPerson: {
          one: one,
          two: two,
          three: three,
          four: four,
          five: five,
          six: six,
          seven: seven,
          eight: eight,
          nine: nine,
          ten: ten,
          eleven: eleven,
          twelve: twelve,
        },
        amount_person: result.length,
        student_id: { a: a, b: b, c: c, d: d, e: e, f: f },
        Faculty: {
          anre,
          sci,
          en,
          arch,
          dent,
          med,
          nurs,
          phar,
          medsci,
          allie,
          publ,
          human,
          law,
          bec,
          edu,
          social,
          inter,
        },
      });
    } else {
      res.status(422).json({ message: "ไม่มีข้อมูล" });
    }
  });
});

router.get("/api/data/:getdata", (req, res) => {
  var filename = req.params.getdata;
  var str = filename.replace(/-/g, "/");
  res.sendFile(path.resolve(`../HelmetDetection_V2/${str}`));
});

router.get("/api/data/image/:getdata", (req, res) => {
  var filename = req.params.getdata;
  var str = filename.replace(/-/g, "/");
  // res.sendFile(path.resolve(`../HelmetDetection_V2ByImage/${str}`));
  res.sendFile(path.resolve(`../python/${str}`));
});

router.get("/api/data/uploadbyweb/:getdata", (req, res) => {
  var filename = req.params.getdata;
  var str = filename.replace(/-/g, "/");
  console.log("filename ", filename);
  console.log("str ", str);
  res.sendFile(path.resolve(`./Images/${str}`));
});

// router.get("/api/data/uploadbyapp/:getdata", (req, res) => {
//   var filename = req.params.getdata;
//   var str = filename.replace(/-/g, "/");
//   console.log("filename ", filename);
//   console.log("str ", str);
//   res.sendFile(path.resolve(`./Images/${str}`));
// });

router.post("/api/insertdatabyvideo/", (req, res) => {
  console.log("req => ", req.body);
  const { top, province, bottom, image, score } = req.body;
  if (!top || !province || !bottom || !image || !score) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({
    licensepartone: top,
    licenseparttwo: province,
    licensepartthree: bottom,
  })
    .then((result) => {
      var first_name = "-";
      var last_name = "-";
      var faculty = "-";
      var student_id = "-";
      if (result) {
        first_name = result.first_name;
        last_name = result.last_name;
        faculty = result.faculty;
        student_id = result.student_id;
      }
      const data = new Data({
        first_name,
        last_name,
        faculty,
        student_id,
        licensepartone: top,
        licenseparttwo: province,
        licensepartthree: bottom,
        date_data: Date.now(),
        path_image: image,
        upload_by: "video",
        accuracy: score,
        verify_status: false,
      });
      console.log("data => ", data);
      data
        .save()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

router.post("/api/insertdatabyimage/", (req, res) => {
  console.log("req => ", req.body);
  const { top, province, bottom, image, score } = req.body;
  if (!top || !province || !bottom || !image || !score) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({
    licensepartone: top,
    licenseparttwo: province,
    licensepartthree: bottom,
  })
    .then((result) => {
      var first_name = "-";
      var last_name = "-";
      var faculty = "-";
      var student_id = "-";
      if (result) {
        first_name = result.first_name;
        last_name = result.last_name;
        faculty = result.faculty;
        student_id = result.student_id;
      }
      const data = new Data({
        first_name,
        last_name,
        faculty,
        student_id,
        licensepartone: top,
        licenseparttwo: province,
        licensepartthree: bottom,
        date_data: Date.now(),
        path_image: image,
        upload_by: "image",
        accuracy: score,
        verify_status: false,
      });
      console.log("data => ", data);
      data
        .save()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

router.post("/api/check-data", (req, res) => {
  console.log("reqcheck => ", req.body);
  const { student_id } = req.body;
  if (!student_id) {
    return res.status(422).json({ error: "กรุณากรอกข้อมูล" });
  }
  Data.find({
    student_id: student_id,
  })
    .then((result) => {
      if (result.length <= 0) {
        return res
          .status(422)
          .json({ error: "ไม่พบข้อมูลผู้ไม่สวมหมวกกันน็อค" });
      }
      console.log(result);
      res.json({
        message: "พบข้อมูลผู้ไม่สวมหมวกกันน็อค",
        amount: result.length,
        data: result,
      });
    })
    .catch((error) => {
      return res.status(422).json({ error: "ไม่พบข้อมูล" });
    });
});

router.get("/api/show-data/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  Data.find({ student_id: student_id })
    .sort({ date_data: -1 })
    .exec(function (err, result) {
      if (result) {
        res.json(result);
      } else {
        res.status(422).json({ message: "ไม่มีข้อมูล" });
      }
    });
});

var storage = multer.diskStorage({
  destination: "./Images",
  filename: function (req, file, callback) {
    callback(null, "plate_" + Date.now() + path.extname(file.originalname));
  },
});

var fileFilter = (req, file, cb) => {
  console.log("test => ", file);
  console.log("test 2 ", req.body);
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "application/octet-stream"
  ) {
    console.log("Test Run1 ");
    cb(null, true);
  } else {
    console.log("Test Run2 ");
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post("/api/insertdatabyweb", upload.single("image"), (req, res) => {
  console.log("img => ", req.file);
  console.log("req => ", req.body);
  const { top, province, bottom } = req.body;
  if (!top || !province || !bottom || !req.file) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({
    licensepartone: top,
    licenseparttwo: province,
    licensepartthree: bottom,
  })
    .then((result) => {
      var first_name = "-";
      var last_name = "-";
      var faculty = "-";
      var student_id = "-";
      if (result) {
        first_name = result.first_name;
        last_name = result.last_name;
        faculty = result.faculty;
        student_id = result.student_id;
      }
      const data = new Data({
        first_name,
        last_name,
        faculty,
        student_id,
        licensepartone: top,
        licenseparttwo: province,
        licensepartthree: bottom,
        date_data: Date.now(),
        path_image: req.file.filename, // path_image: req.file.path,
        upload_by: "web",
        accuracy: "1.0",
        verify_status: false,
      });
      console.log("data => ", data);
      data
        .save()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

router.post(
  "/api/insertdatabyappwoplate",
  upload.single("uploadedImageCard"),
  (req, res) => {
    // console.log("img => ", req.file);
    console.log("req app wo plate => ", req.body);
    const {
      first_name,
      last_name,
      student_id,
      faculty,
      charge,
      imageCard,
      imageEvent,
    } = req.body;
    Student.findOne({
      first_name,
      last_name,
      student_id,
      faculty,
    })
      .then((result) => {
        var licensepartone = "-";
        var licenseparttwo = "-";
        var licensepartthree = "-";
        if (result) {
          licensepartone = result.licensepartone;
          licenseparttwo = result.licenseparttwo;
          licensepartthree = result.licensepartthree;
        }
        const data = new Data({
          first_name,
          last_name,
          faculty,
          student_id,
          licensepartone,
          licenseparttwo,
          licensepartthree,
          charge,
          image_card: imageCard,
          image_event: imageEvent,
          date_data: Date.now(),
          upload_by: "web",
          accuracy: "1.0",
        });
        console.log("data => ", data);
        data
          .save()
          .then((result) => {
            res.json(result);
          })
          .catch((error) => {
            res.status(422).json(error);
          });
      })
      .catch((error) => {
        console.log("หาบุคคลผิดพลาด");
        return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
      });
  }
);

router.post("/api/insertdatabyapp", upload.single("image"), (req, res) => {
  console.log("req => ", req.body);
  const { top, province, bottom, charge, image, imageCard, imageEvent } =
    req.body;
  if (!top || !province || !bottom) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({
    licensepartone: top,
    licenseparttwo: province,
    licensepartthree: bottom,
  })
    .then((result) => {
      var first_name = "-";
      var last_name = "-";
      var faculty = "-";
      var student_id = "-";
      if (result) {
        first_name = result.first_name;
        last_name = result.last_name;
        faculty = result.faculty;
        student_id = result.student_id;
      }
      const data = new Data({
        first_name,
        last_name,
        faculty,
        student_id,
        licensepartone: top,
        licenseparttwo: province,
        licensepartthree: bottom,
        charge,
        path_image: image,
        image_card: imageCard,
        image_event: imageEvent,
        date_data: Date.now(),
        upload_by: "web",
        accuracy: "1.0",
      });
      console.log("data => ", data);
      data
        .save()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

router.put("/api/data/updatedatabyweb", upload.single("image"), (req, res) => {
  console.log("img => ", req.file);
  console.log("req => ", req.body);
  const { _id, top, province, bottom } = req.body;
  if (!_id || !top || !province || !bottom) {
    return res.status(422).json({ error: "กรุณากรอกให้ครบ" });
  }
  Student.findOne({
    licensepartone: top,
    licenseparttwo: province,
    licensepartthree: bottom,
  })
    .then((result) => {
      var first_name = "-";
      var last_name = "-";
      var faculty = "-";
      var student_id = "-";
      if (result) {
        first_name = result.first_name;
        last_name = result.last_name;
        faculty = result.faculty;
        student_id = result.student_id;
      }
      var data_update = {};
      if (req.file) {
        data_update = {
          first_name,
          last_name,
          faculty,
          student_id,
          licensepartone: top,
          licenseparttwo: province,
          licensepartthree: bottom,
          date_data: Date.now(),
          path_image: req.file.filename, //path_image: req.file.path,
          upload_by: "web",
          accuracy: "1.0",
        };
      } else {
        data_update = {
          first_name,
          last_name,
          faculty,
          student_id,
          licensepartone: top,
          licenseparttwo: province,
          licensepartthree: bottom,
          date_data: Date.now(),
          upload_by: "web",
          accuracy: "1.0",
        };
      }
      const filter = {
        _id: _id,
      };
      Data.findOneAndUpdate(filter, data_update)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((error) => {
      return res.status(422).json({ error: "หาบุคคลผิดพลาด" });
    });
});

router.put("/api/dataverify", (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(422).json({ error: "กรุณาส่ง _id ด้วย" });
  }
  const data_update = {
    accuracy: "1.0  ",
    verify_status: true,
  };
  const filter = { _id: _id };
  Data.findOneAndUpdate(filter, data_update)
    .then((result) => {
      console.log(result);
      res.json({ message: "สำเร็จ", data: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ message: "ไม่สำเร็จ", data: error });
    });
});

module.exports = router;
