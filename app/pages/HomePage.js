import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function HomePage({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to DoneWithIt!</Text>
        <Text style={styles.userText}>Hello, {user?.name || "User"}!</Text>
        <Text style={styles.userTypeText}>
          You are registered as:{" "}
          {user?.isEmployer() ? "Employer" : "Job Applicant"}
        </Text>

        <View style={styles.userTypeContainer}>
          {user?.isEmployer() ? (
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Employer Dashboard</Text>
              <Text style={styles.cardText}>
                Post job listings, review applications, and find the perfect
                candidates.
              </Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Job Seeker Dashboard</Text>
              <Text style={styles.cardText}>
                Browse job listings, apply for positions, and manage your
                applications.
              </Text>
            </View>
          )}
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: metrics.spacing.xl,
  },
  welcomeText: {
    fontSize: metrics.text.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.l,
    textAlign: "center",
  },
  userText: {
    fontSize: metrics.text.large,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.m,
    textAlign: "center",
  },
  userTypeText: {
    fontSize: metrics.text.regular,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: metrics.spacing.xl,
    textAlign: "center",
  },
  userTypeContainer: {
    width: "100%",
    maxWidth: 350,
    marginBottom: metrics.spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: metrics.borderRadius.m,
    padding: metrics.spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: metrics.text.large,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    textAlign: "center",
  },
  cardText: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: metrics.text.regular * 1.4,
  },
  button: {
    marginTop: metrics.spacing.l,
    width: "100%",
    maxWidth: 300,
  },
});

export default HomePage;
