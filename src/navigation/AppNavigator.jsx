import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GroupsNavigator from "./GroupsNavigator";
import HomeScreen from "../screens/HomeScreen";
import ArchiveScreen from "../screens/ArchiveScreen";
import { useTheme } from "../context/ThemeContext";

import {
  HomeLineIcon,
  HomeFilledIcon,
  GroupLineIcon,
  GroupFilledIcon,
  ArchiveLineIcon,
  ArchiveFilledIcon,
} from "../components/icons/RemixIcons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, focused }) => {
          const size = focused ? 28 : 24;

          if (route.name === "HomeTab") {
            return focused ? (
              <HomeFilledIcon size={size} color={color} />
            ) : (
              <HomeLineIcon size={size} color={color} />
            );
          } else if (route.name === "GroupsTab") {
            return focused ? (
              <GroupFilledIcon size={size} color={color} />
            ) : (
              <GroupLineIcon size={size} color={color} />
            );
          } else if (route.name === "ArchiveTab") {
            return focused ? (
              <ArchiveFilledIcon size={size} color={color} />
            ) : (
              <ArchiveLineIcon size={size} color={color} />
            );
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
        options={{ title: "Groups" }}
      />
      <Tab.Screen
        name="ArchiveTab"
        component={ArchiveScreen}
        options={{ title: "Archive" }}
      />
    </Tab.Navigator>
  );
}
