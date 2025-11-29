import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AppNavigator from "./AppNavigator";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { theme } from "../styles/theme";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  console.log("RootNavigator render - user:", user, "isLoading:", isLoading);

  if (isLoading) {
    console.log("Showing loading screen");
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.oldReceipt,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.aperitivoSpritz} />
      </View>
    );
  }

  console.log(
    "Rendering navigator - user is",
    user ? "logged in" : "not logged in"
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <Stack.Screen name="Main" component={AppNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
