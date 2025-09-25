# DoneWithIt

A React Native job-seeking app built with Expo, connecting job seekers with employers. The app follows an Instagram-inspired design system.

## Design System

### Instagram-Inspired Theme

DoneWithIt features a clean, modern design inspired by Instagram's aesthetic:

- **Color Palette**: Instagram-inspired colors with carefully chosen primary, secondary, and accent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing system using metrics for padding, margins, and layout
- **Components**: Reusable UI components following Instagram's design patterns
- **User Experience**: Intuitive navigation and interactions similar to popular social platforms

### Theme Architecture

The design system is built with modularity in mind:

```
app/theme/
  ├── colors.js   # Instagram-inspired color palette
  ├── metrics.js  # Spacing, typography, and dimension constants
  └── styles.js   # Shared component styles and utilities
```

## Features

- **User Authentication**: Complete login and sign-up system with Firebase
- **Session Management**: Persistent login state with AsyncStorage
- **Form Validation**: Client-side validation for all user inputs
- **Real-time Database**: Firestore integration for user profiles and job listings
- **Instagram-inspired UI**: Clean, modern design with consistent theming
- **Cross-platform**: Built with React Native and Expo for iOS and Android

### Authentication Features

- **Sign Up**: User registration with email/password validation
- **Login**: Secure authentication with session persistence
- **Auto-login**: Automatic session restoration on app restart
- **Password Security**: Minimum length requirements and confirmation matching
- **Error Handling**: User-friendly error messages for all scenarios

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for building)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/crougheinman/done-with.git
cd DoneWithIt
```

2. Install dependencies:

```bash
npm install
```

## Firebase Setup

DoneWithIt uses Firebase Firestore as its database backend for scalable, real-time job data management.

### Prerequisites

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Get your Firebase configuration from Project Settings

### Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual Firebase configuration values from your Firebase project settings

3. **Set up Firestore Security Rules** (Important!):

   - Go to Firebase Console → Firestore Database → Rules
   - Replace the default rules with the content from `firestore.rules` in your project root
   - Click "Publish"

4. **Enable Authentication** (if not already enabled):
   - Go to Firebase Console → Authentication → Get started
   - Enable "Email/Password" sign-in method

### Database Seeding

To populate your Firestore database with sample data:

```bash
npm run seed
```

Or run the seeder directly:

```javascript
import dataSeeder from "./app/services/dataSeeder";

// Seed all initial data
await dataSeeder.seedAll();

