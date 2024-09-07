const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
    shortCode: { type: String, required: true },
    timestamps: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    deviceType: { type: String },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
