import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import firestoreService from "../services/firestoreService";
import User from "../models/User";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function PublicProfileScreen({ navigation, route }) {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from route params
  const userId = route?.params?.userId;

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await firestoreService.read("users", userId);
      if (userData) {
        const user = User.fromFirestore(userData, userId);
        setProfileUser(user);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioPress = () => {
    if (profileUser?.portfolioLink) {
      Linking.openURL(profileUser.portfolioLink).catch(() => {
        Alert.alert("Error", "Unable to open portfolio link");
      });
    }
  };

  const formatAddress = (addressDetails) => {
    if (!addressDetails) return "Not specified";

    const parts = [];
    if (addressDetails.baranggay) parts.push(addressDetails.baranggay);
    if (addressDetails.city) parts.push(addressDetails.city);
    if (addressDetails.province) parts.push(addressDetails.province);

    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  if (loading) {
    return (
      <SafeAreaView style={[defaultStyles.container, styles.container]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profileUser) {
    return (
      <SafeAreaView style={[defaultStyles.container, styles.container]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Profile not found"}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("ProfileEdit")}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profileUser.name
                ? profileUser.name.charAt(0).toUpperCase()
                : "U"}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {profileUser.name || "Anonymous User"}
            </Text>
            <Text style={styles.userEmail}>{profileUser.email}</Text>
            <Text style={styles.userType}>
              {profileUser.getUserTypeDisplay()}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.follower || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.totalSales || 0}</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          {profileUser.bio ? (
            <Text style={styles.bioText}>{profileUser.bio}</Text>
          ) : (
            <Text style={styles.placeholderText}>No bio available</Text>
          )}
        </View>

        {/* Education */}
        {profileUser.degree && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.infoText}>{profileUser.degree}</Text>
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>
              {profileUser.getAge()
                ? `${profileUser.getAge()} years old`
                : "Not specified"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>
              {profileUser.gender || "Not specified"}
            </Text>
          </View>

          {profileUser.portfolioLink && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Portfolio:</Text>
              <TouchableOpacity onPress={handlePortfolioPress}>
                <Text style={styles.portfolioLink}>
                  {profileUser.portfolioLink}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.infoText}>
            {formatAddress(profileUser.addressDetails)}
          </Text>
        </View>

        {/* Rating */}
        {profileUser.rating > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐ {profileUser.rating.toFixed(1)} / 5.0
              </Text>
            </View>
          </View>
        )}

        {/* Contact Actions (for other users) */}
        {!isOwnProfile && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>
                Contact {profileUser.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: metrics.spacing.l,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: "center",
    marginBottom: metrics.spacing.l,
  },
  backButton: {
    padding: metrics.spacing.s,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.s,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.xs,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  profileHeader: {
    alignItems: "center",
    padding: metrics.spacing.l,
    backgroundColor: colors.secondary,
    marginHorizontal: metrics.spacing.m,
    marginTop: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: metrics.spacing.m,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.secondary,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: metrics.text.h1,
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
    backgroundColor: colors.primary + "20",
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.borderRadius.s,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: metrics.spacing.m,
    backgroundColor: colors.secondary,
    marginHorizontal: metrics.spacing.m,
    marginTop: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
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
  section: {
    backgroundColor: colors.secondary,
    marginHorizontal: metrics.spacing.m,
    marginTop: metrics.spacing.m,
    padding: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
  },
  bioText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  infoText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: metrics.spacing.s,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  portfolioLink: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: metrics.spacing.m,
    paddingHorizontal: metrics.spacing.l,
    borderRadius: metrics.borderRadius.m,
    alignItems: "center",
  },
  contactButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  securityNotice: {
    backgroundColor: colors.primary + "15",
    marginHorizontal: metrics.spacing.m,
    marginTop: metrics.spacing.m,
    padding: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  securityNoticeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PublicProfileScreen;
