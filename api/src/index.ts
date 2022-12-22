import app from "./app";
import { getConfig } from "./common/config";
import redisClient from "./common/redis-client";

if (!getConfig("PORT")) {
  process.exit(1);
}

const PORT: number = parseInt(getConfig("PORT") as string, 10);

async function main() {
  // Connect to cache server
  await redisClient.connect();

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 App started in ${getConfig("MODE")} mode on port ${PORT}.`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
