const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  subject: { type: String, maxlength: 50, required: true, default: "" },
  openAt: { type: Date, required: true, default: Date.now() },
  status: {
    type: String,
    maxlength: 30,
    required: true,
    default: "Pending Operator response",
  },
  conversation: [
    {
      sender: {
        type: String,
        maxlength: 50,
        required: true,
      },
      message: {
        type: String,
        maxlength: 1000,
        required: true,
        default: "",
      },
      msgAt: { type: Date, required: true, default: Date.now() },
    },
  ],
});

// TicketSchema.index({ email: 1 }, { unique: true });

module.exports = {
  TicketSchema: mongoose.model("tickets", TicketSchema),
};
