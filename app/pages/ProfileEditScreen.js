import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../contexts/AuthContext";
import firestoreService from "../services/firestoreService";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function ProfileEditScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    degree: user?.degree || "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
    gender: user?.gender || "",
    portfolioLink: user?.portfolioLink || "",
    province: user?.addressDetails?.province || "",
    city: user?.addressDetails?.city || "",
    baranggay: user?.addressDetails?.baranggay || "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.portfolioLink && !isValidUrl(formData.portfolioLink)) {
      newErrors.portfolioLink = "Please enter a valid URL";
    }

    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 16 || age > 100) {
        newErrors.dateOfBirth = "Age must be between 16 and 100 years";
      }
    }

    const validGenders = ["Male", "Female", "Other"];
    if (formData.gender && !validGenders.includes(formData.gender)) {
      newErrors.gender = "Please select a valid gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleInputChange("dateOfBirth", selectedDate);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again.");
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        degree: formData.degree.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        portfolioLink: formData.portfolioLink.trim(),
        addressDetails: {
          province: formData.province.trim(),
          city: formData.city.trim(),
          baranggay: formData.baranggay.trim(),
        },
        updatedAt: new Date(),
      };

      // Update in Firestore
      await firestoreService.update("users", user.id, updatedData);

      // Update local user state
      const updatedUser = {
        ...user,
        ...updatedData,
      };
      updateUser(updatedUser);

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ["Male", "Female", "Other"];

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text
            style={[
              styles.saveButtonText,
              loading && styles.saveButtonTextDisabled,
            ]}
          >
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter your full name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(value) => handleInputChange("bio", value)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Education */}
          <Text style={styles.sectionTitle}>Education</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Degree</Text>
            <TextInput
              style={styles.input}
              value={formData.degree}
              onChangeText={(value) => handleInputChange("degree", value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </View>

          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={
                  formData.dateOfBirth
                    ? styles.dateText
                    : styles.placeholderText
                }
              >
                {formData.dateOfBirth
                  ? formData.dateOfBirth.toLocaleDateString()
                  : "Select date of birth"}
              </Text>
            </TouchableOpacity>
            {formData.dateOfBirth && (
              <Text style={styles.ageText}>
                Age: {calculateAge(formData.dateOfBirth)} years old
              </Text>
            )}
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    formData.gender === option && styles.genderOptionSelected,
                  ]}
                  onPress={() => handleInputChange("gender", option)}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      formData.gender === option &&
                        styles.genderOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Portfolio Link</Text>
            <TextInput
              style={[styles.input, errors.portfolioLink && styles.inputError]}
              value={formData.portfolioLink}
              onChangeText={(value) =>
                handleInputChange("portfolioLink", value)
              }
              placeholder="https://your-portfolio.com"
              keyboardType="url"
              autoCapitalize="none"
            />
            {errors.portfolioLink && (
              <Text style={styles.errorText}>{errors.portfolioLink}</Text>
            )}
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Province</Text>
            <TextInput
              style={styles.input}
              value={formData.province}
              onChangeText={(value) => handleInputChange("province", value)}
              placeholder="Enter province"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
              placeholder="Enter city"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Baranggay</Text>
            <TextInput
              style={styles.input}
              value={formData.baranggay}
              onChangeText={(value) => handleInputChange("baranggay", value)}
              placeholder="Enter baranggay"
            />
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: metrics.spacing.xs,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.xs,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  saveButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: metrics.spacing.m,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: metrics.spacing.l,
    marginBottom: metrics.spacing.m,
  },
  inputGroup: {
    marginBottom: metrics.spacing.m,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: metrics.spacing.m,
    fontSize: 16,
    backgroundColor: colors.secondary,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  ageText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: metrics.spacing.xs,
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: metrics.spacing.xs,
  },
  genderContainer: {
    flexDirection: "row",
    gap: metrics.spacing.s,
  },
  genderOption: {
    flex: 1,
    padding: metrics.spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  genderOptionTextSelected: {
    color: colors.secondary,
    fontWeight: "600",
  },
});

export default ProfileEditScreen;
