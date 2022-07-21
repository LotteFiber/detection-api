const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  licensepartone: {
    type: String,
    required: false,
  },
  licenseparttwo: {
    type: String,
    required: false,
  },
  licensepartthree: {
    type: String,
    required: false,
  },
});

mongoose.model("Student", studentSchema);
