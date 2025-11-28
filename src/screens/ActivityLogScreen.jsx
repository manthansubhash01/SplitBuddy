import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../styles/theme";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { Receipt, PencilSimple, Trash } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActivityLogScreen() {
  const insets = useSafeAreaInsets();

  // Mock data for now, as we don't have a real activity log service yet
  const activities = [
    {
      id: 1,
      type: "add",
      text: "Added 'Dinner at Luigi's'",
      amount: "$120",
      time: "2 mins ago",
    },
    {
      id: 2,
      type: "edit",
      text: "Updated 'Taxi to Airport'",
      amount: "$45",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "delete",
      text: "Deleted 'Mistake Entry'",
      amount: null,
      time: "Yesterday",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "add":
        return <Receipt size={24} color={theme.colors.aperitivoSpritz} weight="fill" />;
      case "edit":
        return <PencilSimple size={24} color={theme.colors.sunnyTeal} weight="fill" />;
      case "delete":
        return <Trash size={24} color={theme.colors.warmAsh} weight="fill" />;
      default:
        return <Receipt size={24} color={theme.colors.burntInk} />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Recent Chaos</Text>
        <Text style={styles.subtitle}>Who did what?</Text>

        <View style={styles.list}>
          {activities.map((activity) => (
            <CrumpledCard key={activity.id} style={styles.card}>
              <View style={styles.iconContainer}>{getIcon(activity.type)}</View>
              <View style={styles.content}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.timeText}>{activity.time}</Text>
              </View>
              {activity.amount && (
                <Text style={styles.amountText}>{activity.amount}</Text>
              )}
            </CrumpledCard>
          ))}
        </View>
      </ScrollView>
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
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.oldReceipt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  activityText: {
    ...theme.typography.body,
    color: theme.colors.burntInk,
    fontSize: 15,
    marginBottom: 2,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
    fontSize: 12,
  },
  amountText: {
    ...theme.typography.title2,
    fontSize: 16,
    color: theme.colors.burntInk,
  },
});
