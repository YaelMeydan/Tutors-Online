import axios from "axios";

export const tokenKeyName = "token";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080",
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
