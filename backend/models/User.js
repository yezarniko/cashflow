const mongoose = require("mongoose");

const ProductLogSchema = new mongoose.Schema({
  date: {
    type: mongoose.Schema.Types.Date,
  },
  counts: {
    type: mongoose.Schema.Types.Number,
  },
  buyingPrice: {
    type: mongoose.Schema.Types.Number,
  },
  amount: {
    type: mongoose.Schema.Types.Number,
  },
});

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  productName: String,
  productImg: String,
  category: {
    type: String,
    ref: "Category",
  },
  brand: {
    type: String,
    ref: "Brand",
  },
  buyingPrice: {
    type: mongoose.Schema.Types.Number,
  },
  salePrice: {
    type: mongoose.Schema.Types.Number,
  },
  domainCounts: {
    type: mongoose.Schema.Types.Number,
  },
  counts: {
    type: mongoose.Schema.Types.Number,
  },
  recentModifiedDate: {
    type: mongoose.Schema.Types.Date,
  },
  productLogs: [ProductLogSchema],
});

const CashListInputSchema = new  mongoose.Schema({
    count: { type: mongoose.Schema.Types.Number },
    name: { type: String },
    price: { type: mongoose.Schema.Types.Number },
});

const SaleLogSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.Number,
  },
  amount: {
    type: mongoose.Schema.Types.Number,
  },
  timestamp: {
    type: mongoose.Schema.Types.Date,
  },
  isOrder: {
    type: mongoose.Schema.Types.Boolean,
  },
  products: [CashListInputSchema],
});

const InputLogSchema = new mongoose.Schema({
  amount: {
    type: mongoose.Schema.Types.Number,
  },
  date: {
    type: mongoose.Schema.Types.Date,
  },
  products: [ProductSchema],
});

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  branchId: {
    type: String,
    unique: true,
  },
  phone: {
    type: mongoose.Schema.Types.Number,
  },
  address: {
    type: String,
  },
  agentName: {
    type: String,
  },
  productList: [ProductSchema],
  saleLogs: [SaleLogSchema],
  inputLogs: [InputLogSchema],
});

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  branches: [branchSchema],
});

module.exports = mongoose.model("User", userSchema);
