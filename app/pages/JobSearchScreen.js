import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function JobSearchScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.title}>Job Search</Text>
        <Text style={styles.subtitle}>Find your next opportunity</Text>

        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.name || "User"}!
          </Text>
          <Text style={styles.userTypeText}>
            You are registered as:{" "}
            {user?.userType === "employer" ? "Employer" : "Job Seeker"}
          </Text>
        </View>

        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderText}>
            Job listings will appear here. Browse available positions, apply to
            jobs, and track your applications.
          </Text>
        </View>

        <TouchableOpacity
          style={[defaultStyles.button, styles.button]}
          onPress={handleLogout}
        >
          <Text style={defaultStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.m,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: metrics.text.h1,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  subtitle: {
    fontSize: metrics.text.h2,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
    textAlign: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: metrics.spacing.xl,
  },
  welcomeText: {
    fontSize: metrics.text.regular,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  userTypeText: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
  },
  placeholderContent: {
    backgroundColor: colors.feedBackground,
    padding: metrics.spacing.l,
    borderRadius: metrics.borderRadius.m,
    marginBottom: metrics.spacing.xl,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: metrics.spacing.l,
  },
});

export default JobSearchScreen;
