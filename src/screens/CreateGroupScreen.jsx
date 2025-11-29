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
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import { LucaButton } from "../components/ui/LucaButton";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { Trash, Plus, MagnifyingGlass } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import client from "../api/client";

export default function CreateGroupScreen({ navigation }) {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const insets = useSafeAreaInsets();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const { data } = await client.get(`/auth/search?q=${searchQuery}`);
          setSearchResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddMember = (user) => {
    if (members.some((m) => m.id === user._id)) {
      Alert.alert("Already added", `${user.name} is already in the crew.`);
      return;
    }

    const newMember = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    setMembers([...members, newMember]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    if (members.length === 0) {
      Alert.alert("Error", "Please add at least one member");
      return;
    }

    try {
      const newGroup = await addGroup({
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
    } catch (error) {
      Alert.alert("Error", "Failed to create trip. Please try again.");
    }
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
          <Text style={styles.label}>The Crew</Text>
          <CrumpledCard style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <MagnifyingGlass size={20} color={theme.colors.warmAsh} />
              <TextInput
                placeholder="Search by name or email..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.warmAsh}
                autoCapitalize="none"
              />
            </View>

            {isSearching && (
              <ActivityIndicator size="small" color={theme.colors.tomatoRed} style={{ marginVertical: 8 }} />
            )}

            {searchResults.length > 0 ? (
              <View style={styles.searchResultsList}>
                {searchResults.map((user) => (
                  <Pressable
                    key={user._id}
                    style={styles.searchResultItem}
                    onPress={() => handleAddMember(user)}
                  >
                    <View style={styles.resultAvatar}>
                      <Text style={styles.resultAvatarText}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultName}>{user.name}</Text>
                      <Text style={styles.resultEmail}>{user.email}</Text>
                    </View>
                    <Plus size={20} color={theme.colors.oliveGreen} />
                  </Pressable>
                ))}
              </View>
            ) : (
              searchQuery.length > 1 && !isSearching && (
                <Text style={styles.noResultsText}>No user found. Sad.</Text>
              )
            )}
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
    padding: 0,
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
  searchCard: {
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.warmAsh,
    paddingBottom: 8,
  },
  searchInput: {
    ...theme.typography.body,
    flex: 1,
    marginLeft: 8,
    color: theme.colors.burntInk,
  },
  searchResultsList: {
    marginTop: 12,
    maxHeight: 200,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  resultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.oliveGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resultAvatarText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: "bold",
  },
  resultName: {
    ...theme.typography.body,
    fontFamily: "Syne_700Bold",
    color: theme.colors.burntInk,
  },
  resultEmail: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
  },
  noResultsText: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    textAlign: "center",
    marginTop: 16,
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
    color: theme.colors.white,
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
