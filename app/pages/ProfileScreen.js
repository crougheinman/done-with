import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email || ""}</Text>
            <Text style={styles.userType}>
              {user?.userType === "employer" ? "Employer" : "Job Seeker"}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.rating || 0}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.totalSales || 0}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
        </View>

        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderText}>
            Profile settings, edit profile, account preferences, and other user
            management features will be available here.
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
  profileCard: {
    backgroundColor: colors.feedBackground,
    borderRadius: metrics.borderRadius.m,
    padding: metrics.spacing.l,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: metrics.spacing.xl,
    width: "100%",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: metrics.spacing.m,
  },
  avatarText: {
    fontSize: metrics.text.h1,
    fontWeight: "bold",
    color: colors.secondary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: metrics.text.h2,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  userEmail: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xs,
  },
  userType: {
    fontSize: metrics.text.small,
    color: colors.primary,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: metrics.spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: metrics.text.h1,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
    marginTop: metrics.spacing.xs,
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

export default ProfileScreen;
