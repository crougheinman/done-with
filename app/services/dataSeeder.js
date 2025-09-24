import firestoreService from "./firestoreService.js";
import User from "../models/User.js";

/**
 * Seed Firestore with initial data for the DoneWithIt job-seeking app
 */
class DataSeeder {
  constructor() {
    this.firestoreService = firestoreService;
  }

  /**
   * Seed all initial data
   */
  async seedAll() {
    try {
      console.log("🌱 Starting database seeding...");

      await this.seedUsers();

      console.log("✅ Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }

  /**
   * Seed users
   */
  async seedUsers() {
    console.log("👥 Seeding users...");

    const users = [
      {
        email: "john.doe@example.com",
        password: "password123",
        name: "John Doe",
        userType: "applicant",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Tech enthusiast selling gadgets I no longer need",
        location: "New York, NY",
        rating: 4.8,
        totalSales: 15,
      },
      {
        email: "jane.smith@example.com",
        password: "securepass456",
        name: "Jane Smith",
        userType: "employer",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        bio: "Fashion lover with a closet full of treasures",
        location: "Los Angeles, CA",
        rating: 4.9,
        totalSales: 23,
      },
      {
        email: "mike.wilson@example.com",
        password: "mikepass789",
        name: "Mike Wilson",
        userType: "applicant",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Sports equipment collector and reseller",
        location: "Chicago, IL",
        rating: 4.7,
        totalSales: 8,
      },
      {
        email: "sarah.brown@example.com",
        password: "sarah2023",
        name: "Sarah Brown",
        userType: "employer",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        bio: "Bookworm sharing my favorite reads",
        location: "Austin, TX",
        rating: 5.0,
        totalSales: 31,
      },
      {
        email: "alex.chen@example.com",
        password: "alexpass321",
        name: "Alex Chen",
        userType: "applicant",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        bio: "Student selling textbooks and electronics",
        location: "Seattle, WA",
        rating: 4.6,
        totalSales: 12,
      },
    ];

    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await this.firestoreService.getUserByEmail(
          user.email
        );
        if (!existingUser) {
          await this.firestoreService.createUser(user);
          console.log(`  ✓ Created user: ${user.name}`);
        } else {
          console.log(`  - User ${user.name} already exists`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating user ${user.name}:`, error);
      }
    }
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAll() {
    console.log("🗑️  Clearing all data...");

    const collections = ["users"];

    for (const collectionName of collections) {
      try {
        const documents = await this.firestoreService.getAll(collectionName);
        for (const doc of documents) {
          await this.firestoreService.delete(collectionName, doc.id);
        }
        console.log(
          `  ✓ Cleared ${documents.length} documents from ${collectionName}`
        );
      } catch (error) {
        console.error(`  ❌ Error clearing ${collectionName}:`, error);
      }
    }

    console.log("✅ All data cleared!");
  }
}

// Export a singleton instance
const dataSeeder = new DataSeeder();
export default dataSeeder;
