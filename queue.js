const Bull = require('bull');
const Url = require('./models/Url');
const redisConfig = { host: 'localhost', port: 6379 };

const visitQueue = new Bull('visit-aggregation', {
  redis: redisConfig
});

visitQueue.process(async (job) => {
  const { shortCode, visitData } = job.data;

  try {
    await Url.updateOne(
      { shortCode },
      {
        $inc: {
          totalVisits: 1,
          [`deviceCounts.${visitData.device}`]: 1
        }
      }
    );
    console.log(`Aggregated data for ${shortCode}`);
  } catch (err) {
    console.error('Error processing job:', err);
  }
});

module.exports = visitQueue;
