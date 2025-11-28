import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { CheckCircle, Users, Receipt, CurrencyDollar } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ArchiveScreen({ navigation }) {
  const { groups } = useGroups();
  const insets = useSafeAreaInsets();

  // Filter settled/archived groups
  const settledGroups = groups.filter((group) => group.isSettled);

  const renderGroupItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("GroupDetails", { groupId: item.id })}
    >
      <CrumpledCard style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={styles.settledBadge}>
            <CheckCircle size={14} color={theme.colors.white} weight="fill" />
            <Text style={styles.settledText}>Settled</Text>
          </View>
        </View>

        {item.description && (
          <Text style={styles.groupDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}

        <View style={styles.divider} />

        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Users size={20} color={theme.colors.warmAsh} />
            <Text style={styles.statValue}>{item.members.length}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Receipt size={20} color={theme.colors.warmAsh} />
            <Text style={styles.statValue}>{item.expenses.length}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statItem}>
            <CurrencyDollar size={20} color={theme.colors.warmAsh} />
            <Text style={[styles.statValue, { color: theme.colors.aperitivoSpritz }]}>
              ${item.totalExpenses.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.settledDate}>
          Settled on {new Date(item.settledAt).toLocaleDateString()}
        </Text>
      </CrumpledCard>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>The Archives</Text>
        <Text style={styles.subtitle}>Memories of paid debts</Text>
      </View>

      {settledGroups.length > 0 ? (
        <FlatList
          data={settledGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🕸️</Text>
          <Text style={styles.emptyText}>No settled trips yet</Text>
          <Text style={styles.emptySubtext}>
            Once you settle up, trips will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.oldReceipt,
  },
  header: {
    paddingHorizontal: theme.spacing.homePadding,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.burntInk,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
  },
  listContent: {
    padding: theme.spacing.homePadding,
    paddingBottom: 100,
  },
  groupCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.white,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  groupName: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    flex: 1,
    marginRight: 12,
  },
  settledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.electricAmaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    transform: [{ rotate: "2deg" }],
  },
  settledText: {
    ...theme.typography.micro,
    color: theme.colors.burntInk,
    textTransform: "uppercase",
  },
  groupDescription: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.oldReceipt,
    marginBottom: 16,
  },
  groupStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...theme.typography.title2,
    fontSize: 18,
    color: theme.colors.burntInk,
    marginTop: 4,
  },
  statLabel: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.warmAsh,
  },
  settledDate: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
    textAlign: "center",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    marginBottom: 8,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    textAlign: "center",
  },
});
