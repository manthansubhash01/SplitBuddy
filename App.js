import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { GroupProvider } from "./src/context/GroupContext";

export default function App() {
  return (
    <GroupProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GroupProvider>
  );
}
