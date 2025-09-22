import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,

  // Typography
  text: {
    h1: 22,
    h2: 20,
    h3: 18,
    h4: 16,
    regular: 14,
    small: 12,
    tiny: 10,
  },

  // Spacing
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },

  // Border radius
  borderRadius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    full: 9999,
  },

  // Font weights
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "800",
  },
};
