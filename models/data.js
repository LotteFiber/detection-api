const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
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
    text: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  licensepartone: {
    type: String,
    required: true,
  },
  licenseparttwo: {
    type: String,
    required: true,
  },
  licensepartthree: {
    type: String,
    required: true,
  },
  charge: {
    type: String,
    default: "ไม่สวมหมวกนิรภัย",
    required: false,
  },
  date_data: {
    type: Date,
    required: true,
  },
  path_image: {
    type: String,
    required: false,
  },
  upload_by: {
    type: String,
    required: true,
  },
  verify_status: {
    type: Boolean,
    required: false,
  },
  accuracy: {
    type: String,
    required: true,
  },
});

mongoose.model("Data", dataSchema);
