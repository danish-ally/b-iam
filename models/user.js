const Mongoose = require("mongoose");
const role = require("../helpers/role");
const { Schema } = Mongoose;

// User Schema

const UserSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true,
  },

  empCode: {
    type: Number,
  },

  shopCode: {
    type: Number,
  },

  email: {
    type: String,
    required: () => {
      return this.provider !== "email" ? false : true;
    },
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: role.Member,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  distributorId: {
    type: String,
    // unique: true,
  },

  phoneNo: {
    type: String,
  },

  aadharNumber: {
    type: String,
  },

  isAadharVerified: {
    type: Boolean,
  },

  panNumber: {
    type: String,
  },

  isPanVerified: {
    type: Boolean,
  },

  isPointOfContact: {
    type: Boolean,
  },
  pocFirstName: {
    type: String,
  },
  pocLastName: {
    type: String,
  },

  pocPhoneNo: {
    type: String,
  },
  pocEmail: {
    type: String,
  },

  businessName: {
    type: String,
  },

  businessAddress: {
    type: String,
  },

  gstNumber: {
    type: String,
  },

  state: {
    type: String,
  },

  city: {
    type: String,
  },

  pincode: {
    type: String,
  },

  landmark: {
    type: String,
  },

  agreement: {
    type: Boolean,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("User", UserSchema);
