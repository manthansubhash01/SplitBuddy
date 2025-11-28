import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { GroupProvider } from "./src/context/GroupContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GroupProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </GroupProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
