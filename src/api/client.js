import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use localhost for iOS simulator, or 10.0.2.2 for Android emulator
// For physical device, use your machine's IP address
export const SOCKET_URL = "https://splitbuddy-3usk.onrender.com";
const API_URL = `${SOCKET_URL}/api`;

const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the auth token to every request
client.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("@splitbuddy_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
