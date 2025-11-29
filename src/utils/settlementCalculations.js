export const calculateBalances = (expenses, members, payments = []) => {
  const balances = {};

  members.forEach((member) => {
    balances[member.id] = 0;
  });

  expenses.forEach((expense) => {
    const shareAmount = expense.amount / expense.sharedMembers.length;
    // Handle payer being either an object or an ID string
    const payerId =
      typeof expense.payer === "object" ? expense.payer.id : expense.payer;
    balances[payerId] += expense.amount;

    expense.sharedMembers.forEach((member) => {
      // Handle sharedMembers being either objects or ID strings
      const memberId = typeof member === "object" ? member.id : member;
      balances[memberId] -= shareAmount;
    });
  });


    // Calculate balances from expenses
    expenses.forEach(expense => {
        const { amount, payer, sharedMembers, splits } = expense;

        // Payer paid the full amount
        if (balances[payer] !== undefined) {
            balances[payer] += parseFloat(amount);
        }

        if (splits && Object.keys(splits).length > 0) {
            // Custom split
            Object.entries(splits).forEach(([memberId, splitAmount]) => {
                if (balances[memberId] !== undefined) {
                    balances[memberId] -= parseFloat(splitAmount);
                }
            });
        } else {
            // Equal split
            const shareAmount = parseFloat(amount) / sharedMembers.length;
            sharedMembers.forEach(memberId => {
                if (balances[memberId] !== undefined) {
                    balances[memberId] -= shareAmount;
                }
            });
        }
    });

    return balances;

};

export const calculateSettlements = (balances) => {
  const settlements = [];
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([id, balance]) => {
    if (balance < -0.01) {
      debtors.push({ memberId: id, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ memberId: id, amount: balance });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const transferAmount = Math.min(debtors[i].amount, creditors[j].amount);

    if (transferAmount > 0.01) {
      settlements.push({
        from: debtors[i].memberId,
        to: creditors[j].memberId,
        amount: Math.round(transferAmount * 100) / 100,
      });
    }

    debtors[i].amount -= transferAmount;
    creditors[j].amount -= transferAmount;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
};


/**
 * Get member summary (total paid, total owed, net balance)
 * @param {Array} expenses - Array of expense objects
 * @param {string} memberId - Member ID
 * @returns {Object} - {totalPaid, totalOwed, netBalance}
 */
export const getMemberSummary = (expenses, memberId) => {
    let totalPaid = 0;
    let totalOwed = 0;

    expenses.forEach(expense => {
        const { amount, payer, sharedMembers, splits } = expense;

        // If this member paid
        if (payer === memberId) {
            totalPaid += parseFloat(amount);
        }

        // If this member is involved in the expense
        if (splits && splits[memberId]) {
            // Custom split
            totalOwed += parseFloat(splits[memberId]);
        } else if (!splits && sharedMembers.includes(memberId)) {
            // Equal split
            totalOwed += parseFloat(amount) / sharedMembers.length;
        }

    });

    if (isSharedMember) {
      totalOwed += expense.amount / expense.sharedMembers.length;
    }
  });

  payments.forEach((payment) => {
    if (payment.from === memberId) totalPaid += payment.amount;
    if (payment.to === memberId) totalOwed += payment.amount;
  });

  const netBalance = totalPaid - totalOwed;

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalOwed: Math.round(totalOwed * 100) / 100,
    netBalance: Math.round(netBalance * 100) / 100,
  };
};
