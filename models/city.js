const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// City Schema
const citySchema = new Schema(
  {
    _id: {
      type: Schema.ObjectId,
      auto: true,
    },

    cityCode: {
      type: String,
      unique: true,
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

module.exports = Mongoose.model("city", citySchema);
