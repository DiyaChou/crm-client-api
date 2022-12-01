const redis = require("redis");

const setJWT = async (key, value) => {
  try {
    console.log("inside setJWT");
    const client = redis.createClient(process.env.REDIS_URL);

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client
      .connect()
      .then(() => console.log("redis connected"))
      .catch((err) => console.log("error", err));
    let setJWTStatus = await client.set(key, value);
    await client.disconnect();
    return setJWTStatus;
  } catch (error) {
    await client.disconnect();
    return error;
  }
};

const getJWT = async (key) => {
  try {
    console.log("inside getJWT");
    const client = redis.createClient({
      host: "127.0.0.1",
      port: 6379,
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client
      .connect()
      .then(() => console.log("redis connected"))
      .catch((err) => console.log("error", err));

    let getk = await client.get(key);
    await client.disconnect();

    return getk;
  } catch (err) {
    await client.get(key);
    return err;
  }
};

module.exports = {
  setJWT,
  getJWT,
};
