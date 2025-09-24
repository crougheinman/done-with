#!/usr/bin/env node

/**
 * Firebase Connection Test Script
 * Run with: node scripts/test-firebase.js
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

// Now dynamically import Firebase modules AFTER environment variables are set
async function runTest() {
  try {
    const { default: firestoreService } = await import(
      "../app/services/firestoreService.js"
    );
    const { db } = await import("../app/services/firebase.js");
    const { collection, getDocs } = await import("firebase/firestore");

    console.log("🔥 Testing Firebase Connection...\n");

    // Test 1: Check if we can connect to Firestore
    console.log("📡 Testing Firestore connection...");
    const testCollection = collection(db, "categories");
    const testSnapshot = await getDocs(testCollection);
    console.log("✅ Firestore connection successful");

    // Test 2: Test our Firestore service
    console.log("\n🛠️  Testing Firestore service...");
    const categories = await firestoreService.getCategories();
    console.log(`✅ Retrieved ${categories.length} categories`);

    // Test 3: Test user operations (this might fail if no users exist)
    console.log("\n👤 Testing user operations...");
    try {
      const testUser = await firestoreService.getUserByEmail(
        "test@example.com"
      );
      console.log("✅ User query successful (user may not exist, that's ok)");
    } catch (error) {
      console.log("⚠️  User query failed (expected if no security rules set)");
    }

    console.log("\n🎉 Firebase connection test completed!");
    console.log("\n📋 Next steps:");
    console.log(
      "1. Make sure Firestore security rules are set in Firebase Console"
    );
    console.log("2. Run: npm run seed  (to populate sample data)");
    console.log("3. Test user registration in the app");
  } catch (error) {
    console.error("\n❌ Firebase connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your .env file has correct Firebase config");
    console.log("2. Verify Firestore is enabled in Firebase Console");
    console.log("3. Make sure security rules allow read access");
    console.log("4. Check Firebase project permissions");
  }
}

runTest();
