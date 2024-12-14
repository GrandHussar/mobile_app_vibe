import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { isLoggedIn } from '@/authService';
import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  if (error) throw error;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootNavigation />;
}

function RootNavigation() {
  const colorScheme = useColorScheme();
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);

      // Redirect to login if not authenticated
      if (!loggedIn) {
        router.replace('/(tabs)/login');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // Globally hide headers unless specified
        }}
      >
        {authenticated ? (
          <>
            {/* Authenticated user screens */}
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </>
        ) : (
          <>
            {/* Unauthenticated user screens */}
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(tabs)/login" options={{ title: 'Login', headerShown: true }} />
            <Stack.Screen name="(tabs)/register" options={{ title: 'Register', headerShown: true }} />
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}
