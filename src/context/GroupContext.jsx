import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { calculateBalances, calculateSettlements } from "../utils/settlementCalculations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import io from "socket.io-client";
import client, { SOCKET_URL } from "../api/client";

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize Socket
  useEffect(() => {
    if (user && user.id !== 'guest') {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        // Join user-specific room for personal notifications (like being added to a group)
        newSocket.emit("join_user_room", user.id);
      });

      // Listen for updates
      newSocket.on("expense_added", (expense) => {
        console.log("New expense received via socket:", expense);
        // Refresh groups to get the latest data
        // Optimization: We could just append to the specific group locally
        loadGroups();
      });

      newSocket.on("group_settled", (group) => {
        console.log("Group settled via socket:", group);
        loadGroups();
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  // Join group rooms when groups are loaded
  useEffect(() => {
    if (socket && groups.length > 0) {
      groups.forEach(group => {
        socket.emit("join_group", group.id);
      });
    }
  }, [socket, groups]);

  // Load groups when user changes
  useEffect(() => {
    if (user) {
      loadGroups();
    } else {
      setGroups([]);
      setIsLoaded(false);
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      // If guest, maybe load local? For now, assume backend only for logged in users
      if (user?.id === 'guest') {
        const storedGroups = await AsyncStorage.getItem(`@splitbuddy_groups_guest`);
        if (storedGroups) setGroups(JSON.parse(storedGroups));
        return;
      }

      const { data } = await client.get("/groups");
      // Backend returns groups with populated members. 
      // We might need to map them to match frontend structure if needed, 
      // but the schema seems compatible (members array, expenses array).
      // Ensure expenses are initialized if missing
      const processedGroups = data.map(g => ({
        ...g,
        id: g._id, // Map _id to id for frontend compatibility
        expenses: (g.expenses || []).map(e => {
          const payerId = e.payer?._id || e.payer;
          const sharedMembers = (e.shares || []).map(s => s.user?._id || s.user);
          const splits = {};
          if (e.splitType === 'unequal') {
            (e.shares || []).forEach(s => {
              const userId = s.user?._id || s.user;
              splits[userId] = s.amount;
            });
          }

          return {
            ...e,
            id: e._id, // Map _id to id for frontend compatibility
            payer: payerId,
            sharedMembers,
            splits
          };
        }),
        totalExpenses: (g.expenses || []).reduce((sum, e) => {
          if (e.isPayment) return sum;
          const amount = parseFloat(e.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0),
        members: g.members.map(m => ({
          id: m.user._id,
          name: m.user.name,
          email: m.user.email,
          status: m.status
        }))
      }));
      setGroups(processedGroups);
    } catch (error) {
      console.error("Failed to load groups", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addGroup = async (groupData) => {
    try {
      if (user?.id === 'guest') {
        // Local logic for guest
        const newGroup = {
          id: Date.now().toString(),
          name: groupData.name,
          description: groupData.description || "",
          members: groupData.members || [],
          expenses: [],
          totalExpenses: 0,
          isSettled: false,
          createdAt: new Date().toISOString(),
        };
        setGroups(prev => [newGroup, ...prev]);
        await AsyncStorage.setItem(`@splitbuddy_groups_guest`, JSON.stringify([newGroup, ...groups]));
        return newGroup;
      }

      const { data } = await client.post("/groups", {
        name: groupData.name,
        description: groupData.description,
        members: groupData.members // Array of { id, name, email }
      });

      const newGroup = {
        ...data,
        id: data._id,
        expenses: [],
        totalExpenses: 0,
        members: data.members.map(m => {
          // The backend returns the member objects. We need to match frontend structure.
          // If the backend returns populated user objects in members, great. 
          // If not (just IDs), we might need to rely on what we sent or refetch.
          // The createGroup controller returns the group doc. 
          // Mongoose might not populate members immediately unless we explicitly populate in response.
          // For now, let's just reload groups to be safe and get full data.
          return m;
        })
      };

      await loadGroups(); // Refresh to get populated data
      return newGroup;
    } catch (error) {
      console.error("Failed to create group", error);
      throw error;
    }
  };

  const addMember = async (groupId, memberNameOrUser) => {
    // If it's a string, it's a guest/local add (legacy). If object, it's a real user.
    // Since we updated UI to send user object, we should handle that.
    // But for backward compat with manual entry, check type.

    // Real backend invite
    if (user?.id !== 'guest') {
      try {
        // If memberNameOrUser is a string (manual entry), we can't invite via email unless we ask for email.
        // But CreateGroupScreen now sends objects with email.
        // GroupDetailsScreen "Add Member" also sends objects now.

        // If we just have a name (legacy), we can't really invite. 
        // We'll assume it's a user object if possible.

        // Actually, GroupDetailsScreen sends the whole user object from search.
        const email = memberNameOrUser.email;
        if (email) {
          await client.post(`/groups/${groupId}/invite`, { email });
          await loadGroups(); // Refresh
          return;
        }
      } catch (error) {
        console.error("Failed to invite member", error);
        throw error;
      }
    }

    // ... (Keep local logic for guest mode if needed, or just return)
  };

  // ... (Other functions like updateGroup, deleteGroup need similar updates or can be left as TODO if not critical for this step)
  // For now, let's keep the read-only parts working via loadGroups.

  // We need to expose the same interface
  const getGroup = (groupId) => {
    return groups.find((group) => group.id === groupId);
  };

  const updateGroup = async (groupId, updates) => {
    try {
      if (user?.id === 'guest') return; // TODO: Guest logic
      await client.put(`/groups/${groupId}`, updates);
      await loadGroups();
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      if (user?.id === 'guest') return;
      await client.delete(`/groups/${groupId}`);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error("Failed to delete group", error);
    }
  };

  const addExpenseToGroup = async (groupId, expense) => {
    try {
      if (user?.id === 'guest') return;

      await client.post(`/groups/${groupId}/expenses`, {
        description: expense.description || expense.title,
        amount: parseFloat(expense.amount),
        payer: expense.payer,
        splitType: expense.splitType || 'equal',
        shares: expense.shares || [],
        receiptUri: expense.receiptUri || expense.receiptUrl
      });

      await loadGroups();
    } catch (error) {
      console.error("Failed to add expense", error);
      throw error;
    }
  };

  // TODO: Implement updateExpenseInGroup and deleteExpenseFromGroup with backend
  const updateExpenseInGroup = async (groupId, expenseId, updates) => {
    try {
      if (user?.id === 'guest') return;

      // Map updates to backend structure if needed
      const payload = {
        ...updates,
        description: updates.title || updates.description,
        splitType: updates.splitType || (updates.splitMode === 'unequal' ? 'unequal' : 'equal'),
        shares: updates.shares || updates.splits, // Handle different naming conventions
        receiptUri: updates.receiptUri || updates.receiptUrl
      };

      await client.put(`/expenses/${expenseId}`, payload);
      await loadGroups();
      return true;
    } catch (error) {
      console.error("Failed to update expense", error);
      throw error;
    }
  };

  const deleteExpenseFromGroup = async (groupId, expenseId) => {
    try {
      if (user?.id === 'guest') return;
      await client.delete(`/expenses/${expenseId}`);
      await loadGroups();
      return true;
    } catch (error) {
      console.error("Failed to delete expense", error);
      throw error;
    }
  };

  const getExpense = (groupId, expenseId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;
    return group.expenses.find((e) => e.id === expenseId);
  };

  const updateMember = async (groupId, memberId, newName) => {
    // Placeholder for now
    console.log("Update member not fully implemented yet");
    return true;
  };

  const deleteMember = async (groupId, memberId) => {
    // Placeholder for now
    console.log("Delete member not fully implemented yet");
    return true;
  };

  const settleGroup = async (groupId) => {
    try {
      if (user?.id === 'guest') return;
      await client.post(`/groups/${groupId}/settle`);
      await loadGroups();
    } catch (error) {
      console.error("Failed to settle group", error);
      throw error;
    }
  };

  const value = {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroup,
    addExpenseToGroup,
    updateExpenseInGroup,
    deleteExpenseFromGroup,
    getExpense,
    addMember,
    updateMember,
    deleteMember,
    settleGroup,
    loadGroups
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};
