const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: () => {
      return this.provider !== "email" ? false : true;
    },
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "ROLE_MEMBER",
    enum: ["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_DISTRIBUTOR"],
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
