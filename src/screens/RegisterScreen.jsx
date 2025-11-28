import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Pressable,
} from "react-native";
import { useState } from "react";
import { theme } from "../styles/theme";
import { LucaButton } from "../components/ui/LucaButton";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { Eye, EyeSlash } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleRegister = async () => {
        setIsLoading(true);
        // Simulate register API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to main app
            navigation.replace("Main");
        }, 1000);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.brandingContainer}>
                        <Text style={styles.logoEmoji}>🥂</Text>
                        <Text style={styles.appName}>Join the Family</Text>
                        <Text style={styles.tagline}>
                            More friends,{"\n"}more chaos.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <CrumpledCard style={styles.inputCard}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Luigi"
                                    placeholderTextColor={theme.colors.warmAsh}
                                    value={name}
                                    onChangeText={setName}
                                    autoCorrect={false}
                                />
                            </CrumpledCard>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <CrumpledCard style={styles.inputCard}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="luigi@example.com"
                                    placeholderTextColor={theme.colors.warmAsh}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </CrumpledCard>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <CrumpledCard style={styles.inputCard}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="••••••••"
                                        placeholderTextColor={theme.colors.warmAsh}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Pressable
                                        style={styles.eyeButton}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeSlash size={20} color={theme.colors.warmAsh} />
                                        ) : (
                                            <Eye size={20} color={theme.colors.warmAsh} />
                                        )}
                                    </Pressable>
                                </View>
                            </CrumpledCard>
                        </View>

                        <View style={styles.actions}>
                            <LucaButton
                                title={isLoading ? "Joining..." : "Start the Party"}
                                onPress={handleRegister}
                                disabled={isLoading}
                                style={styles.registerButton}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomLinks}>
                        <Text style={styles.bottomText}>Already have a key? </Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.linkText}>Enter here</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.oldReceipt,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.homePadding,
        paddingBottom: 40,
        justifyContent: "center",
    },
    brandingContainer: {
        alignItems: "center",
        marginBottom: 48,
        marginTop: 20,
    },
    logoEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    appName: {
        ...theme.typography.display,
        fontSize: 36,
        color: theme.colors.burntInk,
        marginBottom: 8,
        textAlign: "center",
    },
    tagline: {
        ...theme.typography.title2,
        color: theme.colors.warmAsh,
        textAlign: "center",
        transform: [{ rotate: "-2deg" }],
    },
    formContainer: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        ...theme.typography.title2,
        fontSize: 18,
        color: theme.colors.burntInk,
        marginBottom: 8,
    },
    inputCard: {
        padding: 0,
        backgroundColor: theme.colors.white,
    },
    input: {
        ...theme.typography.body,
        padding: 16,
        color: theme.colors.burntInk,
        minHeight: 56,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    passwordInput: {
        ...theme.typography.body,
        flex: 1,
        padding: 16,
        color: theme.colors.burntInk,
        minHeight: 56,
    },
    eyeButton: {
        padding: 16,
    },
    actions: {
        gap: 16,
        marginTop: 16,
    },
    registerButton: {
        marginBottom: 8,
    },
    bottomLinks: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
    },
    bottomText: {
        ...theme.typography.body,
        color: theme.colors.warmAsh,
    },
    linkText: {
        ...theme.typography.body,
        color: theme.colors.aperitivoSpritz,
        fontFamily: "Syne_700Bold",
    },
});
