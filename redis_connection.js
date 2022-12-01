const redis = require("redis");

const port_redis = 6379;
const redisClient = redis.createClient(port_redis);
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect();

module.exports = redisClient;
