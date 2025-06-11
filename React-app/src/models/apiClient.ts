import axios from "axios";
import { jwtDecode } from "jwt-decode";

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


export function getCurrentUserId(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }
    try {
        interface DecodedToken {
            sub?: string; 
            userName?: string; 
            [key: string]: unknown;
        }
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        
        return decodedToken.sub || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
