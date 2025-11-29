import React, { createContext, useContext, useState, useEffect } from "react";
import {
  calculateBalances,
  calculateSettlements,
} from "../utils/settlementCalculations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

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

  // Load groups when user changes
  useEffect(() => {
    if (user) {
      loadGroups(user.id);
    } else {
      setGroups([]);
      setIsLoaded(false);
    }
  }, [user]);

  // Save groups whenever they change, but only if data has been loaded
  useEffect(() => {
    if (user && isLoaded) {
      saveGroups(user.id, groups);
    }
  }, [groups, user, isLoaded]);

  const loadGroups = async (userId) => {
    try {
      const storedGroups = await AsyncStorage.getItem(
        `@splitbuddy_groups_${userId}`
      );
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Failed to load groups", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveGroups = async (userId, groupsToSave) => {
    try {
      await AsyncStorage.setItem(
        `@splitbuddy_groups_${userId}`,
        JSON.stringify(groupsToSave)
      );
    } catch (error) {
      console.error("Failed to save groups", error);
    }
  };

  const addGroup = (group) => {
    const newGroup = {
      id: Date.now().toString(),
      name: group.name,
      description: group.description || "",
      members: group.members || [],
      expenses: [],
      totalExpenses: 0,
      isSettled: false,
      settledAt: null,
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [newGroup, ...prev]);
    return newGroup;
  };

  const updateGroup = (groupId, updates) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  const deleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
  };

  const getGroup = (groupId) => {
    return groups.find((group) => group.id === groupId);
  };

  const addExpenseToGroup = (groupId, expense) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const newExpense = {
            id: Date.now().toString(),
            ...expense,
            createdAt: new Date().toISOString(),
          };

          const updatedExpenses = [newExpense, ...group.expenses];
          const balances = calculateBalances(updatedExpenses, group.members);
          const settlements = calculateSettlements(balances, group.members);
          const isSettled =
            settlements.length === 0 && updatedExpenses.length > 0;

          return {
            ...group,
            expenses: updatedExpenses,
            totalExpenses: group.totalExpenses + parseFloat(expense.amount),
            isSettled: isSettled,
            settledAt: isSettled ? new Date().toISOString() : null,
          };
        }
        return group;
      })
    );
  };

  const updateExpenseInGroup = (groupId, expenseId, updates) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const oldExpense = group.expenses.find((e) => e.id === expenseId);
          const oldAmount = oldExpense ? parseFloat(oldExpense.amount) : 0;
          const newAmount = updates.amount
            ? parseFloat(updates.amount)
            : oldAmount;

          const updatedExpenses = group.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                  ...expense,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : expense
          );

          const balances = calculateBalances(updatedExpenses, group.members);
          const settlements = calculateSettlements(balances, group.members);
          const isSettled =
            settlements.length === 0 && updatedExpenses.length > 0;

          return {
            ...group,
            expenses: updatedExpenses,
            totalExpenses: group.totalExpenses - oldAmount + newAmount,
            isSettled: isSettled,
            settledAt: isSettled ? new Date().toISOString() : null,
          };
        }
        return group;
      })
    );
    return true;
  };

  const deleteExpenseFromGroup = (groupId, expenseId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const expenseToDelete = group.expenses.find(
            (e) => e.id === expenseId
          );
          if (!expenseToDelete) return group;

          const updatedExpenses = group.expenses.filter(
            (expense) => expense.id !== expenseId
          );

          const balances = calculateBalances(updatedExpenses, group.members);
          const settlements = calculateSettlements(balances, group.members);
          const isSettled =
            settlements.length === 0 && updatedExpenses.length > 0;

          return {
            ...group,
            expenses: updatedExpenses,
            totalExpenses:
              group.totalExpenses - parseFloat(expenseToDelete.amount),
            isSettled: isSettled,
            settledAt: isSettled ? new Date().toISOString() : null,
          };
        }
        return group;
      })
    );
    return true;
  };

  const getExpense = (groupId, expenseId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;
    return group.expenses.find((e) => e.id === expenseId);
  };

  const addMember = (groupId, memberName) => {
    if (!memberName.trim()) return null;

    const newMember = {
      id: Date.now().toString(),
      name: memberName.trim(),
      addedAt: new Date().toISOString(),
    };

    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: [...group.members, newMember],
          };
        }
        return group;
      })
    );

    return newMember;
  };

  const updateMember = (groupId, memberId, newName) => {
    if (!newName.trim()) return false;

    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.map((member) =>
              member.id === memberId
                ? { ...member, name: newName.trim() }
                : member
            ),
          };
        }
        return group;
      })
    );

    return true;
  };

  const deleteMember = (groupId, memberId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter((member) => member.id !== memberId),
          };
        }
        return group;
      })
    );

    return true;
  };

  const settleGroup = (groupId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isSettled: true,
              settledAt: new Date().toISOString(),
            }
          : group
      )
    );
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
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};
