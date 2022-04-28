const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Pincode Schema
const PincodeSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },
  label: {
    type: String,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Pincode", PincodeSchema);
