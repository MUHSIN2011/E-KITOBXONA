import axios from "axios";

export const SaveToken = (access: string, refresh: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
    }
};

export const GetToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("access_token");
    }
    return null;
};

export const DestroyToken = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export const axiosRequest = axios.create({
    baseURL: "https://student4.softclub.tj/api/v1/"
});

axiosRequest.interceptors.request.use(
    (config) => {
        const token = GetToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);