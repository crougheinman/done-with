#!/usr/bin/env node

/**
 * Check users in database
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Load .env file
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

  Object.keys(envVars).forEach((key) => {
    process.env[key] = envVars[key];
  });
} catch (error) {
  console.error("Could not load .env file:", error.message);
  process.exit(1);
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log("Users in database:");
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(
        `- Email: ${data.email} | Name: ${data.name} | Type: ${data.userType} | ID: ${doc.id}`
      );
    });
  } catch (error) {
    console.error("Error checking users:", error.message);
  }
}

checkUsers();
