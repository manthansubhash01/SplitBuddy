import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from "react-native";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { PulseIcon } from "../components/ui/PulseIcon";
import { Plus, Users, Receipt, ArrowRight } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const { groups } = useGroups();
  const insets = useSafeAreaInsets();

  const activeGroups = groups.filter((g) => !g.isSettled).slice(0, 3);
  const totalBalance = groups.reduce(
    (sum, g) => sum + (g.isSettled ? 0 : g.totalExpenses),
    0
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to the chaos!</Text>
        </View>

        <View style={styles.statsContainer}>
          <CrumpledCard style={styles.statCard}>
            <Text style={styles.statValue}>{groups.length}</Text>
            <Text style={styles.statLabel}>Active Trips</Text>
          </CrumpledCard>
          <CrumpledCard style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.aperitivoSpritz }]}>
              ${totalBalance.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total Chaos</Text>
          </CrumpledCard>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            {groups.length > 0 && (
              <Pressable onPress={() => navigation.navigate("GroupsTab")}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            )}
          </View>

          {activeGroups.length > 0 ? (
            activeGroups.map((group) => (
              <Pressable
                key={group.id}
                onPress={() =>
                  navigation.navigate("GroupsTab", {
                    screen: "GroupDetails",
                    params: { groupId: group.id },
                  })
                }
              >
                <CrumpledCard style={styles.activityCard}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>{group.name}</Text>
                    <View style={styles.memberRow}>
                      <Users size={16} color={theme.colors.warmAsh} />
                      <Text style={styles.activityMembers}>
                        {group.members?.length || 0} friends
                      </Text>
                    </View>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={styles.activityAmount}>
                      ${group.totalExpenses.toFixed(0)}
                    </Text>
                    <ArrowRight size={20} color={theme.colors.burntInk} />
                  </View>
                </CrumpledCard>
              </Pressable>
            ))
          ) : (
            <CrumpledCard style={styles.emptyActivity}>
              <Text style={styles.emptyIcon}>🕸️</Text>
              <Text style={styles.emptyText}>No expenses? Living like a hermit?</Text>
              <Text style={styles.emptySubtext}>
                Add some chaos and split it!
              </Text>
            </CrumpledCard>
          )}
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate("GroupsTab", {
              screen: "CreateGroup",
            })
          }
        >
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
  scrollContent: {
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
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
  },
  seeAllText: {
    ...theme.typography.body,
    color: theme.colors.aperitivoSpritz,
    fontFamily: "Syne_700Bold",
  },
  activityCard: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    ...theme.typography.title2,
    fontSize: 20,
    color: theme.colors.burntInk,
    marginBottom: 4,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activityMembers: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityAmount: {
    ...theme.typography.title2,
    color: theme.colors.aperitivoSpritz,
  },
  emptyActivity: {
    alignItems: "center",
    padding: 32,
    backgroundColor: theme.colors.white,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
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
    backgroundColor: theme.colors.aperitivoSpritz,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.aperitivoSpritz,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.burntInk,
  },
});
