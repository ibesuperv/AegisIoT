import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  console.log("[Cron] Running scheduled task...");

  https.get(process.env.API_URL, (res) => {
    if (res.statusCode === 200) {
      console.log("[Cron] GET request sent successfully");
    } else {
      console.error(`[Cron] GET request failed. Status Code: ${res.statusCode}`);
    }
  }).on("error", (e) => {
    console.error("[Cron] Error while sending request:", e);
  });
});

export default job;
