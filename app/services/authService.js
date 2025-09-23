// Mock user accounts for testing
const users = [
  {
    id: 1,
    email: "john.doe@example.com",
    password: "password123",
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    password: "securepass456",
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    email: "mike.wilson@example.com",
    password: "mikepass789",
    name: "Mike Wilson",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 4,
    email: "sarah.brown@example.com",
    password: "sarah2023",
    name: "Sarah Brown",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 5,
    email: "alex.chen@example.com",
    password: "alexpass321",
    name: "Alex Chen",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

// Login function that checks if the provided credentials match any user
const login = (email, password) => {
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // Remove password from the returned user object for security
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
};

// Check if email exists (could be used for registration validation)
const isEmailTaken = (email) => {
  return users.some((user) => user.email === email);
};

export default {
  login,
  isEmailTaken,
};
