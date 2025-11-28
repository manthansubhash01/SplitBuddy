import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useGroups } from "../context/GroupContext";
import { useTheme } from "../context/ThemeContext";

export default function ArchiveScreen({ navigation }) {
  const { colors } = useTheme();
  const { groups } = useGroups();

  // Filter settled/archived groups
  const settledGroups = groups.filter((group) => group.isSettled);

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() =>
        navigation.navigate("GroupsTab", {
          screen: "GroupDetails",
          params: { groupId: item.id },
        })
      }
    >
      <View style={styles.groupHeader}>
        <Text style={[styles.groupName, { color: colors.text }]}>{item.name}</Text>
        <View style={[styles.settledBadge, { backgroundColor: colors.success }]}>
          <Text style={styles.settledText}>✓ Settled</Text>
        </View>
      </View>

      {item.description && (
        <Text style={[styles.groupDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      )}

      <View style={styles.groupStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Members</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{item.members.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{item.expenses.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            ₹{item.totalExpenses.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={[styles.settledDate, { color: colors.textTertiary }]}>
        Settled on {new Date(item.settledAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity >
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {settledGroups.length > 0 ? (
        <FlatList
          data={settledGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No settled trips yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Settled trips will appear here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  groupCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 2,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  settledBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settledText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  groupStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  settledDate: {
    fontSize: 12,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
