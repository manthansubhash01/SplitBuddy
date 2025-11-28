import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { GroupProvider } from "./src/context/GroupContext";
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <GroupProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GroupProvider>
    </ThemeProvider>
  );
}
