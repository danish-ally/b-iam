const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Lead Schema
const storeSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  code: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  city: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  phoneNo: {
    type: String,
    required: true,
  },

  profilePhoto: {
    type: String,
  },

  dateOfOpening: {
    type: Date,
    required: true,
  },

  openingHoursFrom: {
    type: String,
    required: true,
  },

  openingHoursTo: {
    type: String,
    required: true,
  },
  operationalDays: {
    type: String,
    required: true,
  },

  pincode: {
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

module.exports = Mongoose.model("Store", storeSchema);
