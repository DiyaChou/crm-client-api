const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
  pin: {
    type: String,
    maxlength: 6,
    minlength: 6,
    required: true,
  },

  email: { type: String, maxlength: 50, required: true },
});

ResetPinSchema.index({ email: 1 }, { unique: true });

module.exports = {
  ResetPinSchema: mongoose.model("reset_pins", ResetPinSchema),
};
