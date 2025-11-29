import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/context/ThemeContext";
import { GroupProvider } from "./src/context/GroupContext";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import {
  useFonts,
  Syne_400Regular,
  Syne_500Medium,
  Syne_700Bold,
  Syne_800ExtraBold,
} from "@expo-google-fonts/syne";
import { theme } from "./src/styles/theme";

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Syne_400Regular,
    Syne_500Medium,
    Syne_700Bold,
    Syne_800ExtraBold,
  });

  // Add timeout fallback to prevent infinite loading
  React.useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.aperitivoSpritz} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <GroupProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </GroupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.oldReceipt,
    alignItems: "center",
    justifyContent: "center",
  },
});
