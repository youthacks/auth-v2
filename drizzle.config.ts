import { defineConfig } from "drizzle-kit";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile("./.env.local");
} catch (_e) {}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
});
