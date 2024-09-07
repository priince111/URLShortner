const Analytics = require("../models/Analytics");
const Url = require("../models/Url");
const useragent = require("useragent");
const redis = require("redis");
const client = redis.createClient();
const visitQueue = require('../queue');

const urlRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const cachedUrl = await client.get(shortCode);
    if (cachedUrl) {
        return res.status(302).redirect(cachedUrl);
    }

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: "Short code not found" });
    }

    res.redirect(302, url.originalUrl);
    url.visits++;
    await url.save();

    const agent = useragent.parse(req.headers["user-agent"]);
    const deviceType = agent.isMobile ? "mobile" : "desktop";

    await visitQueue.add({
      shortCode,
      visitData: { device: deviceType }
    });

    const analytics = new Analytics({
      shortCode,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      deviceType,
    });
    await analytics.save();
    await client.setEx(shortCode, 3600, url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const dataAnalysis = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: "Short code not found" });
    }

    const analytics = await Analytics.find({ shortCode });

    const deviceBreakdown = {
      mobile: analytics.filter((a) => a.deviceType === "mobile").length,
      desktop: analytics.filter((a) => a.deviceType === "desktop").length,
    };

    res.status(200).json({
      originalUrl: url.originalUrl,
      totalVisits: url.visits,
      deviceBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { urlRedirect, dataAnalysis };
