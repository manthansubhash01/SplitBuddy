import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext();

const translations = {
    en: {
        // Common
        common: {
            welcome: "Welcome",
            logout: "Log Out",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            save: "Save",
            add: "Add",
            update: "Update",
            confirm: "Confirm",
            yes: "Yes",
            no: "No",
            ok: "OK",
            total: "Total",
            members: "Members",
            expenses: "Expenses",
            actions: "Actions",
        },
        // Login Screen
        login: {
            appName: "SplitBuddy",
            tagline: "Fair splits. Zero drama.",
            welcomeBack: "Welcome Back",
            subtitle: "Sign in to sync your trips across devices",
            email: "Email",
            emailPlaceholder: "Enter your email",
            password: "Password",
            passwordPlaceholder: "Enter your password",
            forgotPassword: "Forgot password?",
            loginButton: "Login",
            signingIn: "Signing in...",
            or: "OR",
            continueWithoutLogin: "Continue without login",
            newHere: "New here?",
            createAccount: "Create account",
        },
        // Home Screen
        home: {
            dashboard: "Dashboard",
            welcomeBack: "Welcome back!",
            totalGroups: "Total Groups",
            totalExpenses: "Total Expenses",
            recentActivity: "Recent Activity",
            seeAll: "See All",
            noActivity: "No activity yet",
            noActivitySubtext: "Create a group and add expenses to see activity",
            quickActions: "Quick Actions",
            createNewGroup: "Create New Group",
            viewAllGroups: "View All Groups",
            logOut: "Log Out",
        },
        // Groups Screen
        groups: {
            allGroups: "All Groups",
            createGroup: "Create Group",
            noGroups: "No groups yet",
            noGroupsSubtext: "Create your first group to start splitting expenses",
            groupName: "Group Name",
            description: "Description",
            addMember: "Add Member",
            memberName: "Member Name",
        },
        // Group Details Screen
        groupDetails: {
            tripNotFound: "Trip not found",
            addMember: "+ Add Member",
            noMembers: "No members yet",
            paid: "Paid",
            share: "Share",
            getsBack: "Gets back",
            owes: "Owes",
            settled: "Settled ✓",
            addExpense: "+ Add Expense",
            noExpenses: "No expenses yet",
            paidBy: "Paid by",
            splitBetween: "Split between",
            member: "member",
            settlementSummary: "Settlement Summary",
            activityLog: "Activity Log",
            addNewMember: "Add New Member",
            enterMemberName: "Enter member name",
            editMember: "Edit Member",
            removeMember: "Remove Member",
            removeConfirm: "Are you sure you want to remove",
            fromTrip: "from this trip?",
            remove: "Remove",
            removed: "Removed",
            hasBeenRemoved: "has been removed",
            success: "Success!",
            hasBeenAdded: "has been added to the trip",
            updated: "Updated!",
            memberNameUpdated: "Member name has been updated",
            oops: "Oops!",
            enterValidName: "Please enter a valid name",
            deleteExpense: "Delete Expense",
            deleteExpenseConfirm: "Are you sure you want to delete",
            deleted: "Deleted",
            expenseRemoved: "Expense has been removed",
        },
        // Add Expense Screen
        addExpense: {
            addExpense: "Add Expense",
            editExpense: "Edit Expense",
            expenseTitle: "Expense Title",
            titlePlaceholder: "e.g., Dinner, Hotel, etc.",
            amount: "Amount",
            amountPlaceholder: "Enter amount",
            paidBy: "Paid By",
            selectPayer: "Select who paid",
            splitBetween: "Split Between",
            selectMembers: "Select members to split with",
            uploadReceipt: "Upload Receipt (Optional)",
            takePhoto: "Take Photo",
            chooseFromGallery: "Choose from Gallery",
            removePhoto: "Remove Photo",
            addExpenseButton: "Add Expense",
            updateExpenseButton: "Update Expense",
            pleaseEnterTitle: "Please enter expense title",
            pleaseEnterAmount: "Please enter amount",
            pleaseSelectPayer: "Please select who paid",
            pleaseSelectMembers: "Please select at least one member to split with",
            expenseAdded: "Expense Added!",
            expenseUpdated: "Expense Updated!",
        },
        // Settlement Screen
        settlement: {
            settleTrip: "Settle Trip",
            memberBalances: "Member Balances",
            totalPaid: "Total Paid",
            totalOwed: "Total Owed",
            netBalance: "Net Balance",
            receives: "Receives",
            owes: "Owes",
            suggestedPayments: "Suggested Payments",
            shouldPay: "should pay",
            to: "to",
            settleAndArchive: "Settle Trip & Archive",
            tripSettled: "Trip Settled!",
            settledOn: "Settled on",
            confirmSettle: "Confirm Settlement",
            confirmSettleMessage: "Are you sure you want to settle this trip? This will move it to the archive.",
            settle: "Settle",
        },
        // Activity Log Screen
        activityLog: {
            activityLog: "Activity Log",
            noActivity: "No activity yet",
            noActivitySubtext: "Activity will appear here as you add or modify expenses",
            justNow: "Just now",
            minutesAgo: "m ago",
            hoursAgo: "h ago",
            daysAgo: "d ago",
        },
        // Archive Screen
        archive: {
            archive: "Archive",
            noSettledTrips: "No settled trips yet",
            noSettledTripsSubtext: "Settled trips will appear here",
            settledBadge: "✓ Settled",
        },
    },
    hi: {
        // Common
        common: {
            welcome: "स्वागत है",
            logout: "लॉग आउट",
            cancel: "रद्द करें",
            delete: "हटाएं",
            edit: "संपादित करें",
            save: "सहेजें",
            add: "जोड़ें",
            update: "अपडेट करें",
            confirm: "पुष्टि करें",
            yes: "हां",
            no: "नहीं",
            ok: "ठीक है",
            total: "कुल",
            members: "सदस्य",
            expenses: "खर्चे",
            actions: "कार्य",
        },
        // Login Screen
        login: {
            appName: "SplitBuddy",
            tagline: "निष्पक्ष विभाजन। कोई नाटक नहीं।",
            welcomeBack: "वापसी पर स्वागत है",
            subtitle: "अपने उपकरणों में यात्राओं को सिंक करने के लिए साइन इन करें",
            email: "ईमेल",
            emailPlaceholder: "अपना ईमेल दर्ज करें",
            password: "पासवर्ड",
            passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
            forgotPassword: "पासवर्ड भूल गए?",
            loginButton: "लॉगिन",
            signingIn: "साइन इन हो रहा है...",
            or: "या",
            continueWithoutLogin: "बिना लॉगिन के जारी रखें",
            newHere: "यहाँ नए हैं?",
            createAccount: "खाता बनाएं",
        },
        // Home Screen
        home: {
            dashboard: "डैशबोर्ड",
            welcomeBack: "वापसी पर स्वागत है!",
            totalGroups: "कुल समूह",
            totalExpenses: "कुल खर्चे",
            recentActivity: "हाल की गतिविधि",
            seeAll: "सभी देखें",
            noActivity: "अभी तक कोई गतिविधि नहीं",
            noActivitySubtext: "गतिविधि देखने के लिए एक समूह बनाएं और खर्चे जोड़ें",
            quickActions: "त्वरित कार्य",
            createNewGroup: "नया समूह बनाएं",
            viewAllGroups: "सभी समूह देखें",
            logOut: "लॉग आउट",
        },
        // Groups Screen
        groups: {
            allGroups: "सभी समूह",
            createGroup: "समूह बनाएं",
            noGroups: "अभी तक कोई समूह नहीं",
            noGroupsSubtext: "खर्चे विभाजित करना शुरू करने के लिए अपना पहला समूह बनाएं",
            groupName: "समूह का नाम",
            description: "विवरण",
            addMember: "सदस्य जोड़ें",
            memberName: "सदस्य का नाम",
        },
        // Group Details Screen
        groupDetails: {
            tripNotFound: "यात्रा नहीं मिली",
            addMember: "+ सदस्य जोड़ें",
            noMembers: "अभी तक कोई सदस्य नहीं",
            paid: "भुगतान किया",
            share: "हिस्सा",
            getsBack: "वापस मिलेगा",
            owes: "देना है",
            settled: "निपटाया गया ✓",
            addExpense: "+ खर्च जोड़ें",
            noExpenses: "अभी तक कोई खर्च नहीं",
            paidBy: "द्वारा भुगतान",
            splitBetween: "के बीच विभाजित",
            member: "सदस्य",
            settlementSummary: "निपटान सारांश",
            activityLog: "गतिविधि लॉग",
            addNewMember: "नया सदस्य जोड़ें",
            enterMemberName: "सदस्य का नाम दर्ज करें",
            editMember: "सदस्य संपादित करें",
            removeMember: "सदस्य हटाएं",
            removeConfirm: "क्या आप वाकई हटाना चाहते हैं",
            fromTrip: "इस यात्रा से?",
            remove: "हटाएं",
            removed: "हटाया गया",
            hasBeenRemoved: "हटा दिया गया है",
            success: "सफलता!",
            hasBeenAdded: "यात्रा में जोड़ा गया है",
            updated: "अपडेट किया गया!",
            memberNameUpdated: "सदस्य का नाम अपडेट कर दिया गया है",
            oops: "उफ़!",
            enterValidName: "कृपया एक मान्य नाम दर्ज करें",
            deleteExpense: "खर्च हटाएं",
            deleteExpenseConfirm: "क्या आप वाकई हटाना चाहते हैं",
            deleted: "हटाया गया",
            expenseRemoved: "खर्च हटा दिया गया है",
        },
        // Add Expense Screen
        addExpense: {
            addExpense: "खर्च जोड़ें",
            editExpense: "खर्च संपादित करें",
            expenseTitle: "खर्च का शीर्षक",
            titlePlaceholder: "जैसे, रात का खाना, होटल, आदि।",
            amount: "राशि",
            amountPlaceholder: "राशि दर्ज करें",
            paidBy: "द्वारा भुगतान",
            selectPayer: "चुनें कि किसने भुगतान किया",
            splitBetween: "के बीच विभाजित",
            selectMembers: "विभाजित करने के लिए सदस्यों का चयन करें",
            uploadReceipt: "रसीद अपलोड करें (वैकल्पिक)",
            takePhoto: "फोटो लें",
            chooseFromGallery: "गैलरी से चुनें",
            removePhoto: "फोटो हटाएं",
            addExpenseButton: "खर्च जोड़ें",
            updateExpenseButton: "खर्च अपडेट करें",
            pleaseEnterTitle: "कृपया खर्च का शीर्षक दर्ज करें",
            pleaseEnterAmount: "कृपया राशि दर्ज करें",
            pleaseSelectPayer: "कृपया चुनें कि किसने भुगतान किया",
            pleaseSelectMembers: "कृपया विभाजित करने के लिए कम से कम एक सदस्य चुनें",
            expenseAdded: "खर्च जोड़ा गया!",
            expenseUpdated: "खर्च अपडेट किया गया!",
        },
        // Settlement Screen
        settlement: {
            settleTrip: "यात्रा निपटाएं",
            memberBalances: "सदस्य शेष",
            totalPaid: "कुल भुगतान",
            totalOwed: "कुल बकाया",
            netBalance: "शुद्ध शेष",
            receives: "प्राप्त करता है",
            owes: "देना है",
            suggestedPayments: "सुझाए गए भुगतान",
            shouldPay: "को भुगतान करना चाहिए",
            to: "को",
            settleAndArchive: "यात्रा निपटाएं और संग्रहित करें",
            tripSettled: "यात्रा निपटाई गई!",
            settledOn: "निपटाया गया",
            confirmSettle: "निपटान की पुष्टि करें",
            confirmSettleMessage: "क्या आप वाकई इस यात्रा को निपटाना चाहते हैं? यह इसे संग्रह में ले जाएगा।",
            settle: "निपटाएं",
        },
        // Activity Log Screen
        activityLog: {
            activityLog: "गतिविधि लॉग",
            noActivity: "अभी तक कोई गतिविधि नहीं",
            noActivitySubtext: "जैसे ही आप खर्चे जोड़ते या संशोधित करते हैं, गतिविधि यहां दिखाई देगी",
            justNow: "अभी",
            minutesAgo: "मिनट पहले",
            hoursAgo: "घंटे पहले",
            daysAgo: "दिन पहले",
        },
        // Archive Screen
        archive: {
            archive: "संग्रह",
            noSettledTrips: "अभी तक कोई निपटाई गई यात्रा नहीं",
            noSettledTripsSubtext: "निपटाई गई यात्राएं यहां दिखाई देंगी",
            settledBadge: "✓ निपटाया गया",
        },
    },
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem("@language");
            if (savedLanguage) {
                setLanguage(savedLanguage);
            }
        } catch (error) {
            console.error("Error loading language:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = async () => {
        const newLanguage = language === "en" ? "hi" : "en";
        setLanguage(newLanguage);
        try {
            await AsyncStorage.setItem("@language", newLanguage);
        } catch (error) {
            console.error("Error saving language:", error);
        }
    };

    const t = (key) => {
        const keys = key.split(".");
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    };

    const value = {
        language,
        toggleLanguage,
        t,
        isLoading,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
