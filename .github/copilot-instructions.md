# AI Agent Instructions for DoneWithIt

## Project Overview

DoneWithIt is a React Native job-seeking app using Expo, connecting job seekers with employers. The app follows an Instagram-inspired design system with Firebase Firestore backend.

## Architecture

### Core Technologies

- React Native with Expo
- React Navigation v6 (Stack + Bottom Tabs)
- React Native Safe Area Context
- Firebase Firestore (NoSQL database)
- AsyncStorage (session persistence)
- Font Awesome icons (@fortawesome/react-native-fontawesome)

### Project Structure

```
app/
  ├── components/      # Reusable UI components
  │   └── ProtectedRoute.js # Route protection wrapper
  ├── contexts/        # React Context providers
  │   └── AuthContext.js # Global auth state management with automatic login
  ├── models/          # Data models and business logic
  │   ├── JobPostings.js # Job posting data model
  │   └── User.js      # User model with validation and methods
  ├── pages/           # Screen components
  │   ├── HomePage.js      # Legacy home page (replaced by tab navigation)
  │   ├── JobSearchScreen.js # Job feed with pagination
  │   ├── SavedJobsScreen.js # Saved jobs for applicants
  │   ├── ProfileScreen.js   # User profile with logout
  │   ├── LoginPage.js       # Authentication screen
  │   ├── SignUpPage.js      # User registration
  │   └── WelcomePage.js     # Onboarding screen
  ├── services/        # Business logic & external APIs
  │   ├── authService.js     # Authentication logic
  │   ├── firestoreService.js # Firestore CRUD operations with pagination
  │   ├── firebase.js        # Firebase configuration
  │   └── dataSeeder.js      # Database seeding
  └── theme/           # Centralized theming system
      ├── colors.js    # Instagram-inspired color palette
      ├── metrics.js   # Spacing, typography, dimensions
      └── styles.js    # Shared component styles
```

## Key Development Patterns

### Navigation System

**Tab-based navigation with Font Awesome icons and user type filtering:**

```javascript
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBriefcase,
  faHeart,
  faUser,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "JobSearch") {
            return (
              <FontAwesomeIcon icon={faBriefcase} size={size} color={color} />
            );
          } else if (route.name === "SavedJobs") {
            return <FontAwesomeIcon icon={faHeart} size={size} color={color} />;
          } else if (route.name === "MyJobPostings") {
            return (
              <FontAwesomeIcon icon={faBuilding} size={size} color={color} />
            );
          } else if (route.name === "Profile") {
            return <FontAwesomeIcon icon={faUser} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.secondary },
      })}
    >
      {/* Show different tabs based on user type */}
      {user?.isApplicant() ? (
        <>
          <Tab.Screen name="JobSearch" component={JobSearchScreen} />
          <Tab.Screen name="SavedJobs" component={SavedJobsScreen} />
        </>
      ) : user?.isEmployer() ? (
        <Tab.Screen name="MyJobPostings" component={MyJobPostingsScreen} />
      ) : null}

      {/* Profile tab always visible */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

**Authentication-based conditional navigation:**

```javascript
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />; // Show loading during session restoration
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
    >
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
```

### Authentication System

**Context-based auth with automatic session restoration:**

```javascript
import { useAuth } from "../contexts/AuthContext";

const { login, logout, user, isLoading, isAuthenticated } = useAuth();

// Automatic login on app start
useEffect(() => {
  restoreSession(); // Restores user from AsyncStorage
}, []);
```

**Session persistence with AsyncStorage:**

```javascript
const restoreSession = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  const userData = await AsyncStorage.getItem("user_data");

  if (token && userData) {
    const user = JSON.parse(userData);
    dispatch({ type: "RESTORE_SESSION", payload: { token, user } });
  }

  dispatch({ type: "SET_LOADING", payload: false }); // Always set loading to false
};
```

### Job Feed with Pagination

**Infinite scroll pagination pattern:**

```javascript
const [jobPostings, setJobPostings] = useState([]);
const [lastDoc, setLastDoc] = useState(null);
const [loadingMore, setLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);

const fetchJobPostings = async (loadMore = false) => {
  const options = {
    orderBy: { field: "createdAt", direction: "desc" },
    limit: PAGE_SIZE,
  };

  if (loadMore && lastDoc) {
    options.startAfter = lastDoc._docRef; // Use document reference for pagination
  }

  const jobData = await firestoreService.getAll("jobPostings", options);
  // ... process and append data
};
```

**FlatList with pagination:**

```javascript
<FlatList
  data={jobPostings}
  renderItem={renderJobCard}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={renderFooter}
  onRefresh={handleRefresh}
  refreshing={refreshing}
/>
```

### Firebase Integration

**Firestore service with pagination support:**

```javascript
// firestoreService.js - Generic CRUD with pagination
async getAll(collectionName, options = {}) {
  let q = collection(this.db, collectionName);

  if (options.orderBy) {
    q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
  }
  if (options.limit) {
    q = query(q, limit(options.limit));
  }
  if (options.startAfter) {
    q = query(q, startAfter(options.startAfter)); // Pagination cursor
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    _docRef: doc, // Store reference for next page
  }));
}
```

**JobPostings model pattern:**

```javascript
import JobPostings from "../models/JobPostings";

