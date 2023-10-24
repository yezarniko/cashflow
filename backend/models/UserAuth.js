const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchId: String,
  branchToken: String,
});

const userAuthSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  accountToken: { type: String },
  branches: [branchSchema],
});

module.exports = mongoose.model("UserAuth", userAuthSchema);
