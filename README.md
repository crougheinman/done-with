# DoneWithIt

A React Native marketplace app built with Expo, allowing users to buy and sell items they no longer need. The app follows an Instagram-inspired design system.

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

- Clean and modern UI design
- User authentication with session persistence
- Secure password handling
- Auto-login on app restart
- Responsive layout

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

For testing purposes, you can use any of these mock accounts:

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
