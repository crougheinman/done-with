import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function SavedJobsScreen({ navigation }) {
  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.title}>Saved Jobs</Text>
        <Text style={styles.subtitle}>Your favorite job listings</Text>

        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderText}>
            Saved jobs will appear here. Save jobs you're interested in to
            access them quickly later.
          </Text>
        </View>
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
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
    textAlign: "center",
  },
  placeholderContent: {
    backgroundColor: colors.feedBackground,
    padding: metrics.spacing.l,
    borderRadius: metrics.borderRadius.m,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default SavedJobsScreen;
