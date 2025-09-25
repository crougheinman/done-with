import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import firestoreService from "../services/firestoreService";
import JobPostings from "../models/JobPostings";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function JobSearchScreen({ navigation }) {
  const { user } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const options = {
        orderBy: { field: "createdAt", direction: "desc" },
        limit: PAGE_SIZE,
      };

      // Add pagination cursor for loading more
      if (loadMore && lastDoc) {
        options.startAfter = lastDoc._docRef;
      }

      const jobData = await firestoreService.getAll("jobPostings", options);
      const jobInstances = jobData.map((job) =>
        JobPostings.fromFirestore(job, job.id)
      );

      if (loadMore) {
        setJobPostings((prev) => [...prev, ...jobInstances]);
      } else {
        setJobPostings(jobInstances);
      }

      if (jobData.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (jobData.length > 0) {
        setLastDoc(jobData[jobData.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching job postings:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setLastDoc(null);
    fetchJobPostings();
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchJobPostings(true);
    }
  };

  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.companyInfo}
          onPress={() => {
            console.log(
              "Company pressed:",
              item.companyName,
              "employerId:",
              item.employerId
            );
            if (item.employerId) {
              navigation.navigate("PublicProfile", { userId: item.employerId });
            } else {
              console.log("No employerId found for company:", item.companyName);
            }
          }}
        >
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>
              {item.companyName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.companyName}>{item.companyName}</Text>
            <Text style={styles.jobLocation}>{item.location}</Text>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.jobMeta}>
          <Text style={styles.postedDate}>
            {item.postedDate
              ? new Date(item.postedDate).toLocaleDateString()
              : "Recently"}
          </Text>
        </View>
      </View>

      {/* Job Title */}
      <Text style={styles.jobTitle}>{item.jobTitle}</Text>

      {/* Job Details */}
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{item.employmentType}</Text>
        </View>
        {item.workSetup && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Work Setup:</Text>
            <Text style={styles.detailValue}>{item.workSetup}</Text>
          </View>
        )}
        {item.salary && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salary:</Text>
            <Text style={styles.detailValue}>{item.salary}</Text>
          </View>
        )}
      </View>

      {/* Skills */}
      {item.skills && item.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          <Text style={styles.sectionTitle}>Skills Required:</Text>
          <View style={styles.skillsList}>
            {item.skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {item.skills.length > 3 && (
              <Text style={styles.moreSkills}>
                +{item.skills.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more jobs...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[defaultStyles.container, styles.container]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading job postings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Search</Text>
        <Text style={styles.subtitle}>Find your next opportunity</Text>
      </View>

      <FlatList
        data={jobPostings}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.feedContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No job postings available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: metrics.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: metrics.text.h1,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
  },
  feedContainer: {
    padding: metrics.spacing.m,
  },
  jobCard: {
    backgroundColor: colors.secondary,
    borderRadius: metrics.borderRadius.m,
    padding: metrics.spacing.l,
    marginBottom: metrics.spacing.m,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: metrics.spacing.m,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  companyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: metrics.spacing.m,
  },
  companyAvatarText: {
    color: colors.secondary,
    fontSize: metrics.text.regular,
    fontWeight: "bold",
  },
  companyName: {
    fontSize: metrics.text.regular,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  viewProfileText: {
    fontSize: metrics.text.small,
    color: colors.primary,
    fontWeight: "500",
  },
  jobLocation: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
  },
  jobMeta: {
    alignItems: "flex-end",
  },
  postedDate: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
  },
  jobTitle: {
    fontSize: metrics.text.h2,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
    lineHeight: 24,
  },
  jobDetails: {
    marginBottom: metrics.spacing.m,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: metrics.spacing.xs,
  },
  detailLabel: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
    fontWeight: "600",
    minWidth: 80,
  },
  detailValue: {
    fontSize: metrics.text.small,
    color: colors.textPrimary,
    flex: 1,
  },
  skillsContainer: {
    marginBottom: metrics.spacing.m,
  },
  sectionTitle: {
    fontSize: metrics.text.regular,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillTag: {
    backgroundColor: colors.feedBackground,
    paddingHorizontal: metrics.spacing.s,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.borderRadius.s,
    marginRight: metrics.spacing.xs,
    marginBottom: metrics.spacing.xs,
  },
  skillText: {
    fontSize: metrics.text.small,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  moreSkills: {
    fontSize: metrics.text.small,
    color: colors.textSecondary,
    fontStyle: "italic",
    marginTop: metrics.spacing.xs,
  },
  applyButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: metrics.spacing.m,
    borderRadius: metrics.borderRadius.s,
    alignItems: "center",
    marginTop: metrics.spacing.m,
  },
  applyButtonText: {
    color: colors.secondary,
    fontSize: metrics.text.regular,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: metrics.spacing.m,
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
  },
  footerLoader: {
    paddingVertical: metrics.spacing.l,
    alignItems: "center",
  },
  footerText: {
    marginTop: metrics.spacing.s,
    fontSize: metrics.text.small,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: metrics.spacing.xl,
  },
  emptyText: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default JobSearchScreen;
