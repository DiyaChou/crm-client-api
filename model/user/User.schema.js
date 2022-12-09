const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  company: { type: String, maxlength: 50, required: true },
  address: { type: String, maxlength: 50, required: true },
  phone: { type: String, maxlength: 10, required: true },
  email: { type: String, maxlength: 50, required: true },
  password: { type: String, required: true },
  refreshJWT: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  //there are better ways to verify a user than this.
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

UserSchema.index({ email: 1 }, { unique: true });

module.exports = {
  UserSchema: mongoose.model("users", UserSchema),
};
