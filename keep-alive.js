const https = require("https");

// Your deployed app URL (update this after deployment)
const url = "https://tele-bot-post-generator.onrender.com";

// Ping the URL every 5 minutes to prevent the service from sleeping
setInterval(() => {
  https
    .get(url, (res) => {
      console.log(`Ping successful: ${res.statusCode}`);
    })
    .on("error", (err) => {
      console.error(`Ping failed: ${err.message}`);
    });
}, 5 * 60 * 1000); // 5 minutes
