const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// State Schema
const StateSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
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

module.exports = Mongoose.model("State", StateSchema);
