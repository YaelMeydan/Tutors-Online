import axios from "axios";
import { jwtDecode } from "jwt-decode"; // You might need to install jwt-decode: npm install jwt-decode @types/jwt-decode

export const tokenKeyName = "token";

export const apiClient = axios.create({
    baseURL: "https://tutors-online.onrender.com",
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});


export function getToken() {
    return sessionStorage.getItem(tokenKeyName);
}

export function setToken(token: string) {
    sessionStorage.setItem(tokenKeyName, token);
}

export function clearToken() {
    sessionStorage.removeItem(tokenKeyName);
}

// Function to get the current user's ID from the token
export function getCurrentUserId(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }
    try {
        interface DecodedToken {
            sub?: string; // Look for the 'sub' claim
            userName?: string; // Also include userName if needed elsewhere
            [key: string]: unknown;
        }
        // Specify the DecodedToken type for jwtDecode
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        // Return the 'sub' claim, or null if not present
        return decodedToken.sub || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
