# AI Agent Instructions for DoneWithIt

## Project Overview

DoneWithIt is a React Native marketplace app using Expo, allowing users to buy and sell items they no longer need. The app follows an Instagram-inspired design system.

## Architecture

### Core Technologies

- React Native with Expo
- React Navigation for routing
- React Native Safe Area Context for layout management

### Project Structure

```
app/
  ├── pages/           # Screen components
  │   ├── WelcomePage.js
  │   └── LoginPage.js
  └── theme/          # Centralized theming system
      ├── colors.js   # Color palette
      ├── metrics.js  # Spacing, typography, dimensions
      └── styles.js   # Shared style components
```

## Key Development Patterns

### Theme System

The app uses a centralized theming system in `app/theme/`:

- Import theme components: `import { colors, metrics, defaultStyles } from '../theme'`
- Combine global and local styles:

```javascript
style={[defaultStyles.container, styles.container]}
```

### Navigation

Navigation uses React Navigation's native stack:

```javascript
// Adding new screens:
<Stack.Navigator>
  <Stack.Screen name="ScreenName" component={ScreenComponent} />
</Stack.Navigator>;

// Navigation in components:
navigation.navigate("ScreenName");
```

### Component Structure

Components follow this pattern:

1. Import dependencies
2. Define functional component
3. Define local styles
4. Export component

Example from `WelcomePage.js`:

```javascript
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, metrics, defaultStyles } from "../theme";

function ComponentName({ navigation }) {
  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      {/* Component content */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Local styles
});

export default ComponentName;
```

## Development Workflow

### Setup

```bash
npm install        # Install dependencies
npm start         # Start Expo development server
```

### Common Tasks

- Add new screen: Create component in `app/pages/`, add to navigator in `App.js`
- Style components: Use theme system from `app/theme/`
- Handle safe areas: Wrap root component with `SafeAreaView`
- Form inputs: Follow `LoginPage.js` pattern with controlled components

## Key Files

- `App.js`: Navigation setup and root configuration
- `app/theme/styles.js`: Common component styles
- `app/theme/colors.js`: Color palette (Instagram-inspired)
- `app/theme/metrics.js`: Layout constants and typography
