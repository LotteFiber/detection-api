const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Data = mongoose.model("Data");
const Student = mongoose.model("Student");
const requiredLogin = require("../middleware/requiredLogin");
const path = require("path");
const moment = require("moment")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const xl = require('excel4node');
var multer = require('multer')
const fs = require("fs")
const csv = require('neat-csv');
const e = require("express");

var storage = multer.diskStorage({
    destination: './filecsv/',
    filename: function (req, file, cb) {
        // console.log("test1 => ", file)
        // console.log(Date.now());
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var fileFilter = (req, file, cb) => {
    // console.log("test => ", file)
    if (file.mimetype == "text/csv" || file.mimetype == "application/vnd.ms-excel") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

router.post("/api/importcsv", upload.single('file'), async (req, res) => {
    console.log(req.file)
    let results = []
    if (req.file) {

        const raw = fs.readFileSync(`./${req.file.path}`, 'utf8');

        const readCSV = async () => {
            const result = await csv(raw, { headers: true });
            return result
        }

        const resCSV = await readCSV();
        resCSV.shift();
        // console.log(resCSV);

        for (const student of resCSV) {
            // console.log(student._3);
            const responsefromdb = await Student.findOne({ student_id: student._3 })
            console.log(responsefromdb)
            if (responsefromdb) {
                results.push(responsefromdb)
                console.log("found user.")
            } else {

                console.log("Not found user.")
                const studentDB = new Student({
                    first_name: student._0,
                    last_name: student._1,
                    faculty: student._2,
                    student_id: student._3,
                    licensepartone: student._4,
                    licenseparttwo: student._5,
                    licensepartthree: student._6,
                });
                await studentDB
                    .save()
                    .then((result) => {
                        console.log("Save success.")
                    })
                    .catch((error) => {
                        console.log("Save false.")
                    });
            }
        }

        fs.unlink(`./${req.file.path}`, (err) => {
            if (err) {
                console.log(err)
                return res.status(422).json({ message: "error delete file." })
            }
            console.log("Finished")
            res.json({ message: "ok", user_exist: results });
        })

    } else {
        res.status(422).json({ message: "require file csv." })
    }

})


module.exports = router;