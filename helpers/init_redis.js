const redis = require("redis");

const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
  // host: "redis",
  // url: "redis://redis:6379",
});

// for redis 4
// (async () => {
//   await client.connect();
// })();

client.on("connect", () => {
  console.log("Client connected to redis...");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
