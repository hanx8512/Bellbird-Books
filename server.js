import { createApp } from "./src/app.js";

const port = Number(process.env.PORT || 3000);
const app = createApp();

const address = await app.listen(port);
console.log(`BB-IMS is running at http://127.0.0.1:${address.port}`);
console.log("Press Ctrl+C to stop.");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    console.log(`\nReceived ${signal}. Closing server.`);
    await app.close();
    process.exit(0);
  });
}
