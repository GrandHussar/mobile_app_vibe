import React from "react";
import { View, Text, Button, StyleSheet, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "@/authService";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    Alert.alert("El Psy Congroo", "You have been logged out.");
    router.replace({ pathname: "/(tabs)/login" }); // Redirect to login after logout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Steins;Gate Settings</Text>

      {/* Mock Settings */}
      <View style={styles.settingsItem}>
        <Text style={styles.settingsLabel}>Enable D-Mail Notifications</Text>
        <Switch value={true} onValueChange={() => Alert.alert("Feature Coming Soon")} />
      </View>
      <View style={styles.settingsItem}>
        <Text style={styles.settingsLabel}>Activate Time Travel Mode</Text>
        <Switch value={false} onValueChange={() => Alert.alert("Feature Restricted", "This feature is not unlocked yet.")} />
      </View>
      <View style={styles.settingsItem}>
        <Text style={styles.settingsLabel}>Show Divergence Meter</Text>
        <Switch value={true} onValueChange={() => Alert.alert("Feature Coming Soon")} />
      </View>

      {/* Logout */}
      <Button title="Logout" onPress={handleLogout} color="#FF4500" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1C1C1C",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#00FF00",
    textShadowColor: "#003300",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontFamily: "Courier New",
  },
  settingsItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 8,
  },
  settingsLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Courier New",
  },
});
