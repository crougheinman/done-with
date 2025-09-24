import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase.js";

class FirestoreService {
  constructor() {
    this.db = db;
  }

  // ===========================
  // GENERIC CRUD OPERATIONS
  // ===========================

  /**
   * Create a new document in a collection
   * @param {string} collectionName - Name of the collection
   * @param {object} data - Document data
   * @returns {Promise<string>} Document ID
   */
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Read a single document by ID
   * @param {string} collectionName - Name of the collection
   * @param {string} docId - Document ID
   * @returns {Promise<object|null>} Document data or null
   */
  async read(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(
        `Error reading document ${docId} from ${collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update a document
   * @param {string} collectionName - Name of the collection
   * @param {string} docId - Document ID
   * @param {object} data - Updated data
   * @returns {Promise<void>}
   */
  async update(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(
        `Error updating document ${docId} in ${collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a document
   * @param {string} collectionName - Name of the collection
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  async delete(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(
        `Error deleting document ${docId} from ${collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   * @param {string} collectionName - Name of the collection
   * @param {object} options - Query options (where, orderBy, limit)
   * @returns {Promise<Array>} Array of documents
   */
  async getAll(collectionName, options = {}) {
    try {
      let q = collection(this.db, collectionName);

      // Apply filters
      if (options.where) {
        options.where.forEach((condition) => {
          q = query(
            q,
            where(condition.field, condition.operator, condition.value)
          );
        });
      }

      // Apply ordering
      if (options.orderBy) {
        q = query(
          q,
          orderBy(options.orderBy.field, options.orderBy.direction || "asc")
        );
      }

      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return documents;
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // ===========================
  // USER-SPECIFIC OPERATIONS
  // ===========================

  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<string>} User ID
   */
  async createUser(userData) {
    return this.create("users", userData);
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} User data
   */
  async getUser(userId) {
    return this.read("users", userId);
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} User data
   */
  async getUserByEmail(email) {
    const users = await this.getAll("users", {
      where: [{ field: "email", operator: "==", value: email }],
      limit: 1,
    });
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<void>}
   */
  async updateUser(userId, userData) {
    return this.update("users", userId, userData);
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    return this.delete("users", userId);
  }

  // ===========================
  // ITEM-SPECIFIC OPERATIONS
  // ===========================

  /**
   * Create a new item for sale
   * @param {object} itemData - Item data
   * @returns {Promise<string>} Item ID
   */
  async createItem(itemData) {
    return this.create("items", itemData);
  }

  /**
   * Get item by ID
   * @param {string} itemId - Item ID
   * @returns {Promise<object|null>} Item data
   */
  async getItem(itemId) {
    return this.read("items", itemId);
  }

  /**
   * Get all items with optional filters
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} Array of items
   */
  async getItems(filters = {}) {
    const queryOptions = {
      orderBy: { field: "createdAt", direction: "desc" },
    };

    if (filters.category) {
      queryOptions.where = [
        { field: "category", operator: "==", value: filters.category },
      ];
    }

    if (filters.sellerId) {
      const whereClause = queryOptions.where || [];
      whereClause.push({
        field: "sellerId",
        operator: "==",
        value: filters.sellerId,
      });
      queryOptions.where = whereClause;
    }

    if (filters.limit) {
      queryOptions.limit = filters.limit;
    }

    return this.getAll("items", queryOptions);
  }

  /**
   * Update item
   * @param {string} itemId - Item ID
   * @param {object} itemData - Updated item data
   * @returns {Promise<void>}
   */
  async updateItem(itemId, itemData) {
    return this.update("items", itemId, itemData);
  }

  /**
   * Delete item
   * @param {string} itemId - Item ID
   * @returns {Promise<void>}
   */
  async deleteItem(itemId) {
    return this.delete("items", itemId);
  }

  /**
   * Get items by user (for user's listings)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of user's items
   */
  async getUserItems(userId) {
    return this.getItems({ sellerId: userId });
  }

  // ===========================
  // CATEGORY OPERATIONS
  // ===========================

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    return this.getAll("categories", {
      orderBy: { field: "name", direction: "asc" },
    });
  }

  // ===========================
  // REAL-TIME SUBSCRIPTIONS
  // ===========================

  /**
   * Subscribe to real-time updates for a collection
   * @param {string} collectionName - Name of the collection
   * @param {function} callback - Callback function for updates
   * @param {object} options - Query options
   * @returns {function} Unsubscribe function
   */
  subscribeToCollection(collectionName, callback, options = {}) {
    let q = collection(this.db, collectionName);

    if (options.where) {
      options.where.forEach((condition) => {
        q = query(
          q,
          where(condition.field, condition.operator, condition.value)
        );
      });
    }

    if (options.orderBy) {
      q = query(
        q,
        orderBy(options.orderBy.field, options.orderBy.direction || "asc")
      );
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(documents);
      },
      (error) => {
        console.error(
          `Error in real-time subscription for ${collectionName}:`,
          error
        );
      }
    );
  }

  /**
   * Subscribe to real-time updates for a specific document
   * @param {string} collectionName - Name of the collection
   * @param {string} docId - Document ID
   * @param {function} callback - Callback function for updates
   * @returns {function} Unsubscribe function
   */
  subscribeToDocument(collectionName, docId, callback) {
    const docRef = doc(this.db, collectionName, docId);

    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(
          `Error in real-time subscription for document ${docId}:`,
          error
        );
      }
    );
  }
}

// Create and export a singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
