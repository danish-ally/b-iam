const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Lead Schema
const DistributorSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  distributorId: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: () => {
      return this.provider !== "email" ? false : true;
    },
  },

  phoneNo: {
    type: String,
    required: true,
  },

  aadharNumber: {
    type: String,
    required: true,
  },

  isAadharVerified: {
    type: Boolean,
    required: true,
  },

  panNumber: {
    type: String,
    required: true,
  },

  isPanVerified: {
    type: Boolean,
    required: true,
  },

  businessName: {
    type: String,
    required: true,
  },

  businessAddress: {
    type: String,
    required: true,
  },

  gstNumber: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },

  landmark: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  agreement: {
    type: Boolean,
    required: true,
  },

  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Distributor", DistributorSchema);
