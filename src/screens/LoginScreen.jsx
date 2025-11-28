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

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleLogin = async () => {
        setIsLoading(true);
        // Simulate login API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to main app
            navigation.replace("Main");
        }, 1000);
    };

    const handleContinueWithoutLogin = () => {
        // Navigate directly to main app
        navigation.replace("Main");
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
                        <Text style={styles.logoEmoji}>🍝</Text>
                        <Text style={styles.appName}>SplitBuddy</Text>
                        <Text style={styles.tagline}>
                            Italian chaos,{"\n"}perfectly split.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <CrumpledCard style={styles.inputCard}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="mario@example.com"
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

                        <Pressable style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Lost your key?</Text>
                        </Pressable>

                        <View style={styles.actions}>
                            <LucaButton
                                title={isLoading ? "Entering..." : "Enter the Chaos"}
                                onPress={handleLogin}
                                disabled={isLoading}
                                style={styles.loginButton}
                            />
                            <LucaButton
                                title="Just Looking"
                                variant="secondary"
                                onPress={handleContinueWithoutLogin}
                                disabled={isLoading}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomLinks}>
                        <Text style={styles.bottomText}>New to the family? </Text>
                        <Pressable>
                            <Text style={styles.linkText}>Join us</Text>
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
        fontSize: 42,
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        ...theme.typography.caption,
        color: theme.colors.aperitivoSpritz,
        fontFamily: "Syne_700Bold",
    },
    actions: {
        gap: 16,
    },
    loginButton: {
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
