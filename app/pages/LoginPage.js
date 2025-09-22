import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log("Login attempted with:", { username, password });
  };

  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Image source={require("../../assets/icon.png")} style={styles.logo} />

        <View style={styles.form}>
          <TextInput
            style={[defaultStyles.input, styles.input]}
            placeholder="Phone number, username or email"
            placeholderTextColor={colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[defaultStyles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[defaultStyles.button, styles.button]}
            onPress={handleLogin}
          >
            <Text style={defaultStyles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.signupText}>Sign up</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: metrics.spacing.xl,
  },
  form: {
    width: "100%",
    gap: metrics.spacing.m,
  },
  input: {
    width: "100%",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50, // Space for the eye button
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  button: {
    marginTop: metrics.spacing.m,
    width: "100%",
  },
  forgotPassword: {
    alignItems: "center",
    padding: metrics.spacing.m,
  },
  forgotPasswordText: {
    color: colors.buttonSecondary,
    fontSize: metrics.text.regular,
  },
  footer: {
    position: "absolute",
    bottom: metrics.spacing.xl,
    padding: metrics.spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    color: colors.textPrimary,
    fontSize: metrics.text.regular,
  },
  signupText: {
    color: colors.buttonPrimary,
    fontWeight: metrics.fontWeight.semibold,
  },
});

export default LoginPage;
