import { TouchableOpacity, Text, StyleSheet, Modal, View } from "react-native";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function LanguageToggleButton({ style }) {
    const { language, toggleLanguage } = useLanguage();
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLanguageSelect = (selectedLang) => {
        if (selectedLang !== language) {
            toggleLanguage();
        }
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.button, style]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.text}>🌐</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Select Language
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                language === "en" && { backgroundColor: colors.primary },
                            ]}
                            onPress={() => handleLanguageSelect("en")}
                        >
                            <Text style={styles.languageIcon}>🇬🇧</Text>
                            <Text
                                style={[
                                    styles.languageText,
                                    { color: language === "en" ? "#FFFFFF" : colors.text },
                                ]}
                            >
                                English
                            </Text>
                            {language === "en" && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                language === "hi" && { backgroundColor: colors.primary },
                            ]}
                            onPress={() => handleLanguageSelect("hi")}
                        >
                            <Text style={styles.languageIcon}>🇮🇳</Text>
                            <Text
                                style={[
                                    styles.languageText,
                                    { color: language === "hi" ? "#FFFFFF" : colors.text },
                                ]}
                            >
                                हिन्दी (Hindi)
                            </Text>
                            {language === "hi" && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    text: {
        fontSize: 18,
        color: "#FFFFFF",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        maxWidth: 300,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    languageOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    languageIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    languageText: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    checkmark: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
