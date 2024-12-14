import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '@/authService';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    Alert.alert('Logged Out', 'You have been logged out');
    router.replace({ pathname: '/(tabs)/login' }); // Redirect to login after logout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
