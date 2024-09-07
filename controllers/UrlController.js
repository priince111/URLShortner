const Url = require("../models/Url");
const { v4: uuidv4 } = require('uuid');
const redis = require("redis");
const client = redis.createClient();

const shortenUrl = async (req, res) => {
  const { originalUrl, customShortCode, expiryDate } = req.body;
  let shortCode = customShortCode || uuidv4().slice(0, 7);
  try {
    const shortCodeUrl = await Url.findOne({ shortCode });
    if (shortCodeUrl) {
      return res.status(400).json({ error: "Short code already in use" });
    }
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.status(200).json({
        originalUrl: existingUrl.originalUrl,
        shortUrl: `http://localhost:5000/${existingUrl.shortCode}`,
        message: 'This URL has already been shortened',
      });
    }
    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });
    await newUrl.save();
    await client.setEx(shortCode, 3600, originalUrl);
    return res.status(201).json({
      originalUrl,
      shortUrl: `http://localhost:4000/${shortCode}`,
    });

} catch (err) {
    res.status(500).json({ error: err.message || "An error occurred while shortening url." });
  }
};


module.exports = {shortenUrl}
