import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useGroups } from "../context/GroupContext";
import {
  calculateBalances,
  formatCurrency,
} from "../services/balanceCalculator";
import { useLanguage } from "../context/LanguageContext";
import { groupDetailsStyles as styles } from "../styles/groupDetailsStyles";

export default function GroupDetailsScreen({ navigation, route }) {
  const { groupId } = route.params || {};
  const { getGroup, addMember, updateMember, deleteMember, deleteExpense } =
    useGroups();
  const { t } = useLanguage();
  const [group, setGroup] = useState(null);

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
      Alert.alert("Success!", `${member.name} has been added to the trip`);
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
      Alert.alert("Updated!", "Member name has been updated");
    }
  };

  const handleDeleteMember = (member) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.name} from this trip?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            deleteMember(groupId, member.id);
            refreshGroup();
            Alert.alert("Removed", `${member.name} has been removed`);
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
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tripName}>{group.name}</Text>
        {group.description && (
          <Text style={styles.tripDescription}>{group.description}</Text>
        )}
        <Text style={styles.tripTotal}>
          Total: ${group.totalExpenses.toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addMemberButtonText}>+ Add Member</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.membersList}>
          {group.members && group.members.length > 0 ? (
            group.members.map((member) => {
              const balance = balances[member.id];
              const balanceAmount = balance ? balance.balance : 0;
              const isPositive = balanceAmount > 0.01;
              const isNegative = balanceAmount < -0.01;

              return (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberInitial}>
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {balance && (
                        <View style={styles.balanceInfo}>
                          <Text style={styles.balanceLabel}>
                            Paid:{" "}
                            <Text style={styles.balanceValue}>
                              {formatCurrency(balance.paid)}
                            </Text>
                            {" • "}
                            Share:{" "}
                            <Text style={styles.balanceValue}>
                              {formatCurrency(balance.share)}
                            </Text>
                          </Text>
                          {isPositive && (
                            <Text style={styles.balancePositive}>
                              Gets back {formatCurrency(balanceAmount)}
                            </Text>
                          )}
                          {isNegative && (
                            <Text style={styles.balanceNegative}>
                              Owes {formatCurrency(balanceAmount)}
                            </Text>
                          )}
                          {!isPositive && !isNegative && (
                            <Text style={styles.balanceSettled}>Settled ✓</Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.memberActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditModal(member)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMember(member)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No members yet</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={() => navigation.navigate("AddExpense", { groupId })}
          >
            <Text style={styles.addMemberButtonText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expensesList}>
          {group.expenses && group.expenses.length > 0 ? (
            group.expenses.map((expense) => {
              const payerName =
                group.members.find((m) => m.id === expense.payer)?.name ||
                "Unknown";
              return (
                <View key={expense.id} style={styles.expenseCard}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        navigation.navigate("EditExpense", {
                          groupId,
                          expenseId: expense.id,
                        })
                      }
                    >
                      <View style={styles.expenseHeader}>
                        <Text style={styles.expenseTitle}>{expense.title}</Text>
                        <Text style={styles.expenseAmount}>
                          ₹{parseFloat(expense.amount).toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.expensePayer}>Paid by {payerName}</Text>
                      <Text style={styles.expenseShared}>
                        Split between {expense.sharedMembers?.length || 0} member(s)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ padding: 8, marginLeft: 8 }}
                      onPress={() => handleDeleteExpense(expense)}
                    >
                      <Text style={{ fontSize: 20 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No expenses yet</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AddExpense", { groupId })}
        >
          <Text style={styles.actionButtonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Settlement", { groupId })}
        >
          <Text style={styles.actionButtonText}>Settlement Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("ActivityLog", { groupId })}
        >
          <Text style={styles.actionButtonText}>Activity Log</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter member name"
              value={newMemberName}
              onChangeText={setNewMemberName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAddModalVisible(false);
                  setNewMemberName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddMember}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Member</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter member name"
              value={editMemberName}
              onChangeText={setEditMemberName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingMember(null);
                  setEditMemberName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleEditMember}
              >
                <Text style={styles.confirmButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
