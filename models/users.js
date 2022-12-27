const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gems: {
    type: Number,
    integer: true,
  },
  stringArray: [String],
});

module.exports = mongoose.model("User", userSchema);
