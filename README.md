
# SplitBuddy – Group Expense & Bill Splitter

SplitBuddy is a simple, offline‑friendly app that helps friends fairly split shared expenses for trips, parties, and group activities. It focuses on quick entry, clear settlements, and zero‑friction usage (no sign‑up or login for members).

---

## 🎯 Key Features

- Create multiple trips/groups (e.g., “Goa Trip 2025”, “Flat Rent”, “Birthday Party”).
- Add members by name only – no email, phone, or login required.
- Add, edit, and delete expenses with full flexibility.
- Automatic calculation of who owes whom and how much.
- Smart suggested settlements with minimal number of payments.
- Per‑trip activity log and “Settle Trip” archive option.

---

## 🧩 Use Case / Client Brief

A small group of friends regularly go on trips and host parties. Every time, different people pay for cabs, food, hotel, tickets, etc., and at the end they struggle with:

- Remembering who paid for what.
- Manually calculating each person’s share.
- Figuring out the minimum transfers needed to settle up.

SplitBuddy solves this by acting as a shared ledger for a trip: one person can manage it on their phone and share the final settlement details with everyone at the end.

---

## 📁 Core Concepts

### Trips / Groups

A **Trip/Group** is a container for all related expenses and members.  
Examples:
- Goa Trip – Jan 2025  
- College Farewell Party  
- Flat 301 – Monthly Expenses  

Each trip has:
- A title  
- Optional description (e.g., “3‑day Goa trip with college friends”)  
- List of members  
- List of expenses  
- Activity log  
- Settlement status (Active / Settled & Archived)

### Members

- Members are added **per trip** by name (e.g., “Rahul”, “Aditi”, “Neha”).
- No login, password, or online account creation is required.
- Same person can appear in multiple trips independently.

---

## 💵 Expenses Module

### Adding an Expense

Each expense contains:

- **Title** – e.g., “Lunch at Cafe”, “Cab from Airport”, “Resort Booking”
- **Amount** – total cost (e.g., 1500.00)
- **Payer** – who actually paid the amount (selected from trip members)
- **Participants** – which members share this cost
- **Split Type (optional, future‑scope)**  
  - Equal split (default)  
  - Custom shares / percentages (can be added later)
- **Optional receipt photo** – attach an image of the bill
- **Date & time** – auto‑captured, editable if needed
- **Notes (optional)** – e.g., “Included breakfast”, “Late night cab”

### Editing & Deleting

- Any expense can be edited (title, amount, payer, participants, notes, date).
- Expenses can be deleted if added by mistake.
- All changes are logged in the trip’s **Activity Log**.

---

## 📊 Calculations & Settlements

### Per‑Member Balances

For each member in a trip, the app will calculate:

- **Total Paid** – sum of all expenses where the member is the payer.
- **Total Share** – how much they *should* pay based on their participation.
- **Net Balance** = Total Paid − Total Share  
  - Positive → member should **receive** money.  
  - Negative → member **owes** money.  

On the UI, each member will have a card like:

- Rahul → Owes ₹500  
- Aditi → Should receive ₹800  
- Neha → Owes ₹300  

### Suggested Settlements

The app will generate a list like:

- Rahul pays Aditi ₹500  
- Neha pays Aditi ₹300  

This keeps the number of payments as low as possible while fully settling the trip.

---

## ✅ “Settle Trip” & Archiving

When everyone has paid/received according to the suggested transfers:

- The user can tap **“Settle Trip”**.
- The trip becomes **Read‑only Archived**:
  - Cannot add/edit/delete expenses.
  - Full history, balances, and activity log remain visible.
- This is useful for future reference or disputes.

---

## 📝 Activity Log

Every trip has a chronological **Activity Log**, for example:

- [10:32 AM] Rahul added expense “Lunch at Cafe” – ₹1200  
- [10:40 AM] Aditi edited expense “Cab” (amount changed 600 → 800)  
- [11:05 AM] Neha deleted expense “Snacks”  

This improves transparency and avoids confusion, as everyone can see *what changed and when*.

---

## 🧪 Example Flow

1. Create a new trip: **“Goa Trip 2025”**.  
2. Add members: **Rahul**, **Aditi**, **Neha**, **Rohit**.  
3. Add expenses as they happen:
   - “Train Tickets” – paid by Rahul, shared by all 4.
   - “Dinner Day 1” – paid by Aditi, shared by all 4.
   - “Bike Rent” – paid by Rohit, shared only by Rohit & Rahul.
4. At the end, open **Settlements**:
   - View each person’s summary (to pay / to receive).
   - Use **Suggested Transfers** to see who should pay whom.
5. Once all payments are done, tap **“Settle Trip”** and archive it.

---

## 🛠️ Technical Overview (for developers)

- **Frontend**: Any stack (e.g., React / Flutter / Android Native) – focus on offline‑friendly UI.
- **Core entities**: Trip, Member, Expense, Settlement, ActivityLog.
- **Storage**: Local database (e.g., SQLite/Room) or backend API, depending on scope.
- **Future enhancements**:
  - Online sync & sharing with other group members.
  - Authentication for cloud backup.
  - Different split types (percentage, shares, itemized bills).
  - Currency selection and multi‑currency support.

---

## 📚 Project Goals

- Remove friction from splitting group expenses.
- Provide clear, transparent and trustable calculations.
- Keep the UX simple enough that **one person can manage the whole trip** and share a final screenshot/PDF with others.
- Make the app suitable as a **college mini‑project / portfolio project** with clean architecture and clear documentation.

---

## 🚀 Getting Started (Template)

You can later fill these sections according to your tech stack:

