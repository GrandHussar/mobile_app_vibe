import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/authService';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully');
      router.replace({ pathname: '/(tabs)' }); // Redirect to dashboard after login
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/steins_gate_background.jpg')} // Updated path to the background image
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>EL PSY CONGROO</Text>

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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => router.push({ pathname: '/(tabs)/register' })}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay for readability
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B9AAA', // Neon cyan color for "EL PSY CONGROO"
    marginBottom: 32,
    fontFamily: 'monospace', // Monospace font for terminal style
  },
  input: {
    width: '85%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1B9AAA', // Neon cyan border
    borderRadius: 5,
    backgroundColor: '#1C1C1C', // Dark background for input fields
    color: '#E0E6ED', // Light text color for inputs
    fontFamily: 'monospace',
    fontSize: 16,
  },
  loginButton: {
    width: '85%',
    padding: 12,
    marginTop: 16,
    borderRadius: 5,
    backgroundColor: '#1B9AAA',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  registerButton: {
    marginTop: 16,
  },
  registerButtonText: {
    color: '#8F9AA3', // Subdued color for the "Register" text link
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'monospace',
  },
});
