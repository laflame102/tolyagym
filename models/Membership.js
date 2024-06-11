const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;
