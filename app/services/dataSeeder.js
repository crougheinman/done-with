import firestoreService from "./firestoreService.js";

/**
 * Seed Firestore with initial data for the DoneWithIt marketplace app
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

      await this.seedCategories();
      await this.seedUsers();
      await this.seedItems();

      console.log("✅ Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }

  /**
   * Seed categories
   */
  async seedCategories() {
    console.log("📂 Seeding categories...");

    const categories = [
      {
        name: "Electronics",
        icon: "📱",
        description: "Phones, laptops, gadgets",
      },
      {
        name: "Clothing",
        icon: "👕",
        description: "Shirts, pants, accessories",
      },
      {
        name: "Books",
        icon: "📚",
        description: "Textbooks, novels, magazines",
      },
      {
        name: "Furniture",
        icon: "🪑",
        description: "Chairs, tables, home decor",
      },
      {
        name: "Sports",
        icon: "⚽",
        description: "Equipment, gear, accessories",
      },
      { name: "Vehicles", icon: "🚗", description: "Bikes, scooters, parts" },
      {
        name: "Home & Garden",
        icon: "🏡",
        description: "Tools, appliances, decor",
      },
      {
        name: "Collectibles",
        icon: "🏆",
        description: "Antiques, memorabilia, art",
      },
    ];

    for (const category of categories) {
      try {
        await this.firestoreService.create("categories", category);
        console.log(`  ✓ Created category: ${category.name}`);
      } catch (error) {
        // Category might already exist, skip
        console.log(`  - Category ${category.name} already exists`);
      }
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
   * Seed sample items
   */
  async seedItems() {
    console.log("📦 Seeding items...");

    // Get users and categories first
    const users = await this.firestoreService.getAll("users");
    const categories = await this.firestoreService.getAll("categories");

    if (users.length === 0 || categories.length === 0) {
      console.log("  ⚠️  No users or categories found. Skipping item seeding.");
      return;
    }

    const sampleItems = [
      {
        title: "iPhone 12 Pro - Excellent Condition",
        description:
          "Barely used iPhone 12 Pro with original box and accessories. 256GB storage, Pacific Blue color.",
        price: 699,
        category: "Electronics",
        condition: "Like New",
        images: ["https://picsum.photos/400/400?random=1"],
        location: "New York, NY",
        sellerId: users[0].id,
        status: "available",
      },
      {
        title: "Vintage Leather Jacket",
        description:
          "Authentic leather jacket from the 90s. Perfect condition, size M. Great for collectors.",
        price: 89,
        category: "Clothing",
        condition: "Good",
        images: ["https://picsum.photos/400/400?random=2"],
        location: "Los Angeles, CA",
        sellerId: users[1].id,
        status: "available",
      },
      {
        title: "Calculus Textbook - 8th Edition",
        description:
          "Stewart's Calculus textbook, barely used. Perfect for college students.",
        price: 45,
        category: "Books",
        condition: "Very Good",
        images: ["https://picsum.photos/400/400?random=3"],
        location: "Seattle, WA",
        sellerId: users[4].id,
        status: "available",
      },
      {
        title: "Ergonomic Office Chair",
        description:
          "Comfortable mesh office chair with lumbar support. Adjustable height and arms.",
        price: 129,
        category: "Furniture",
        condition: "Good",
        images: ["https://picsum.photos/400/400?random=4"],
        location: "Chicago, IL",
        sellerId: users[2].id,
        status: "available",
      },
      {
        title: "Mountain Bike - Trek 7.3 FX",
        description:
          "Well-maintained mountain bike, perfect for trails. 21-speed, front suspension.",
        price: 299,
        category: "Sports",
        condition: "Good",
        images: ["https://picsum.photos/400/400?random=5"],
        location: "Austin, TX",
        sellerId: users[3].id,
        status: "available",
      },
      {
        title: "MacBook Pro Charger",
        description:
          "Original 96W USB-C charger for MacBook Pro. Works perfectly, includes cable.",
        price: 25,
        category: "Electronics",
        condition: "Like New",
        images: ["https://picsum.photos/400/400?random=6"],
        location: "New York, NY",
        sellerId: users[0].id,
        status: "available",
      },
      {
        title: "Designer Handbag",
        description:
          "Genuine leather handbag from a popular brand. Used but in great condition.",
        price: 75,
        category: "Clothing",
        condition: "Good",
        images: ["https://picsum.photos/400/400?random=7"],
        location: "Los Angeles, CA",
        sellerId: users[1].id,
        status: "available",
      },
      {
        title: "Psychology 101 Textbook",
        description:
          "Comprehensive psychology textbook with study guides. Highlighted but readable.",
        price: 35,
        category: "Books",
        condition: "Good",
        images: ["https://picsum.photos/400/400?random=8"],
        location: "Seattle, WA",
        sellerId: users[4].id,
        status: "available",
      },
    ];

    for (const item of sampleItems) {
      try {
        await this.firestoreService.createItem(item);
        console.log(`  ✓ Created item: ${item.title}`);
      } catch (error) {
        console.error(`  ❌ Error creating item ${item.title}:`, error);
      }
    }
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAll() {
    console.log("🗑️  Clearing all data...");

    const collections = ["users", "items", "categories"];

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
