import { createClient } from "redis";
import { getConfig } from "./config";

const redisClient = createClient({
  url: getConfig("REDIS_URL"),
});

export default redisClient;
