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
const calculateBalances = (expenses, members) => {
    const balances = {};

    // Initialize balances
    members.forEach((member) => {
        balances[member.user.toString()] = 0; // Use user ID as key
    });

    // Calculate balances from expenses
    expenses.forEach((expense) => {
        const { amount, payer, shares, splitType } = expense;
        const payerId = payer.toString();

        // Payer paid the full amount
        if (balances[payerId] !== undefined) {
            balances[payerId] += parseFloat(amount);
        }

        if (splitType === "unequal" || splitType === "shares") {
            // Custom split
            shares.forEach((share) => {
                const memberId = share.user.toString();
                if (balances[memberId] !== undefined) {
                    balances[memberId] -= parseFloat(share.amount);
                }
            });
        } else {
            // Equal split
            // Assuming shares contains all involved members for equal split too
            const shareAmount = parseFloat(amount) / shares.length;
            shares.forEach((share) => {
                const memberId = share.user.toString();
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
 * @returns {Array} - Array of {from, to, amount} transfers
 */
const calculateSettlements = (balances) => {
    const settlements = [];

    // Create arrays of debtors and creditors
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([memberId, balance]) => {
        if (balance < -0.01) {
            // Owes money
            debtors.push({ memberId, amount: Math.abs(balance) });
        } else if (balance > 0.01) {
            // Should receive money
            creditors.push({ memberId, amount: balance });
        }
    });

    // Sort by amount (descending) for greedy approach
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let i = 0,
        j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const transferAmount = Math.min(debtor.amount, creditor.amount);

        if (transferAmount > 0.01) {
            settlements.push({
                from: debtor.memberId,
                to: creditor.memberId,
                amount: Math.round(transferAmount * 100) / 100,
            });
        }

        debtor.amount -= transferAmount;
        creditor.amount -= transferAmount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return settlements;
};

module.exports = { calculateBalances, calculateSettlements };
