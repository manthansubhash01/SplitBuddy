import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log("Loading user...");
      const storedUser = await AsyncStorage.getItem("@splitbuddy_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log("User loaded:", JSON.parse(storedUser));
      } else {
        console.log("No stored user found");
      }
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // In a real app, verify against API. Here we verify against stored users.
      const storedUsersJson = await AsyncStorage.getItem(
        "@splitbuddy_users_db"
      );
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];

      const foundUser = storedUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
        await AsyncStorage.setItem(
          "@splitbuddy_user",
          JSON.stringify(userSession)
        );
        setUser(userSession);
        return { success: true };
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const storedUsersJson = await AsyncStorage.getItem(
        "@splitbuddy_users_db"
      );
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];

      if (
        storedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
      ) {
        return { success: false, error: "Email already exists" };
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, NEVER store plain text passwords
      };

      const updatedUsers = [...storedUsers, newUser];
      await AsyncStorage.setItem(
        "@splitbuddy_users_db",
        JSON.stringify(updatedUsers)
      );

      // Auto login
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      await AsyncStorage.setItem(
        "@splitbuddy_user",
        JSON.stringify(userSession)
      );
      setUser(userSession);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginAsGuest = async () => {
    try {
      const guestUser = {
        id: "guest",
        name: "Guest",
        email: "guest@local",
      };
      await AsyncStorage.setItem("@splitbuddy_user", JSON.stringify(guestUser));
      setUser(guestUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@splitbuddy_user");
      setUser(null);
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
