import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GroupsNavigator from "./GroupsNavigator";
import HomeScreen from "../screens/HomeScreen";
import ArchiveScreen from "../screens/ArchiveScreen";
import { theme } from "../styles/theme";
import {
  House,
  UsersThree,
  Archive,
} from "phosphor-react-native";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.aperitivoSpritz,
        tabBarInactiveTintColor: theme.colors.warmAsh,
        tabBarStyle: {
          height: 80, // Taller tab bar
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: theme.colors.oldReceipt,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "Syne_500Medium",
          fontSize: 12,
        },
        tabBarIcon: ({ color, focused }) => {
          const size = 28;
          const weight = focused ? "fill" : "regular";

          if (route.name === "HomeTab") {
            return <House size={size} color={color} weight={weight} />;
          } else if (route.name === "GroupsTab") {
            return <UsersThree size={size} color={color} weight={weight} />;
          } else if (route.name === "ArchiveTab") {
            return <Archive size={size} color={color} weight={weight} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={GroupsNavigator}
        options={{ title: "Trips" }}
      />
      <Tab.Screen
        name="ArchiveTab"
        component={ArchiveScreen}
        options={{ title: "Archive" }}
      />
    </Tab.Navigator>
  );
}
