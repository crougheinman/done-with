import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";
import authService from "../services/authService";

function SignUpPage({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "applicant", // Default to applicant
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      !formData.userType ||
      !["applicant", "employer"].includes(formData.userType)
    ) {
      newErrors.userType = "Please select a user type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.register({
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        userType: formData.userType,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.fullName
        )}&background=random`,
        bio: "",
        location: "",
        rating: 0,
        totalSales: 0,
      });

      if (result.success) {
        Alert.alert("Success!", "Your account has been created successfully!", [
          {
            text: "Continue",
            onPress: () => navigation.navigate("MainTabs"),
          },
        ]);
        // Clear form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        Alert.alert("Registration Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join DoneWithIt and start selling!
            </Text>
          </View>

          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  defaultStyles.input,
                  styles.input,
                  errors.fullName && styles.inputError,
                ]}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  defaultStyles.input,
                  styles.input,
                  errors.email && styles.inputError,
                ]}
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  defaultStyles.input,
                  styles.input,
                  errors.password && styles.inputError,
                ]}
                placeholder="Password (min 6 characters)"
                placeholderTextColor={colors.textSecondary}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  defaultStyles.input,
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* User Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>I am a:</Text>
              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === "applicant" &&
                      styles.userTypeButtonActive,
                  ]}
                  onPress={() => handleInputChange("userType", "applicant")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === "applicant" &&
                        styles.userTypeButtonTextActive,
                    ]}
                  >
                    Job Applicant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === "employer" &&
                      styles.userTypeButtonActive,
                  ]}
                  onPress={() => handleInputChange("userType", "employer")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === "employer" &&
                        styles.userTypeButtonTextActive,
                    ]}
                  >
                    Employer
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.userType && (
                <Text style={styles.errorText}>{errors.userType}</Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                defaultStyles.button,
                styles.button,
                isLoading && { opacity: 0.7 },
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={defaultStyles.buttonText}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={navigateToLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginTextBold}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: metrics.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: metrics.spacing.xl,
  },
  title: {
    fontSize: metrics.text.xxl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  subtitle: {
    fontSize: metrics.text.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: metrics.spacing.m,
  },
  inputGroup: {
    width: "100%",
  },
  input: {
    width: "100%",
  },
  inputError: {
    borderColor: colors.error || "#e74c3c",
    borderWidth: 1,
  },
  errorText: {
    color: colors.error || "#e74c3c",
    fontSize: metrics.text.small,
    marginTop: metrics.spacing.xs,
    marginLeft: metrics.spacing.xs,
  },
  button: {
    marginTop: metrics.spacing.m,
    width: "100%",
  },
  loginLink: {
    alignItems: "center",
    padding: metrics.spacing.m,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: metrics.text.regular,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: "bold",
  },
  label: {
    fontSize: metrics.text.regular,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  userTypeContainer: {
    flexDirection: "row",
    gap: metrics.spacing.m,
  },
  userTypeButton: {
    flex: 1,
    padding: metrics.spacing.m,
    borderRadius: metrics.borderRadius.m,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  userTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight || colors.primary + "20",
  },
  userTypeButtonText: {
    fontSize: metrics.text.regular,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  userTypeButtonTextActive: {
    color: colors.primary,
  },
});

export default SignUpPage;
