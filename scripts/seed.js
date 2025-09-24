#!/usr/bin/env node

/**
 * Database seeding script for DoneWithIt
 * Run with: node scripts/seed.js
 */

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
