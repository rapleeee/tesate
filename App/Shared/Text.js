import { Text as RNText, StyleSheet } from "react-native";
import React from "react";

const Text = ({ style, children, ...props }) => {
  return (
    <RNText style={[styles.text, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "DMSans-Regular", // Pastikan font ini sudah di-load
    color: "#000", // Default warna teks
  },
});

export default Text;
