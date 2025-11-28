import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import { useState } from "react";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo/Branding Section */}
                    <View style={styles.brandingContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoEmoji}>💰</Text>
                        </View>
                        <Text style={styles.appName}>SplitBuddy</Text>
                        <Text style={styles.tagline}>Fair splits. Zero drama.</Text>
                    </View>

                    {/* Login Card */}
                    <View style={styles.loginCard}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitleText}>
                            Sign in to sync your trips across devices
                        </Text>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#64748B"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#64748B"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? "Signing in..." : "Login"}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Continue Without Login */}
                        <TouchableOpacity
                            style={styles.guestButton}
                            onPress={handleContinueWithoutLogin}
                        >
                            <Text style={styles.guestButtonText}>Continue without login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Links */}
                    <View style={styles.bottomLinks}>
                        <Text style={styles.bottomText}>New here? </Text>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Create account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Extra spacing for keyboard */}
                    <View style={styles.spacer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    brandingContainer: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#4F46E5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 40,
    },
    appName: {
        fontSize: 36,
        fontWeight: "900",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        color: "#94A3B8",
        fontWeight: "500",
        letterSpacing: 0.5,
    },
    loginCard: {
        backgroundColor: "#1E293B",
        borderRadius: 24,
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        borderWidth: 1,
        borderColor: "#334155",
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitleText: {
        fontSize: 15,
        color: "#94A3B8",
        marginBottom: 28,
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#E2E8F0",
        marginBottom: 10,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        fontSize: 12,
    },
    input: {
        backgroundColor: "#0F172A",
        borderWidth: 2,
        borderColor: "#334155",
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderWidth: 2,
        borderColor: "#334155",
        borderRadius: 14,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
    },
    eyeButton: {
        padding: 16,
    },
    eyeIcon: {
        fontSize: 20,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: "#818CF8",
        fontWeight: "600",
    },
    loginButton: {
        backgroundColor: "#4F46E5",
        borderRadius: 14,
        padding: 18,
        alignItems: "center",
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    loginButtonDisabled: {
        backgroundColor: "#475569",
        shadowOpacity: 0.2,
    },
    loginButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#334155",
    },
    dividerText: {
        color: "#64748B",
        fontSize: 13,
        fontWeight: "700",
        marginHorizontal: 16,
        letterSpacing: 1,
    },
    guestButton: {
        backgroundColor: "#334155",
        borderRadius: 14,
        padding: 18,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#475569",
    },
    guestButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#E2E8F0",
        letterSpacing: 0.3,
    },
    bottomLinks: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
    },
    bottomText: {
        fontSize: 15,
        color: "#94A3B8",
    },
    linkText: {
        fontSize: 15,
        color: "#818CF8",
        fontWeight: "700",
    },
    spacer: {
        height: 40,
    },
});
