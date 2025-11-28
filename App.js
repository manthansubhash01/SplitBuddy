import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { GroupProvider } from "./src/context/GroupContext";

export default function App() {
  return (
    <GroupProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GroupProvider>
  );
}
