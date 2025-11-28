import React, { createContext, useContext, useState } from "react";

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);

  const addGroup = (group) => {
    const newGroup = {
      id: Date.now().toString(),
      name: group.name,
      description: group.description || "",
      members: group.members || [],
      expenses: [],
      totalExpenses: 0,
      activityLog: [],
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

          const activityEntry = {
            id: Date.now().toString() + "_activity",
            type: "expense_added",
            description: `Added expense: ${expense.title} (₹${expense.amount})`,
            timestamp: new Date().toISOString(),
            expenseId: newExpense.id,
          };

          return {
            ...group,
            expenses: [newExpense, ...group.expenses],
            totalExpenses: group.totalExpenses + parseFloat(expense.amount),
            activityLog: [activityEntry, ...(group.activityLog || [])],
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

          const activityEntry = {
            id: Date.now().toString() + "_activity",
            type: "expense_updated",
            description: `Updated expense: ${updates.title || oldExpense.title} (₹${updates.amount || oldAmount})`,
            timestamp: new Date().toISOString(),
            expenseId: expenseId,
          };

          return {
            ...group,
            expenses: group.expenses.map((expense) =>
              expense.id === expenseId
                ? {
                  ...expense,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
                : expense
            ),
            totalExpenses: group.totalExpenses - oldAmount + newAmount,
            activityLog: [activityEntry, ...(group.activityLog || [])],
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
          const expenseToDelete = group.expenses.find((e) => e.id === expenseId);
          if (!expenseToDelete) return group;

          const activityEntry = {
            id: Date.now().toString() + "_activity",
            type: "expense_deleted",
            description: `Deleted expense: ${expenseToDelete.title} (₹${expenseToDelete.amount})`,
            timestamp: new Date().toISOString(),
            expenseId: expenseId,
          };

          return {
            ...group,
            expenses: group.expenses.filter((e) => e.id !== expenseId),
            totalExpenses: group.totalExpenses - parseFloat(expenseToDelete.amount),
            activityLog: [activityEntry, ...(group.activityLog || [])],
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
    deleteExpense: deleteExpenseFromGroup, // Alias for backward compatibility if needed
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
