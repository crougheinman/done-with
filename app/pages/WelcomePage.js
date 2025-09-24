import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import metrics from "../theme/metrics";
import defaultStyles from "../theme/styles";

function WelcomePage({ navigation }) {
  return (
    <SafeAreaView style={[defaultStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={[defaultStyles.heading1, styles.title]}>DoneWithIt</Text>
        <Text style={[defaultStyles.bodyText, styles.subtitle]}>
          Buy and sell what you don't need
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[defaultStyles.button, styles.button]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={defaultStyles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.button, styles.buttonSecondary]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text
              style={[defaultStyles.buttonText, styles.buttonSecondaryText]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    padding: metrics.spacing.m,
    gap: metrics.spacing.m,
    position: "absolute",
    bottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f4f4",
    gap: 4,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#4a4a4a",
  },
});

export default WelcomePage;
