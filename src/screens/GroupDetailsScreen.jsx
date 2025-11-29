import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useGroups } from "../context/GroupContext";
import {
  calculateBalances,
  formatCurrency,
} from "../services/balanceCalculator";
import { theme } from "../styles/theme";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { LucaButton } from "../components/ui/LucaButton";
import { PulseIcon } from "../components/ui/PulseIcon";
import {
  User,
  Receipt,
  Pencil,
  Trash,
  Plus,
  ChartBar,
  Money,
} from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupDetailsScreen({ navigation, route }) {
  const { groupId } = route.params || {};
  const { getGroup, addMember, updateMember, deleteMember, deleteExpense } =
    useGroups();
  const { t } = useLanguage();
  const [group, setGroup] = useState(null);
  const insets = useSafeAreaInsets();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberName, setEditMemberName] = useState("");

  useEffect(() => {
    if (groupId) {
      const foundGroup = getGroup(groupId);
      setGroup(foundGroup);
    }
  }, [groupId, getGroup]);

  const balances = useMemo(() => {
    if (!group || !group.expenses || !group.members) {
      return {};
    }
    return calculateBalances(group.expenses, group.members);
  }, [group]);

  const { totalSpent, leftToSettle } = useMemo(() => {
    if (!group || !group.expenses) return { totalSpent: 0, leftToSettle: 0 };

    const spent = group.expenses
      .filter((e) => !e.isPayment)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const settled = Object.values(balances)
      .filter((b) => b.balance > 0.01)
      .reduce((sum, b) => sum + b.balance, 0);

    return { totalSpent: spent, leftToSettle: settled };
  }, [group, balances]);

  const refreshGroup = () => {
    if (groupId) {
      const updatedGroup = getGroup(groupId);
      setGroup(updatedGroup);
    }
  };

  const handleDeleteExpense = (expense) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExpense(groupId, expense.id);
            refreshGroup();
            Alert.alert("Deleted", "Expense has been removed");
          },
        },
      ]
    );
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert("Oops!", "Please enter a member name");
      return;
    }

    const member = addMember(groupId, newMemberName);
    if (member) {
      setNewMemberName("");
      setAddModalVisible(false);
      refreshGroup();
    }
  };

  const handleEditMember = () => {
    if (!editMemberName.trim()) {
      Alert.alert("Oops!", "Please enter a valid name");
      return;
    }

    const success = updateMember(groupId, editingMember.id, editMemberName);
    if (success) {
      setEditModalVisible(false);
      setEditingMember(null);
      setEditMemberName("");
      refreshGroup();
    }
  };

  const handleDeleteMember = (member) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.name} from this trip ? `,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            deleteMember(groupId, member.id);
            refreshGroup();
          },
        },
      ]
    );
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setEditMemberName(member.name);
    setEditModalVisible(true);
  };

  if (!group) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.oldReceipt }]}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.tripName}>{group.name}</Text>
          {group.description ? (
            <Text style={styles.tripDescription}>{group.description}</Text>
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Left to Settle</Text>
              <Text style={[styles.statValue, { color: theme.colors.tomatoRed }]}>
                {formatCurrency(leftToSettle)}
              </Text>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>The Squad</Text>
            <Pressable onPress={() => setAddModalVisible(true)}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {group.members && group.members.length > 0 ? (
              group.members.map((member) => {
                const balance = balances[member.id];
                const balanceAmount = balance ? balance.balance : 0;
                const isPositive = balanceAmount > 0.01;
                const isNegative = balanceAmount < -0.01;

                return (
                  <CrumpledCard key={member.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.memberActions}>
                        <Pressable onPress={() => openEditModal(member)}>
                          <Pencil size={16} color={theme.colors.warmAsh} />
                        </Pressable>
                        <Pressable onPress={() => handleDeleteMember(member)}>
                          <Trash size={16} color={theme.colors.tomatoRed} />
                        </Pressable>
                      </View>
                    </View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text
                      style={[
                        styles.memberBalance,
                        {
                          color: isPositive
                            ? theme.colors.oliveGreen
                            : isNegative
                              ? theme.colors.tomatoRed
                              : theme.colors.warmAsh,
                        },
                      ]}
                    >
                      {isPositive
                        ? `Gets back ${formatCurrency(balanceAmount)}`
                        : isNegative
                          ? `Owes ${formatCurrency(Math.abs(balanceAmount))}`
                          : "Settled"}
                    </Text>
                  </CrumpledCard>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No friends yet? Sad.</Text>
            )}
          </View>
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expense Report</Text>
            <Pressable
              onPress={() => navigation.navigate("AddExpense", { groupId })}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>

          {group.expenses && group.expenses.length > 0 ? (
            group.expenses.map((expense) => {
              const payerName =
                group.members.find((m) => m.id === expense.payer)?.name ||
                "Unknown";
              return (
                <Pressable
                  key={expense.id}
                  onPress={() =>
                    navigation.navigate("EditExpense", {
                      groupId,
                      expenseId: expense.id,
                    })
                  }
                >
                  <CrumpledCard style={styles.expenseCard}>
                    <View style={styles.expenseRow}>
                      <View style={styles.expenseInfo}>
                        <Text style={styles.expenseTitle}>{expense.title}</Text>
                        <Text style={styles.expensePayer}>
                          Paid by {payerName}
                        </Text>
                      </View>
                      <Text style={styles.expenseAmount}>
                        ${parseFloat(expense.amount).toFixed(0)}
                      </Text>
                    </View>
                  </CrumpledCard>
                </Pressable>
              );
            })
          ) : (
            <CrumpledCard style={styles.emptyState}>
              <Text style={styles.emptyText}>No expenses yet.</Text>
            </CrumpledCard>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.actionButtons}>
            <LucaButton
              title="Settlements"
              onPress={() => navigation.navigate("Settlement", { groupId })}
            />
            <LucaButton
              title="Activity Log"
              variant="secondary"
              onPress={() => navigation.navigate("ActivityLog", { groupId })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <CrumpledCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Victim</Text>
            <TextInput
              style={styles.input}
              placeholder="Name (e.g. Luca)"
              placeholderTextColor={theme.colors.warmAsh}
              value={newMemberName}
              onChangeText={setNewMemberName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <LucaButton
                title="Cancel"
                variant="secondary"
                onPress={() => setAddModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <LucaButton
                title="Add"
                onPress={handleAddMember}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </CrumpledCard>
        </View>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <CrumpledCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename</Text>
            <TextInput
              style={styles.input}
              value={editMemberName}
              onChangeText={setEditMemberName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <LucaButton
                title="Cancel"
                variant="secondary"
                onPress={() => setEditModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <LucaButton
                title="Update"
                onPress={handleEditMember}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </CrumpledCard>
        </View>
      </Modal>
    </View>
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
  header: {
    marginBottom: 32,
    marginTop: 12,
  },
  tripName: {
    ...theme.typography.display,
    color: theme.colors.burntInk,
    marginBottom: 4,
  },
  tripDescription: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radii.card,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: theme.colors.warmAsh,
    opacity: 0.2,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    fontSize: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
  },
  addButtonText: {
    ...theme.typography.body,
    color: theme.colors.tomatoRed,
    fontFamily: "Syne_700Bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  memberCard: {
    width: "48%", // Roughly 2 columns
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.oliveGreen,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.burntInk,
  },
  avatarText: {
    ...theme.typography.title2,
    color: theme.colors.white,
  },
  memberActions: {
    flexDirection: "row",
    gap: 8,
  },
  memberName: {
    ...theme.typography.body,
    fontFamily: "Syne_700Bold",
    color: theme.colors.burntInk,
    marginBottom: 4,
  },
  memberBalance: {
    ...theme.typography.caption,
  },
  expenseCard: {
    marginBottom: 12,
    backgroundColor: theme.colors.white,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    ...theme.typography.title2,
    fontSize: 18,
    color: theme.colors.burntInk,
  },
  expensePayer: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
  },
  expenseAmount: {
    ...theme.typography.title2,
    color: theme.colors.tomatoRed,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    textAlign: "center",
  },
  actionButtons: {
    gap: 24,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: theme.colors.oldReceipt,
  },
  modalTitle: {
    ...theme.typography.title1,
    color: theme.colors.burntInk,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    ...theme.typography.body,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.burntInk,
    paddingVertical: 12,
    marginBottom: 32,
    color: theme.colors.burntInk,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    ...theme.typography.title2,
    textAlign: "center",
    marginTop: 40,
  },
});

