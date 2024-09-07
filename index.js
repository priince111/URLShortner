const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const apiRoutes = require('./routes/apiRoutes')
const redis = require("redis");
const client = redis.createClient();
const rateLimit = require('express-rate-limit');
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.dbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  client.connect().then(() => {
    console.log('Connected to Redis');
  }).catch(err => {
    console.error('Redis connection error', err);
  });

app.use('/api', apiRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
