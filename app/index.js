import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Firebase App</Text>
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e40af",
  },
});
