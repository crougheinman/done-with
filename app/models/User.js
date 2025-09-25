/**
 * User model for standardizing user data structure and operations
 */

/**
 * User type enumeration
 */
export const UserType = {
  APPLICANT: "applicant",
  EMPLOYER: "employer",
};

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || "";
    this.password = data.password || ""; // Note: Only used during registration/login
    this.name = data.name || "";
    this.userType = data.userType || UserType.APPLICANT; // Default to applicant
    this.avatar = data.avatar || "";
    this.bio = data.bio || "";
    this.location = data.location || "";
    this.rating = data.rating || 0;
    this.totalSales = data.totalSales || 0;
    this.follower = data.follower || 0;
    this.following = data.following || 0;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Create User instance from Firestore document
   * @param {object} docData - Firestore document data
   * @param {string} docId - Firestore document ID
   * @returns {User} User instance
   */
  static fromFirestore(docData, docId) {
    return new User({
      id: docId,
      ...docData,
      // Convert Firestore Timestamps to Date objects if needed
      createdAt: docData.createdAt?.toDate?.() || docData.createdAt,
      updatedAt: docData.updatedAt?.toDate?.() || docData.updatedAt,
    });
  }

  /**
   * Convert User instance to Firestore document format
   * @returns {object} Firestore document data
   */
  toFirestore() {
    const data = {
      email: this.email,
      name: this.name,
      userType: this.userType,
      avatar: this.avatar,
      bio: this.bio,
      location: this.location,
      rating: this.rating,
      totalSales: this.totalSales,
    };

    // Only include password for new user creation
    if (this.password) {
      data.password = this.password;
    }

    // Include timestamps if they exist
    if (this.createdAt) {
      data.createdAt = this.createdAt;
    }
    if (this.updatedAt) {
      data.updatedAt = this.updatedAt;
    }

    return data;
  }

  /**
   * Get user data without sensitive information (for client-side use)
   * @returns {object} Sanitized user data
   */
  toPublicData() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      userType: this.userType,
      avatar: this.avatar,
      bio: this.bio,
      location: this.location,
      rating: this.rating,
      totalSales: this.totalSales,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get display name (name or email fallback)
   * @returns {string} Display name
   */
  getDisplayName() {
    return this.name || this.email || "Anonymous User";
  }

  /**
   * Get user initials for avatar fallback
   * @returns {string} User initials
   */
  getInitials() {
    if (this.name) {
      return this.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
    }
    return this.email.charAt(0).toUpperCase();
  }

  /**
   * Validate user data for registration
   * @returns {object} Validation result with isValid boolean and errors array
   */
  validateForRegistration() {
    const errors = [];

    if (!this.email || !this.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (!this.password || this.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (!this.name || this.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!this.userType || !Object.values(UserType).includes(this.userType)) {
      errors.push("Valid user type is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user data for login
   * @returns {object} Validation result
   */
  validateForLogin() {
    const errors = [];

    if (!this.email || !this.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (!this.password) {
      errors.push("Password is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if user has a profile picture
   * @returns {boolean} True if avatar exists
   */
  hasAvatar() {
    return !!(this.avatar && this.avatar.trim().length > 0);
  }

  /**
   * Update user rating (for future use)
   * @param {number} newRating - New rating value
   */
  updateRating(newRating) {
    if (newRating >= 0 && newRating <= 5) {
      this.rating = newRating;
      this.updatedAt = new Date();
    }
  }

  /**
   * Increment total sales
   */
  incrementSales() {
    this.totalSales += 1;
    this.updatedAt = new Date();
  }

  /**
   * Check if user is an applicant
   * @returns {boolean} True if user is an applicant
   */
  isApplicant() {
    return this.userType === UserType.APPLICANT;
  }

  /**
   * Check if user is an employer
   * @returns {boolean} True if user is an employer
   */
  isEmployer() {
    return this.userType === UserType.EMPLOYER;
  }

  /**
   * Get user type display name
   * @returns {string} Formatted user type
   */
  getUserTypeDisplay() {
    return this.userType === UserType.EMPLOYER ? "Employer" : "Applicant";
  }

  /**
   * Check if user is equal to another user (by ID or email)
   * @param {User|object} other - Other user to compare
   * @returns {boolean} True if users are equal
   */
  equals(other) {
    if (!other) return false;

    if (other instanceof User) {
      return this.id === other.id || this.email === other.email;
    }

    return this.id === other.id || this.email === other.email;
  }
}

export default User;
