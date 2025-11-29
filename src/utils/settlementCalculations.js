/**
 * Settlement Calculation Utilities
 * Calculates who owes whom and suggests minimal payment transfers
 */

/**
 * Calculate net balance for each member
 * @param {Array} expenses - Array of expense objects
 * @param {Array} members - Array of member objects
 * @returns {Object} - Map of memberId to net balance (positive = receives, negative = owes)
 */
export const calculateBalances = (expenses, members) => {
    const balances = {};

    // Initialize balances
    members.forEach(member => {
        balances[member.id] = 0;
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

/**
 * Calculate minimal settlement transfers
 * Uses greedy algorithm to minimize number of transactions
 * @param {Object} balances - Map of memberId to balance
 * @param {Array} members - Array of member objects
 * @returns {Array} - Array of {from, to, amount} transfers
 */
export const calculateSettlements = (balances, members) => {
    const settlements = [];

    // Create arrays of debtors and creditors
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([memberId, balance]) => {
        if (balance < -0.01) { // Owes money (with small tolerance for floating point)
            debtors.push({ memberId, amount: Math.abs(balance) });
        } else if (balance > 0.01) { // Should receive money
            creditors.push({ memberId, amount: balance });
        }
    });

    // Sort by amount (descending) for greedy approach
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const transferAmount = Math.min(debtor.amount, creditor.amount);

        if (transferAmount > 0.01) { // Only add if meaningful amount
            settlements.push({
                from: debtor.memberId,
                to: creditor.memberId,
                amount: Math.round(transferAmount * 100) / 100, // Round to 2 decimals
            });
        }

        debtor.amount -= transferAmount;
        creditor.amount -= transferAmount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
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

    const netBalance = totalPaid - totalOwed;

    return {
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalOwed: Math.round(totalOwed * 100) / 100,
        netBalance: Math.round(netBalance * 100) / 100,
    };
};
