const MONGOOSE = require("mongoose");

const APP_SCHEMA = new MONGOOSE.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  roll_num: {
    type: String,
    required: true,
  },
  matric_marks: {
    type: Number,
    required: true,
  },
  inter_marks: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile_num: {
    type: Number,
    required: true,
  },
  aadhar_num: {
    type: Number,
    required: true,
  }
});

const APP_MODEL = new MONGOOSE.model("Data", APP_SCHEMA);

module.exports = APP_MODEL;
