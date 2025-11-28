import React from "react";
import { Text, Pressable, StyleSheet, Animated } from "react-native";
import { theme } from "../../styles/theme";

export const LucaButton = ({
    title,
    onPress,
    variant = "primary",
    style,
    textStyle,
    disabled = false,
}) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 1.06,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const isPrimary = variant === "primary";

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={({ pressed }) => [
                styles.container,
                isPrimary ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [{ scale: scaleValue }],
                    },
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        isPrimary ? styles.primaryText : styles.secondaryText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        borderRadius: theme.radii.button,
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible", // Allow scale to go outside
    },
    content: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    primary: {
        backgroundColor: theme.colors.aperitivoSpritz,
        shadowColor: theme.colors.aperitivoSpritz,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.electricAmaro,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        ...theme.typography.body,
        fontFamily: "Syne_700Bold",
    },
    primaryText: {
        color: theme.colors.burntInk,
    },
    secondaryText: {
        color: theme.colors.burntInk,
    },
});
