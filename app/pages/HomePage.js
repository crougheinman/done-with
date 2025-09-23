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
    marginBottom: metrics.spacing.xl,
    textAlign: "center",
  },
  button: {
    marginTop: metrics.spacing.l,
    width: "100%",
    maxWidth: 300,
  },
});

export default HomePage;
