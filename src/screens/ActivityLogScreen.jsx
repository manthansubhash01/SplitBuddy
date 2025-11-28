import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useGroups } from "../context/GroupContext";
import { useTheme } from "../context/ThemeContext";

export default function ActivityLogScreen({ route }) {
  const { colors } = useTheme();
  const { getGroup } = useGroups();
  const { groupId } = route.params || {};
  const group = getGroup(groupId);

  if (!group) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Group not found
        </Text>
      </View>
    );
  }

  const activityLog = group.activityLog || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case "expense_added":
        return "➕";
      case "expense_deleted":
        return "🗑️";
      case "expense_updated":
        return "✏️";
      default:
        return "📝";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "expense_added":
        return colors.success;
      case "expense_deleted":
        return colors.error;
      case "expense_updated":
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const renderActivityItem = ({ item }) => (
    <View
      style={[
        styles.activityCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.activityHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getActivityColor(item.type) + "20" }]}>
          <Text style={styles.icon}>{getActivityIcon(item.type)}</Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={[styles.activityDescription, { color: colors.text }]}>
            {item.description}
          </Text>
          <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {activityLog.length > 0 ? (
        <FlatList
          data={activityLog}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>📋</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No activity yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Actions will appear here
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
  activityCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
