const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Lead Schema
const CitySchema = new Schema({
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
  state: {
    type: Schema.Types.ObjectId,
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

module.exports = Mongoose.model("City", CitySchema);