// Or seed specific data types
await dataSeeder.seedCategories();
await dataSeeder.seedUsers();
await dataSeeder.seedJobs();
```

### Testing Firebase Connection

To test your Firebase setup:

```bash
npm run test-firebase
```

This will verify:

- Firebase configuration is correct
- Firestore connection works
- Security rules allow necessary operations

## Troubleshooting

### Common Firebase Issues

**"Missing or insufficient permissions"**

- **Cause**: Firestore security rules are blocking access
- **Solution**: Copy `firestore.rules` content to Firebase Console → Firestore → Rules

**"Firebase: Error (auth/invalid-api-key)"**

- **Cause**: Incorrect API key in `.env` file
- **Solution**: Double-check Firebase config values in Firebase Console

**"Firebase: No Firebase App '[DEFAULT]' has been created"**

- **Cause**: Environment variables not loaded
- **Solution**: Restart the app and ensure `.env` file exists

**Seeding fails with permission errors**

- **Cause**: Security rules don't allow writes during seeding
- **Solution**: Temporarily allow all writes in Firestore rules, then restore proper rules

### Firebase Security Rules Template

For development/testing, you can use permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

**⚠️ WARNING**: Never use permissive rules in production!

### Database Architecture

DoneWithIt uses the following Firestore collections:

- **users**: User profiles and authentication data
- **jobs**: Job listings with details, requirements, and company information
- **categories**: Job categories for organization

### Security Rules

The app includes Firestore security rules (`firestore.rules`) that provide:

- **Public read access** to jobs and categories (for job browsing)
- **Authenticated user access** to user profiles and posted jobs
- **Secure data isolation** preventing users from modifying others' data

**To apply security rules:**

1. Copy the content from `firestore.rules` in your project root
2. Go to Firebase Console → Firestore Database → Rules tab
3. Paste and publish the rules

#### Sample Data Structure

**Users Collection:**

```json
{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "bio": "Tech enthusiast...",
  "location": "New York, NY",
  "rating": 4.8,
  "totalSales": 15,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Jobs Collection:**

```json
{
  "title": "Senior React Native Developer",
  "description": "We are looking for an experienced React Native developer...",
  "salary": 120000,
  "category": "Technology",
  "type": "Full-time",
  "location": "New York, NY",
  "company": "TechCorp Inc.",
  "requirements": ["React Native", "JavaScript", "3+ years experience"],
  "posterId": "user_id",
  "status": "active",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Development

To start the development server:

```bash
npm start
```

This will start the Expo development server and provide you with options to:

- Run on Android device/emulator
- Run on iOS simulator (macOS only)
- Run in web browser

## Building the App

### Prerequisites for Building

1. Create an [Expo account](https://expo.dev/signup) if you haven't already
2. Log in to your Expo account:

```bash
eas login
```

### Building for Development

1. For Android development build (APK):

```bash
eas build -p android --profile development
```

2. For iOS development build (requires Apple Developer account):

```bash
eas build -p ios --profile development
```

### Building for Production

To build for both platforms:

```bash
eas build --platform all
```

Or build for specific platform:

- Android: `eas build -p android`
- iOS: `eas build -p ios`

## Project Structure

```
app/
  ├── pages/           # Screen components
  │   ├── WelcomePage.js
  │   └── LoginPage.js
  ├── components/      # Reusable components
  ├── services/        # Business logic and API services
  │   └── authService.js
  └── theme/          # Centralized theming system
      ├── colors.js   # Color palette
      ├── metrics.js  # Spacing, typography, dimensions
      └── styles.js   # Shared style components
```

## Features

- Clean and modern UI design inspired by Instagram
- User authentication with session persistence (Login & Sign Up)
- Secure password handling with client-side validation
- Auto-login on app restart
- Job-seeking functionality with Firestore database
- Responsive layout with custom theming system

## Authentication System

The app uses a robust authentication system with the following components:

### State Management

- **React Context API** for global auth state
- **AsyncStorage** for session persistence
- **useReducer** for complex state management

### Key Features

- Automatic session restoration on app launch
- Secure token-based authentication
- Loading states and error handling
- Protected routes (ready for implementation)

## Testing Credentials

**Note**: Authentication now uses Firebase Firestore. You must register users through the app or seed the database with sample users.

To create test users, you can:

1. Register through the app's Sign Up screen, or
2. Use the data seeder: `npm run seed` (creates sample users in Firestore)

### Sample Test Users (after running seeder)

1. Email: john.doe@example.com
   Password: password123

2. Email: jane.smith@example.com
   Password: securepass456

3. Email: mike.wilson@example.com
   Password: mikepass789

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Plugin Error with Google Sign-In**
   If you see an error about `@react-native-google-signin/google-signin`, ensure you've installed the package:

   ```bash
   npm install @react-native-google-signin/google-signin
   ```

2. **Build Errors**
   - Make sure you're logged in to EAS: `eas login`
   - Verify your `eas.json` configuration
   - Check that all dependencies are installed: `npm install`

For more help, please [open an issue](https://github.com/crougheinman/done-with/issues)

App features

Users
Profile
Edit
Overview
Title
Full-time
Part-time
Expected Salary - per hour
Basic Information
Date of Birth(Age)
Gender
Porfolio/ Website Link
Address
Educational Background
Employment History
Account Settings

Skills
Skill Name
Proficiency (P1 - P5)
Years of Experience

Job
Job Searching
Job Feed
Saved Jobs
Job Applications
