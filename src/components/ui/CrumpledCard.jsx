import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const CrumpledCard = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.oldReceipt,
        borderRadius: theme.radii.card,
        padding: 20,
        shadowColor: theme.colors.warmAsh,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.02)", // Subtle border
    },
});
