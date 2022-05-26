const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Lead Schema
const FilterCitySchema = new Schema(
  {
    _id: {
      type: Schema.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("FilterCity", FilterCitySchema);
