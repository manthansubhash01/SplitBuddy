import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import { LucaButton } from "../components/ui/LucaButton";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { Trash, Plus } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateGroupScreen({ navigation }) {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const insets = useSafeAreaInsets();

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

    Alert.alert("Success", "Trip created successfully!", [
      {
        text: "Let's Go",
        onPress: () => {
          navigation.navigate("GroupDetails", { groupId: newGroup.id });
        },
      },
    ]);
  };

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
        <Text style={styles.title}>New Adventure</Text>
        <Text style={styles.subtitle}>Where are we causing chaos?</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Trip Name</Text>
          <CrumpledCard style={styles.inputCard}>
            <TextInput
              placeholder="e.g. Amalfi Coast 2024"
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholderTextColor={theme.colors.warmAsh}
            />
          </CrumpledCard>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Vibe / Description</Text>
          <CrumpledCard style={styles.inputCard}>
            <TextInput
              placeholder="What happens in Amalfi..."
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.colors.warmAsh}
            />
          </CrumpledCard>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>The Squad</Text>
          <CrumpledCard style={styles.addMemberCard}>
            <TextInput
              placeholder="Add a victim..."
              style={styles.memberInput}
              value={memberName}
              onChangeText={setMemberName}
              onSubmitEditing={handleAddMember}
              returnKeyType="done"
              placeholderTextColor={theme.colors.warmAsh}
            />
            <Pressable onPress={handleAddMember} style={styles.addIcon}>
              <Plus size={24} color={theme.colors.aperitivoSpritz} weight="bold" />
            </Pressable>
          </CrumpledCard>

          <View style={styles.membersList}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberTag}>
                <Text style={styles.memberTagName}>{member.name}</Text>
                <Pressable onPress={() => handleRemoveMember(member.id)}>
                  <Trash size={16} color={theme.colors.white} weight="bold" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <LucaButton
            title="Create Trip"
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || members.length === 0}
            style={styles.createButton}
          />
          <LucaButton
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
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
  inputCard: {
    padding: 0, // Reset padding for input container
    backgroundColor: theme.colors.white,
  },
  input: {
    ...theme.typography.body,
    padding: 16,
    color: theme.colors.burntInk,
    minHeight: 56,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  addMemberCard: {
    padding: 0,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  memberInput: {
    ...theme.typography.body,
    flex: 1,
    padding: 16,
    color: theme.colors.burntInk,
    minHeight: 56,
  },
  addIcon: {
    padding: 8,
  },
  membersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  memberTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.burntInk,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    transform: [{ rotate: "-1deg" }],
  },
  memberTagName: {
    ...theme.typography.body,
    color: theme.colors.electricAmaro,
    fontFamily: "Syne_700Bold",
    fontSize: 14,
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
  createButton: {
    marginBottom: 8,
  },
});
