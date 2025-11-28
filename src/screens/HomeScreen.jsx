import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGroups } from "../context/GroupContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function HomeScreen({ navigation }) {
  const { groups } = useGroups();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const activeGroups = groups.filter((g) => g.totalExpenses > 0).slice(0, 3);
  const totalBalance = groups.reduce((sum, g) => sum + g.totalExpenses, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={styles.title}>{t("home.dashboard")}</Text>
        <Text style={styles.subtitle}>{t("home.welcomeBack")}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {groups.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {t("home.totalGroups")}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            ₹{totalBalance.toFixed(2)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {t("home.totalExpenses")}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("home.recentActivity")}
          </Text>
          {groups.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate("GroupsTab")}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t("home.seeAll")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {activeGroups.length > 0 ? (
          activeGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={[styles.activityCard, { backgroundColor: colors.card }]}
              onPress={() =>
                navigation.navigate("GroupsTab", {
                  screen: "GroupDetails",
                  params: { groupId: group.id },
                })
              }
            >
              <View style={styles.activityInfo}>
                <Text style={[styles.activityName, { color: colors.text }]}>
                  {group.name}
                </Text>
                <Text
                  style={[
                    styles.activityMembers,
                    { color: colors.textSecondary },
                  ]}
                >
                  {group.members?.length || 0} {t("common.members").toLowerCase()}
                </Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.primary }]}>
                ₹{group.totalExpenses.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={[styles.emptyActivity, { backgroundColor: colors.card }]}
          >
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t("home.noActivity")}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              {t("home.noActivitySubtext")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("home.quickActions")}
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card }]}
          onPress={() =>
            navigation.navigate("GroupsTab", {
              screen: "CreateGroup",
            })
          }
        >
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={[styles.actionText, { color: colors.text }]}>
            {t("home.createNewGroup")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("GroupsTab")}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={[styles.actionText, { color: colors.text }]}>
            {t("home.viewAllGroups")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 10 }]}
          onPress={() => {
            Alert.alert(
              t("home.logOut"),
              t("home.logOut") + "?",
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("home.logOut"),
                  style: "destructive",
                  onPress: () => {
                    // Reset the root navigator state to show Login screen
                    // We use getParent() to access the stack navigator since we are in a tab navigator
                    navigation.getParent()?.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.actionIcon}>🚪</Text>
          <Text style={[styles.actionText, { color: "#EF4444" }]}>
            {t("home.logOut")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activityMembers: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  activityAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  emptyActivity: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  quickActions: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
