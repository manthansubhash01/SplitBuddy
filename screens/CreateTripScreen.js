import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTripContext } from "../context/TripContext";
import { generateId } from "../utils/helpers";

const CreateTripScreen = ({ navigation }) => {
  const { addTrip } = useTripContext();

  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    if (memberName.trim()) {
      const newMember = {
        id: generateId(),
        name: memberName.trim(),
      };
      setMembers([...members, newMember]);
      setMemberName("");
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = async () => {
    if (!tripName.trim() || members.length === 0) {
      Alert.alert("Error", "Please provide trip name and at least one member");
      return;
    }

    const newTrip = {
      id: generateId(),
      name: tripName.trim(),
      description: description.trim(),
      members,
      expenses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addTrip(newTrip);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Trip Name *</Text>
        <TextInput
          style={styles.input}
          value={tripName}
          onChangeText={setTripName}
          placeholder="Weekend Getaway"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Optional description"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Add Members *</Text>
        <View style={styles.memberInputRow}>
          <TextInput
            style={[styles.input, styles.memberInput]}
            value={memberName}
            onChangeText={setMemberName}
            placeholder="Member name"
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleAddMember}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {members.length > 0 && (
          <View style={styles.membersList}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Text style={styles.memberName}>{member.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveMember(member.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  memberInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  memberInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#4b5563",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  membersList: {
    marginTop: 16,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    color: "#111827",
  },
  removeText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#2563eb",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateTripScreen;
