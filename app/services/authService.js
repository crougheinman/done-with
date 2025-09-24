import firestoreService from "./firestoreService.js";

// Login function that checks credentials against Firestore only
const login = async (email, password) => {
  try {
    // Check user exists in Firestore
    const user = await firestoreService.getUserByEmail(email);

    if (user && user.password === password) {
      // Remove password from the returned user object for security
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: "Invalid email or password" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
};

// Register a new user
const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await firestoreService.getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Create user in Firestore
    const userId = await firestoreService.createUser(userData);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = userData;
    return {
      success: true,
      user: { id: userId, ...userWithoutPassword },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
};

// Check if email exists (could be used for registration validation)
const isEmailTaken = async (email) => {
  try {
    const user = await firestoreService.getUserByEmail(email);
    return !!user;
  } catch (error) {
    console.error("Email check error:", error);
    return false;
  }
};

export default {
  login,
  register,
  isEmailTaken,
};
