import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { PulseIcon } from "../components/ui/PulseIcon";
import { Plus, Users, ArrowRight } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupsScreen({ navigation }) {
  const { groups } = useGroups();
  const insets = useSafeAreaInsets();

  const activeGroups = groups.filter((g) => !g.isSettled);
  const totalDebt = activeGroups.reduce((sum, g) => sum + g.totalExpenses, 0);

  const renderTripCard = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("GroupDetails", { groupId: item.id })}
    >
      <CrumpledCard style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripName}>{item.name}</Text>
          <Text style={styles.tripAmount}>
            ${item.totalExpenses.toFixed(0)}
          </Text>
        </View>
        <View style={styles.tripDetails}>
          <View style={styles.memberCount}>
            <Users size={16} color={theme.colors.warmAsh} weight="fill" />
            <Text style={styles.tripMembers}>{item.members?.length || 0}</Text>
          </View>
          {item.description && (
            <Text style={styles.tripDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>

          <ArrowRight size={16} color={theme.colors.tomatoRed} weight="bold" />

        </View>
      </CrumpledCard>
    </Pressable>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>All Trips</Text>
        <Text style={styles.subtitle}>Manage Your Shares</Text>
      </View>

      <View style={styles.statsContainer}>
        <CrumpledCard style={styles.statCard}>
          <Text style={styles.statValue}>{activeGroups.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </CrumpledCard>
        <CrumpledCard style={styles.statCard}>

          <Text style={[styles.statValue, { color: theme.colors.tomatoRed }]}>

            ${totalDebt.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Total Debt</Text>
        </CrumpledCard>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <CrumpledCard style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🍴</Text>
      <Text style={styles.emptyTitle}>No Trips Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create one and split the sauce!
      </Text>
    </CrumpledCard>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={activeGroups}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <Pressable onPress={() => navigation.navigate("CreateGroup")}>
          <PulseIcon style={styles.fab}>
            <Plus size={32} color={theme.colors.burntInk} weight="bold" />
          </PulseIcon>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.oldReceipt,
  },
  listContainer: {
    padding: theme.spacing.homePadding,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.burntInk,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: theme.colors.white,
  },
  statValue: {
    ...theme.typography.title1,
    color: theme.colors.burntInk,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tripCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.white,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tripName: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    flex: 1,
    marginRight: 12,
  },
  tripAmount: {
    ...theme.typography.title2,
    color: theme.colors.tomatoRed,
    fontFamily: "Syne_700Bold",
  },
  tripDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  memberCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.oldReceipt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tripMembers: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
  },
  tripDescription: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  viewDetailsText: {
    ...theme.typography.micro,
    color: theme.colors.tomatoRed,
    textTransform: "uppercase",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: theme.colors.white,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    ...theme.typography.title1,
    color: theme.colors.burntInk,
    marginBottom: 12,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.tomatoRed,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.tomatoRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.burntInk,
  },
});
