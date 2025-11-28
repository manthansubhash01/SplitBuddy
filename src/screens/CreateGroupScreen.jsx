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
} from "react-native";
import { useState } from "react";
import { useGroups } from "../context/GroupContext";

export default function CreateGroupScreen({ navigation }) {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  const handleAddMember = () => {
    if (memberName.trim()) {
      const newMember = {
        id: Date.now().toString(),
        name: memberName.trim(),
      };
      setMembers([...members, newMember]);
      setMemberName("");
    }
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    if (members.length === 0) {
      Alert.alert("Error", "Please add at least one member");
      return;
    }

    const newGroup = addGroup({
      name: groupName.trim(),
      description: description.trim(),
      members: members,
    });

    Alert.alert("Success", "Group created successfully!", [
      {
        text: "OK",
        onPress: () => {
          // Navigate to the newly created group details
          navigation.navigate("GroupDetails", { groupId: newGroup.id });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create New Trip</Text>

        {/* Group Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trip Name *</Text>
          <TextInput
            placeholder="e.g., Beach Weekend, Europe Trip"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholderTextColor="#999"
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            placeholder="Add a description for your trip"
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>

        {/* Members Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Members *</Text>
          <View style={styles.addMemberContainer}>
            <TextInput
              placeholder="Enter member name"
              style={styles.memberInput}
              value={memberName}
              onChangeText={setMemberName}
              onSubmitEditing={handleAddMember}
              returnKeyType="done"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Members List */}
          {members.length > 0 && (
            <View style={styles.membersList}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            (!groupName.trim() || members.length === 0) &&
              styles.createButtonDisabled,
          ]}
          onPress={handleCreateGroup}
          disabled={!groupName.trim() || members.length === 0}
        >
          <Text style={styles.createButtonText}>Create Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
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
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  addMemberContainer: {
    flexDirection: "row",
    gap: 10,
  },
  memberInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  membersList: {
    marginTop: 12,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
