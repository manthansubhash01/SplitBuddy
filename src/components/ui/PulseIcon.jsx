import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export const PulseIcon = ({ children, style }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, []);

    return (
        <Animated.View style={[style, { transform: [{ scale }] }]}>
            {children}
        </Animated.View>
    );
};
