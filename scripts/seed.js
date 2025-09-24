#!/usr/bin/env node

/**
 * Database seeding script for DoneWithIt
 * Run with: node scripts/seed.js
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Load .env file FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

try {
  const envContent = readFileSync(envPath, "utf8");
  const envVars = envContent.split("\n").reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key && value && !key.startsWith("#")) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

  // Set environment variables
  Object.keys(envVars).forEach((key) => {
    process.env[key] = envVars[key];
  });

  console.log("✅ Environment variables loaded");
} catch (error) {
  console.error("❌ Could not load .env file:", error.message);
  process.exit(1);
}

import dataSeeder from "../app/services/dataSeeder.js";

async function main() {
  try {
    console.log("🚀 Starting DoneWithIt database seeding...\n");

    await dataSeeder.seedAll();

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("You can now run the app with: npm start");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  }
}

main();
