import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/authService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("El Psy Congroo", "Logged in successfully");
      router.replace({ pathname: "/(tabs)" });
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/steins_gate_background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Enter Laboratory</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#8F9AA3"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#8F9AA3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push({ pathname: "/(tabs)/register" })}
        >
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent overlay
  },
  title: {
    fontSize: 32,
    color: "#1B9AAA",
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 32,
  },
  input: {
    width: "85%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#1B9AAA",
    borderRadius: 5,
    backgroundColor: "#1C1C1C",
    color: "#E0E6ED",
    fontFamily: "monospace",
  },
  button: {
    width: "85%",
    padding: 12,
    backgroundColor: "#1B9AAA",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  registerLink: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: "#8F9AA3",
    textDecorationLine: "underline",
    fontFamily: "monospace",
  },
});
