const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status_program_ai: {
    type: Boolean,
    required: true,
  },
});

mongoose.model("status_program", statusSchema);
