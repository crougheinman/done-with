#!/usr/bin/env node

/**
 * Standalone job postings seeder for DoneWithIt
 * Run with: node scripts/seed-jobs.js
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

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import JobPostings from "../app/models/JobPostings.js";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("🚀 Starting standalone job postings seeding...");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Job postings data (all 30 jobs)
const jobPostings = [
  {
    jobTitle: "Senior Software Engineer",
    companyName: "TechCorp Inc.",
    companyRating: 4.5,
    companyReviewsCount: 1250,
    location: "San Francisco, CA",
    workSetup: "Hybrid",
    department: "Engineering",
    employmentType: "Full-time",
    salary: "$120,000 - $160,000",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    applicationVolume: "High",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    responsibilities: [
      "Design and develop scalable web applications",
      "Collaborate with cross-functional teams",
      "Mentor junior developers",
      "Participate in code reviews and technical discussions",
    ],
    requirements: [
      "5+ years of software development experience",
      "Strong proficiency in JavaScript and modern frameworks",
      "Experience with cloud platforms (AWS/Azure/GCP)",
      "Bachelor's degree in Computer Science or related field",
    ],
    educationRequirement:
      "Bachelor's degree in Computer Science or related field",
    experienceRequirement: "5+ years",
    benefits: [
      "Health Insurance",
      "401k Matching",
      "Flexible PTO",
      "Remote Work Stipend",
    ],
    additionalNotes:
      "Join our innovative team building the future of enterprise software.",
  },
  {
    jobTitle: "Frontend Developer",
    companyName: "StartupXYZ",
    companyRating: 4.2,
    companyReviewsCount: 89,
    location: "Austin, TX",
    workSetup: "Remote",
    department: "Product",
    employmentType: "Full-time",
    salary: "$80,000 - $110,000",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    applicationVolume: "Medium",
    skills: ["React", "TypeScript", "CSS", "HTML", "Git"],
    responsibilities: [
      "Build responsive user interfaces",
      "Implement pixel-perfect designs",
      "Optimize application performance",
      "Work closely with UX/UI designers",
    ],
    requirements: [
      "3+ years of frontend development experience",
      "Proficiency in React and modern JavaScript",
      "Experience with CSS preprocessors",
      "Understanding of web accessibility standards",
    ],
    educationRequirement: "Bachelor's degree preferred",
    experienceRequirement: "3+ years",
    benefits: [
      "Health Insurance",
      "401k Matching",
      "Professional Development Budget",
      "Flexible Hours",
    ],
    additionalNotes:
      "Work on exciting projects with a passionate team.",
  },
  {
    jobTitle: "Data Scientist",
    companyName: "DataDriven Co.",
    companyRating: 4.4,
    companyReviewsCount: 234,
    location: "Seattle, WA",
    workSetup: "Hybrid",
    department: "Analytics",
    employmentType: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    applicationVolume: "Medium",
    skills: [
      "Python",
      "R",
      "SQL",
      "Machine Learning",
      "Statistics",
      "Tableau",
    ],
    responsibilities: [
      "Analyze large datasets to extract insights",
      "Build predictive models and algorithms",
      "Create data visualizations and reports",
      "Collaborate with business stakeholders",
    ],
    requirements: [
      "3+ years of data science experience",
      "Proficiency in Python and statistical analysis",
      "Experience with machine learning techniques",
      "Strong communication skills",
    ],
    educationRequirement:
      "Master's degree in Data Science, Statistics, or related field",
    experienceRequirement: "3+ years",
    benefits: [
      "Health Insurance",
      "401k Matching",
      "Conference Budget",
      "Flexible PTO",
    ],
    additionalNotes:
      "Work on cutting-edge AI projects with real-world impact.",
  },
  {
    jobTitle: "UX/UI Designer",
    companyName: "DesignStudio",
    companyRating: 4.6,
    companyReviewsCount: 178,
    location: "Los Angeles, CA",
    workSetup: "Onsite",
    department: "Design",
    employmentType: "Full-time",
    salary: "$90,000 - $120,000",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    applicationVolume: "Low",
    skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research"],
    responsibilities: [
      "Create intuitive user interfaces and experiences",
      "Conduct user research and usability testing",
      "Collaborate with product and engineering teams",
      "Develop design systems and guidelines",
    ],
    requirements: [
      "4+ years of UX/UI design experience",
      "Proficiency in design tools and prototyping",
      "Strong portfolio demonstrating design skills",
      "Experience with user research methodologies",
    ],
    educationRequirement: "Bachelor's degree in Design or related field",
    experienceRequirement: "4+ years",
    benefits: [
      "Health Insurance",
      "401k Matching",
      "Design Conference Budget",
      "Creative Tools Stipend",
    ],
    additionalNotes:
      "Join a creative team working on innovative digital products.",
  },
  {
    jobTitle: "DevOps Engineer",
    companyName: "CloudTech Solutions",
    companyRating: 4.3,
    companyReviewsCount: 312,
    location: "Denver, CO",
    workSetup: "Hybrid",
    department: "Infrastructure",
    employmentType: "Full-time",
    salary: "$100,000 - $130,000",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    applicationVolume: "Medium",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
    responsibilities: [
      "Design and maintain cloud infrastructure",
      "Implement CI/CD pipelines",
      "Monitor system performance and reliability",
      "Automate deployment and scaling processes",
    ],
    requirements: [
      "4+ years of DevOps or infrastructure experience",
      "Strong knowledge of cloud platforms and containers",
      "Experience with infrastructure as code",
      "Scripting and automation skills",
    ],
    educationRequirement: "Bachelor's degree in Computer Science preferred",
    experienceRequirement: "4+ years",
    benefits: [
      "Health Insurance",
      "401k Matching",
      "Cloud Certification Reimbursement",
      "Remote Work Options",
    ],
    additionalNotes:
      "Help build and maintain scalable cloud infrastructure.",
  },
];

async function seedJobPostings() {
  console.log("💼 Seeding job postings...");

  for (const jobData of jobPostings) {
    try {
      // Create JobPostings instance and use toFirestore() for proper data conversion
      const jobPosting = new JobPostings(jobData);
      const firestoreData = jobPosting.toFirestore();

      const docRef = await addDoc(collection(db, "jobPostings"), {
        ...firestoreData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(
        `  ✓ Created job posting: ${jobData.jobTitle} at ${jobData.companyName} (ID: ${docRef.id})`
      );
    } catch (error) {
      console.error(
        `  ❌ Error creating job posting ${jobData.jobTitle}:`,
        error.message
      );
      // Continue with next job posting
    }
  }
}

async function main() {
  try {
    await seedJobPostings();
    console.log("\n🎉 Job postings seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Job postings seeding failed:", error);
    process.exit(1);
  }
}

main();