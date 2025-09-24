import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBriefcase,
  faUser,
  faHeart,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { AuthProvider, useAuth } from "./app/contexts/AuthContext";
import WelcomePage from "./app/pages/WelcomePage";
import LoginPage from "./app/pages/LoginPage";
import SignUpPage from "./app/pages/SignUpPage";
import JobSearchScreen from "./app/pages/JobSearchScreen";
import ProfileScreen from "./app/pages/ProfileScreen";
import SavedJobsScreen from "./app/pages/SavedJobsScreen";
import MyJobPostingsScreen from "./app/pages/MyJobPostingsScreen";
import colors from "./app/theme/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main app tabs for authenticated users
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
          return null;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom + 5, // Add safe area bottom inset
          paddingTop: 5,
          height: 60 + insets.bottom, // Add safe area to height
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      {/* Show different tabs based on user type */}
      {user?.isApplicant() ? (
        <>
          <Tab.Screen
            name="JobSearch"
            component={JobSearchScreen}
            options={{
              title: "Job Search",
            }}
          />
          <Tab.Screen
            name="SavedJobs"
            component={SavedJobsScreen}
            options={{
              title: "Saved",
            }}
          />
        </>
      ) : user?.isEmployer() ? (
        <Tab.Screen
          name="MyJobPostings"
          component={MyJobPostingsScreen}
          options={{
            title: "My Jobs",
          }}
        />
      ) : null}

      {/* Profile tab always visible */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

// App Navigator that handles authentication-based routing
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
