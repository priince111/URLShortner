const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  visits: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
});

module.exports = mongoose.model("Url", UrlSchema);
