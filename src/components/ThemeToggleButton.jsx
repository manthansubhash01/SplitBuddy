import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton({ style }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={toggleTheme}
            activeOpacity={0.7}
        >
            <Image
                source={isDark ? require("../assets/bulb-dark.png") : require("../assets/bulb-light.png")}
                style={styles.icon}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    icon: {
        width: 28,
        height: 28,
    },
});
