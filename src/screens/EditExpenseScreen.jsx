import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import * as ImagePicker from "expo-image-picker";
import { updateExpense, deleteExpense } from "../api/expenseService";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { LucaButton } from "../components/ui/LucaButton";
import {
  Camera,
  Trash,
  CheckCircle,
  Circle,
} from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditExpenseScreen({ navigation, route }) {
  const { updateExpenseInGroup, deleteExpenseFromGroup, getGroup, getExpense } =
    useGroups();
  const { groupId, expenseId } = route.params || {};
  const group = getGroup(groupId);
  const expense = getExpense(groupId, expenseId);
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [sharedMembers, setSharedMembers] = useState([]);
  const [receiptUri, setReceiptUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const members = group?.members || [];

  useEffect(() => {
    if (expense) {
      setTitle(expense.title || "");
      setAmount(expense.amount ? expense.amount.toString() : "");
      setPayer(expense.payer || "");
      setSharedMembers(expense.sharedMembers || []);
      setReceiptUri(expense.receiptUri || null);
    }
  }, [expense]);

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

  const handleUpdateExpense = async () => {
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
      };

      await updateExpense(expenseId, expenseData);
      updateExpenseInGroup(groupId, expenseId, expenseData);

      Alert.alert("Success", "Expense updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteExpense(expenseId);
              deleteExpenseFromGroup(groupId, expenseId);

              Alert.alert("Deleted", "Expense has been deleted", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete expense");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!group || !expense) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.oldReceipt }]}>
        <Text style={styles.errorText}>Expense not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Edit Expense</Text>
        <Text style={styles.subtitle}>for {group.name}</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>What was it?</Text>
          <CrumpledCard style={styles.inputCard}>
            <TextInput
              placeholder="e.g. Dinner, Hotel, Bribes"
              style={styles.input}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholderTextColor={theme.colors.warmAsh}
            />
          </CrumpledCard>
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>How much?</Text>
          <CrumpledCard style={styles.inputCard}>
            <TextInput
              placeholder="0.00"
              style={[styles.input, styles.amountInput]}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount)
                  setErrors((prev) => ({ ...prev, amount: null }));
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.warmAsh}
            />
          </CrumpledCard>
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Who paid?</Text>
          <View style={styles.grid}>
            {members.map((member) => (
              <Pressable
                key={member.id}
                style={[
                  styles.optionCard,
                  payer === member.id && styles.optionCardSelected,
                ]}
                onPress={() => {
                  setPayer(member.id);
                  if (errors.payer)
                    setErrors((prev) => ({ ...prev, payer: null }));
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    payer === member.id && styles.optionTextSelected,
                  ]}
                >
                  {member.name}
                </Text>
                {payer === member.id ? (
                  <CheckCircle
                    size={20}
                    color={theme.colors.white}
                    weight="fill"
                  />
                ) : (
                  <Circle size={20} color={theme.colors.warmAsh} />
                )}
              </Pressable>
            ))}
          </View>
          {errors.payer && <Text style={styles.errorText}>{errors.payer}</Text>}
        </View>

        <View style={styles.formSection}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Split between</Text>
            <Pressable onPress={selectAllMembers}>
              <Text style={styles.actionLink}>
                {sharedMembers.length === members.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {members.map((member) => {
              const isSelected = sharedMembers.includes(member.id);
              return (
                <Pressable
                  key={member.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleMemberSelection(member.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {member.name}
                  </Text>
                  {isSelected ? (
                    <CheckCircle
                      size={20}
                      color={theme.colors.white}
                      weight="fill"
                    />
                  ) : (
                    <Circle size={20} color={theme.colors.warmAsh} />
                  )}
                </Pressable>
              );
            })}
          </View>
          {errors.sharedMembers && (
            <Text style={styles.errorText}>{errors.sharedMembers}</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Receipt (Optional)</Text>
          {!receiptUri ? (
            <Pressable onPress={pickImage}>
              <CrumpledCard style={styles.uploadCard}>
                <Camera size={32} color={theme.colors.aperitivoSpritz} />
                <Text style={styles.uploadText}>Snap a photo</Text>
              </CrumpledCard>
            </Pressable>
          ) : (
            <CrumpledCard style={styles.receiptCard}>
              <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
              <Pressable
                style={styles.removeReceiptButton}
                onPress={removeReceipt}
              >
                <Trash size={20} color={theme.colors.white} />
                <Text style={styles.removeReceiptText}>Remove</Text>
              </Pressable>
            </CrumpledCard>
          )}
        </View>

        <View style={styles.actions}>
          <LucaButton
            title={isLoading ? "Updating..." : "Update Expense"}
            onPress={handleUpdateExpense}
            disabled={isLoading}
            style={styles.saveButton}
          />
          <LucaButton
            title="Delete Expense"
            variant="secondary"
            onPress={handleDeleteExpense}
            disabled={isLoading}
            style={styles.deleteButton}
            textStyle={{ color: theme.colors.aperitivoSpritz }}
          />
          <LucaButton
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.oldReceipt,
  },
  scrollContent: {
    padding: theme.spacing.homePadding,
    paddingBottom: 40,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.burntInk,
    marginBottom: 4,
    marginTop: 12,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginBottom: 32,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    ...theme.typography.title2,
    fontSize: 18,
    color: theme.colors.burntInk,
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionLink: {
    ...theme.typography.caption,
    color: theme.colors.aperitivoSpritz,
    fontFamily: "Syne_700Bold",
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
  amountInput: {
    fontFamily: "Syne_700Bold",
    fontSize: 24,
    color: theme.colors.aperitivoSpritz,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    width: "48%", // Roughly 2 columns
  },
  optionCardSelected: {
    backgroundColor: theme.colors.burntInk,
    borderColor: theme.colors.burntInk,
  },
  optionText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.burntInk,
    flex: 1,
  },
  optionTextSelected: {
    color: theme.colors.white,
    fontFamily: "Syne_700Bold",
  },
  uploadCard: {
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: theme.colors.warmAsh,
  },
  uploadText: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginTop: 8,
  },
  receiptCard: {
    padding: 12,
    backgroundColor: theme.colors.white,
  },
  receiptImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.oldReceipt,
  },
  removeReceiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.aperitivoSpritz,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  removeReceiptText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontFamily: "Syne_700Bold",
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.aperitivoSpritz,
    marginTop: 8,
    marginLeft: 4,
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
  saveButton: {
    marginBottom: 8,
  },
  deleteButton: {
    marginBottom: 8,
    borderColor: theme.colors.aperitivoSpritz,
    borderWidth: 2,
  },
});
