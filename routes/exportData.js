const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Data = mongoose.model("Data");
const Student = mongoose.model("Student");
const requiredLogin = require("../middleware/requiredLogin");
const path = require("path");
const moment = require("moment");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const xl = require("excel4node");

// EXPORT DATA XLSX FILE
router.get("/api/exportxlsx", async (req, res) => {
  console.log(req.query);
  var result_res = [];

  if (req.query.start_date && req.query.end_date) {
    console.log("data date");

    const start_date = moment("2021-05-15").startOf("day");
    const end_date = moment("2021-05-15").endOf("day");

    result_res = await Data.find({
      //query today up to tonight
      date_data: {
        $gte: start_date,
        $lt: end_date,
      },
      verify_status: true,
    }).sort({ date_data: -1 }); //.then((result_res) => {
  } else {
    console.log("no data date");

    result_res = await Data.find({ verify_status: true }).sort({
      date_data: -1,
    }); //.then((result_res) => {
  }

  if (result_res) {
    let value_firstname = req.query.first_name;
    let value_faculty = req.query.faculty;
    let value_year = req.query.year;

    let result = [];
    let result1 = [];
    let result2 = [];

    result = result_res.filter((datas) => {
      return datas.first_name.search(value_firstname) != -1;
    });

    result1 = result.filter((datas) => {
      return datas.faculty.search(value_faculty) != -1;
    });

    result2 = result1.filter((datas) => {
      let student_result = datas.student_id;
      student_result = student_result.slice(0, 2);
      return student_result.search(value_year) != -1;
    });

    //res.json(result2)

    // Create workbook and add worksheet
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Data", {
      disableRowSpansOptimization: true,
    });
    console.log(result2);
    // Generate some fake data for testing
    const data = [];
    const rowCount = result2.length;
    let row = 1;
    while (row <= rowCount) {
      console.log(row);
      data.push({
        first_name: result2[row - 1].first_name,
        last_name: result2[row - 1].last_name,
        faculty: result2[row - 1].faculty,
        student_id: result2[row - 1].student_id,
        date_data: moment(result2[row - 1].date_data).format("DD/MM/YYYY"),
        license:
          result2[row - 1].licensepartone +
          "-" +
          result2[row - 1].licenseparttwo +
          "-" +
          result2[row - 1].licensepartthree,
      });
      row += 1;
    }
    console.log(data);
    const startRow = 4;
    // Add data to worksheet

    //  Header
    ws.cell(3, 1)
      .string("ลำดับ")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 2)
      .string("ชื่อ")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 3)
      .string("นามสกุล")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 4)
      .string("คณะ")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 5)
      .string("รหัสนิสิต")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 6)
      .string("วันที่บันทึกข้อมูล")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    ws.cell(3, 7)
      .string("ป้ายทะเบียน")
      .style({
        alignment: {
          vertical: ["center"],
          horizontal: ["left"],
        },
        font: {
          color: "000000",
          size: 12,
        },
        border: {
          bottom: {
            style: "thin",
            color: "000000",
          },
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
        },
      });
    //

    if (data.length) {
      data.forEach((item, i) => {
        const currentRow = i + startRow;
        const newtarget = "newtarget";
        const newprogress = "newprogress";

        ws.cell(currentRow, 1)
          .number(i + 1)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 2)
          .string(item.first_name)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 3)
          .string(item.last_name)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 4)
          .string(item.faculty)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 5)
          .string(item.student_id)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 6)
          .string(item.date_data)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
        ws.cell(currentRow, 7)
          .string(item.license)
          .style({
            alignment: {
              vertical: ["center"],
              horizontal: ["left"],
            },
            font: {
              color: "000000",
              size: 12,
            },
            border: {
              bottom: {
                style: "thin",
                color: "000000",
              },
              right: {
                style: "thin",
                color: "000000",
              },
              left: {
                style: "thin",
                color: "000000",
              },
              top: {
                style: "thin",
                color: "000000",
              },
            },
          });
      });
    }
    wb.write(`${Date.now()}.xlsx`, res);
  } else {
  }
  //})
});

module.exports = router;
