import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useGroups } from "../context/GroupContext";

export default function HomeScreen({ navigation }) {
  const { groups } = useGroups();

  const renderTripCard = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() =>
        navigation.navigate("GroupsTab", {
          screen: "GroupDetails",
          params: { groupId: item.id },
        })
      }
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripName}>{item.name}</Text>
        <Text style={styles.tripAmount}>${item.totalExpenses.toFixed(2)}</Text>
      </View>
      <Text style={styles.tripMembers}>
        {item.members?.length || 0} members
      </Text>
      {item.description && (
        <Text style={styles.tripDescription} numberOfLines={1}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏖️</Text>
      <Text style={styles.emptyTitle}>No Trips Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first trip to start splitting expenses with friends
      </Text>
      <Pressable
        style={styles.createButton}
        onPress={() =>
          navigation.navigate("GroupsTab", {
            screen: "CreateGroup",
          })
        }
      >
        <Text style={styles.createButtonText}>Create Your First Trip</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        {groups.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("GroupsTab", {
                screen: "CreateGroup",
              })
            }
          >
            <Text style={styles.addButtonText}>+ New Trip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={groups}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          groups.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tripCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  tripAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  tripMembers: {
    fontSize: 14,
    color: "#666",
  },
  tripDescription: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
