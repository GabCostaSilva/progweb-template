const redis = require("redis");
const bluebird = require('bluebird')

bluebird.promisifyAll(redis)

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

client.on("error", function(error) {
  console.error('here', error);
});

module.exports = client
