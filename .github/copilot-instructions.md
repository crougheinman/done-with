# AI Agent Instructions for DoneWithIt

## Project Overview

DoneWithIt is a React Native job-seeking app using Expo, connecting job seekers with employers. The app follows an I### Data Model

### Firestore Collections

- **users**: `{email, name, password, userType, avatar, bio, location, rating, totalSales, ...}` - Authentication & profiles
- **jobs**: `{title, description, salary, company, location, ...}` - Job listings

**User Types:**

- `applicant`: Job seekers who browse and apply for jobs
- `employer`: Companies/individuals who post job listingsm-inspired design system with Firebase Firestore backend.

## Architecture

### Core Technologies

- React Native with Expo
- React Navigation (native stack)
- React Native Safe Area Context
- Firebase Firestore (NoSQL database)
- AsyncStorage (session persistence)

### Project Structure

```
app/
  ├── contexts/        # React Context providers
  │   └── AuthContext.js # Global auth state management
  ├── models/          # Data models and business logic
  │   └── User.js      # User model with validation and methods
  ├── pages/           # Screen components
  ├── services/        # Business logic & external APIs
  │   ├── authService.js     # Authentication logic
  │   ├── firestoreService.js # Firestore CRUD operations
  │   ├── firebase.js        # Firebase configuration
  │   └── dataSeeder.js      # Database seeding
  └── theme/           # Centralized theming system
      ├── colors.js    # Instagram-inspired color palette
      ├── metrics.js   # Spacing, typography, dimensions
      └── styles.js    # Shared component styles
```

## Key Development Patterns

### Authentication System

**Context-based auth with useReducer pattern:**

```javascript
import { useAuth } from "../contexts/AuthContext";

const { login, logout, user, isLoading, error } = useAuth();

// Login triggers state changes via dispatch
const result = await login(email, password);
```

**Service layer authentication:**

```javascript
// authService.js - Firestore-only authentication
const login = async (email, password) => {
  const user = await firestoreService.getUserByEmail(email);
  if (user && user.password === password) {
    return { success: true, user: userWithoutPassword };
  }
};
```

### Firebase Integration

**Firestore service class pattern:**

```javascript
// firestoreService.js - Generic CRUD wrapper
class FirestoreService {
  async create(collectionName, data) {
    const docRef = await addDoc(collection(this.db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }
}
```

**Environment-based configuration:**

```javascript
// firebase.js - Expo environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // ... other config
};
```

### Component Structure

**Standard page component pattern:**

```javascript
import { useAuth } from "../contexts/AuthContext";

function ComponentName({ navigation }) {
  const { user, login, isLoading } = useAuth();

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      {/* Component content */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: metrics.spacing.m },
});
```

**User type selection in SignUpPage:**

```javascript
// Toggle buttons for user type selection
<TouchableOpacity
  style={[
    styles.userTypeButton,
    userType === "applicant" && styles.activeUserType,
  ]}
  onPress={() => setUserType("applicant")}
>
  <Text style={styles.userTypeText}>Job Seeker</Text>
</TouchableOpacity>
```

**Role-based rendering in HomePage:**

```javascript
{
  user.isApplicant() ? (
    <InfoCard title="Browse Jobs" description="Find your next opportunity" />
  ) : (
    <InfoCard title="Post Jobs" description="Find the perfect candidate" />
  );
}
```

### User Model Pattern

**Always use the User model for user data:**

```javascript
import User from "../models/User";

// Create from Firestore data
const user = User.fromFirestore(firestoreData, docId);

// Create new user
const newUser = new User({
  email: "user@example.com",
  name: "User Name",
  password: "password123",
  userType: "applicant", // or "employer"
});

// Validate before operations
const validation = user.validateForRegistration();
if (!validation.isValid) {
  console.error(validation.errors);
}

// Get safe public data (no password)
const publicData = user.toPublicData();

// Use utility methods
console.log(user.getDisplayName()); // "User Name"
console.log(user.getInitials()); // "UN"
console.log(user.isApplicant()); // true/false
console.log(user.isEmployer()); // true/false
console.log(user.getUserTypeDisplay()); // "Job Seeker" or "Employer"
```

### Theme System

**Centralized styling with composition:**

```javascript
import { colors, metrics, defaultStyles } from "../theme";

// Combine global + local styles
<View style={[defaultStyles.container, styles.container]}>
```

## Development Workflow

### Essential Commands

```bash
npm start              # Start Expo dev server
npm run test-firebase  # Test Firebase connection
npm run seed          # Populate Firestore with sample data
```

### Database Seeding

**Seed script pattern:**

```javascript
// scripts/seed.js - Node.js seeding with ES modules
import dataSeeder from "../app/services/dataSeeder.js";

await dataSeeder.seedUsers();
await dataSeeder.seedJobs(); // Formerly seedItems
```

### Navigation Setup

**Stack navigator in App.js:**

```javascript
<Stack.Navigator initialRouteName="Welcome">
  <Stack.Screen name="Welcome" component={WelcomePage} />
  <Stack.Screen name="Login" component={LoginPage} />
  <Stack.Screen name="SignUp" component={SignUpPage} />
  <Stack.Screen name="Home" component={HomePage} />
</Stack.Navigator>
```

## Data Model

### Firestore Collections

- **users**: `{email, name, password, ...}` - Authentication & profiles
- **jobs**: `{title, description, salary, company, location, ...}` - Job listings
- **categories**: `{name, icon, description}` - Job categories

### Security Rules

**Authenticated access pattern:**

```javascript
// firestore.rules
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
match /jobs/{jobId} {
  allow read: if true;  // Public browsing
  allow create: if request.auth != null;
}
```

## Key Files

- `App.js`: Navigation setup & AuthProvider wrapper
- `app/contexts/AuthContext.js`: Global auth state with useReducer
- `app/models/User.js`: User data model with validation and utility methods (including userType support)
- `app/services/authService.js`: Login/register logic (Firestore-only)
- `app/services/firestoreService.js`: Generic Firestore CRUD operations
- `app/theme/styles.js`: Predefined component styles
- `app/pages/SignUpPage.js`: User registration with user type selection
- `app/pages/HomePage.js`: Role-based dashboard for applicants and employers
- `firestore.rules`: Database security rules
- `scripts/seed.js`: Database population script
