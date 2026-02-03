"use client";

import { useState, useEffect } from "react";

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Хатогӣ ҳангоми хондани маълумоти корбар");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }

        setIsLoading(false);
    }, []);

    return { user, isAuthenticated, isLoading };
};