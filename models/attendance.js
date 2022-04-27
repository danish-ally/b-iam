const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Attendace Schema
const AttendanceSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },
  image: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  date: {
    type: String,
  },

  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Attendace", AttendanceSchema);
