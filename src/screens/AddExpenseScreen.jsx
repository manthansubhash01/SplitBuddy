import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useGroups } from "../context/GroupContext";
import { useTheme } from "../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { createExpense } from "../api/expenseService";

export default function AddExpenseScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addExpenseToGroup, getGroup } = useGroups();
  const { groupId } = route.params || {};
  const group = getGroup(groupId);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [sharedMembers, setSharedMembers] = useState([]);
  const [receiptUri, setReceiptUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const members = group?.members || [];

  const toggleMemberSelection = (memberId) => {
    setSharedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
    if (errors.sharedMembers) {
      setErrors((prev) => ({ ...prev, sharedMembers: null }));
    }
  };

  const selectAllMembers = () => {
    if (sharedMembers.length === members.length) {
      setSharedMembers([]);
    } else {
      setSharedMembers(members.map((m) => m.id));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload receipts."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const removeReceipt = () => {
    setReceiptUri(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be a valid positive number";
    }

    if (!payer) {
      newErrors.payer = "Please select who paid";
    }

    if (sharedMembers.length === 0) {
      newErrors.sharedMembers =
        "Please select at least one member to share the cost";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveExpense = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        title: title.trim(),
        amount: parseFloat(amount),
        payer,
        sharedMembers,
        receiptUri,
        groupId,
      };

      const createdExpense = await createExpense(expenseData);

      addExpenseToGroup(groupId, createdExpense);

      Alert.alert("Success", "Expense added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create expense");
    } finally {
      setIsLoading(false);
    }
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Group not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>for {group.name}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expense Title *</Text>
          <TextInput
            placeholder="e.g., Dinner, Hotel, Gas"
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholderTextColor="#999"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            placeholder="0.00"
            style={[styles.input, errors.amount && styles.inputError]}
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount)
                setErrors((prev) => ({ ...prev, amount: null }));
            }}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Who Paid? *</Text>
          <View style={styles.pickerContainer}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.payerOption,
                  payer === member.id && styles.payerOptionSelected,
                ]}
                onPress={() => {
                  setPayer(member.id);
                  if (errors.payer)
                    setErrors((prev) => ({ ...prev, payer: null }));
                }}
              >
                <View
                  style={[
                    styles.radio,
                    payer === member.id && styles.radioSelected,
                  ]}
                >
                  {payer === member.id && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.payerText,
                    payer === member.id && styles.payerTextSelected,
                  ]}
                >
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.payer && <Text style={styles.errorText}>{errors.payer}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Split Between *</Text>
            <TouchableOpacity onPress={selectAllMembers}>
              <Text style={styles.selectAllText}>
                {sharedMembers.length === members.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.membersContainer}>
            {members.map((member) => {
              const isSelected = sharedMembers.includes(member.id);
              return (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberOption,
                    isSelected && styles.memberOptionSelected,
                  ]}
                  onPress={() => toggleMemberSelection(member.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.memberText,
                      isSelected && styles.memberTextSelected,
                    ]}
                  >
                    {member.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.sharedMembers && (
            <Text style={styles.errorText}>{errors.sharedMembers}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Receipt (Optional)</Text>
          {!receiptUri ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>📷 Upload Receipt</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.receiptPreview}>
              <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
              <TouchableOpacity
                style={styles.removeReceiptButton}
                onPress={removeReceipt}
              >
                <Text style={styles.removeReceiptText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveExpense}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Expense</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 28,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#374151",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    fontSize: 13,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 14,
    fontSize: 17,
    color: "#1F2937",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
    marginLeft: 4,
  },
  pickerContainer: {
    gap: 10,
  },
  payerOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  payerOptionSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#D1D5DB",
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  radioSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3B82F6",
  },
  payerText: {
    fontSize: 17,
    color: "#374151",
    fontWeight: "500",
  },
  payerTextSelected: {
    color: "#1E40AF",
    fontWeight: "700",
  },
  membersContainer: {
    gap: 10,
  },
  memberOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  memberOptionSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: "#D1D5DB",
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  memberText: {
    fontSize: 17,
    color: "#374151",
    fontWeight: "500",
  },
  memberTextSelected: {
    color: "#1E40AF",
    fontWeight: "700",
  },
  uploadButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadButtonText: {
    color: "#3B82F6",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  receiptPreview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  receiptImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: "#F3F4F6",
  },
  removeReceiptButton: {
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  removeReceiptText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowColor: "#6B7280",
    shadowOpacity: 0.2,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cancelButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
