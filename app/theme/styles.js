import { StyleSheet } from "react-native";
import colors from "./colors";
import metrics from "./metrics";

export default StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Screen styles
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: metrics.spacing.m,
  },

  // Text styles
  heading1: {
    fontSize: metrics.text.h1,
    fontWeight: metrics.fontWeight.bold,
    color: colors.textPrimary,
  },
  heading2: {
    fontSize: metrics.text.h2,
    fontWeight: metrics.fontWeight.bold,
    color: colors.textPrimary,
  },
  bodyText: {
    fontSize: metrics.text.regular,
    color: colors.textPrimary,
  },

  // Button styles
  button: {
    backgroundColor: colors.buttonPrimary,
    padding: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.secondary,
    fontSize: metrics.text.regular,
    fontWeight: metrics.fontWeight.semibold,
  },

  // Input styles
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.borderRadius.s,
    paddingHorizontal: metrics.spacing.m,
    fontSize: metrics.text.regular,
    color: colors.textPrimary,
    backgroundColor: colors.feedBackground,
  },

  // Card styles
  card: {
    backgroundColor: colors.secondary,
    borderRadius: metrics.borderRadius.m,
    padding: metrics.spacing.m,
    marginVertical: metrics.spacing.s,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // List styles
  listSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: metrics.spacing.s,
  },

  // Image styles
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
});