// Create from Firestore data
const job = JobPostings.fromFirestore(docData, docId);

// Convert to Firestore format
const firestoreData = job.toFirestore();
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

**Job card component pattern:**

```javascript
const renderJobCard = ({ item }) => (
  <View style={styles.jobCard}>
    {/* Header with company info */}
    <View style={styles.cardHeader}>
      <View style={styles.companyInfo}>
        <View style={styles.companyAvatar}>
          <Text style={styles.companyAvatarText}>
            {item.companyName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
        </View>
      </View>
    </View>

    {/* Job details */}
    <Text style={styles.jobTitle}>{item.jobTitle}</Text>
    <TouchableOpacity style={styles.applyButton}>
      <Text style={styles.applyButtonText}>Apply Now</Text>
    </TouchableOpacity>
  </View>
);
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

### User Model Pattern

**Always use the User model for user data:**

```javascript
import User, { UserType } from "../models/User";

// Create from Firestore data
const user = User.fromFirestore(firestoreData, docId);

// Create new user
const newUser = new User({
  email: "user@example.com",
  name: "User Name",
  password: "password123",
  userType: UserType.APPLICANT, // or UserType.EMPLOYER
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
console.log(user.getUserTypeDisplay()); // "Applicant" or "Employer"
```

**User Type Enum:**

```javascript
import { UserType } from "../models/User";

UserType.APPLICANT; // "applicant"
UserType.EMPLOYER;  // "employer"
```

### JobPostings Model Pattern

**Always use the JobPostings model for job data:**

```javascript
import JobPostings from "../models/JobPostings";

// Create from Firestore data
const job = JobPostings.fromFirestore(docData, docId);

// Create new job posting
const newJob = new JobPostings({
  jobTitle: "Software Engineer",
  companyName: "Tech Corp",
  location: "San Francisco, CA",
  employmentType: "Full-time",
  salary: "$120,000 - $150,000",
  skills: ["JavaScript", "React", "Node.js"],
});

// Convert to Firestore format
const firestoreData = job.toFirestore();
```

### Theme System

**Centralized styling with composition:**

```javascript
import { colors, metrics, defaultStyles } from "../theme";

// Combine global + local styles
<View style={[defaultStyles.container, styles.container]}>
```

**Instagram-inspired color palette:**

```javascript
// colors.js
export default {
  primary: "#E4405F", // Instagram pink
  secondary: "#FFFFFF", // White
  background: "#FAFAFA", // Light gray background
  textPrimary: "#262626", // Dark gray text
  textSecondary: "#8E8E8E", // Medium gray text
  border: "#DBDBDB", // Light border
  buttonPrimary: "#0095F6", // Instagram blue
};
```

## Development Workflow

### Essential Commands

```bash
npm start              # Start Expo dev server
npm run android        # Start on Android emulator
npm run ios            # Start on iOS simulator
npm run web            # Start in web browser
npm run seed           # Populate Firestore with sample data
npm run test-firebase  # Test Firebase connection
```

### Database Seeding

**Seed script pattern:**

```javascript
// scripts/seed.js - Node.js seeding with ES modules
import dataSeeder from "../app/services/dataSeeder.js";

await dataSeeder.seedUsers();
await dataSeeder.seedJobPostings(); // Updated collection name
```

### Navigation Setup

**Combined stack and tab navigation in App.js:**

```javascript
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tabs for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="JobSearch" component={JobSearchScreen} />
      <Tab.Screen name="SavedJobs" component={SavedJobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// App navigator with auth-based routing
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />; // Loading during session restoration
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
    >
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
```

## Data Model

### Firestore Collections

- **users**: `{email, name, password, userType, ...}` - Authentication & profiles
- **jobPostings**: `{jobTitle, companyName, location, employmentType, salary, skills, ...}` - Job listings

### Security Rules

**Authenticated access pattern:**

```javascript
// firestore.rules
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
match /jobPostings/{jobId} {
  allow read: if true;  // Public browsing
  allow create: if request.auth != null;
}
```

## Key Files

- `App.js`: Combined stack + tab navigation setup with user type-based tab filtering & AuthProvider wrapper
- `app/contexts/AuthContext.js`: Global auth state with automatic session restoration
- `app/models/User.js`: User data model with validation and utility methods
- `app/models/JobPostings.js`: Job posting data model with Firestore conversion
- `app/services/authService.js`: Login/register logic (Firestore-only)
- `app/services/firestoreService.js`: Generic Firestore CRUD with pagination support
- `app/pages/JobSearchScreen.js`: Job feed with infinite scroll pagination
- `app/pages/MyJobPostingsScreen.js`: Employer job postings management
- `app/pages/ProfileScreen.js`: User profile with logout functionality
- `app/pages/SavedJobsScreen.js`: Saved jobs for applicants
- `app/theme/styles.js`: Predefined component styles
- `firestore.rules`: Database security rules
- `scripts/seed-jobs.js`: Job posting database population script
