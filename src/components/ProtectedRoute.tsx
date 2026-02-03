"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";


interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/");
            } else if (user && !allowedRoles.includes(user.role)) {
                toast.error("Шумо иҷозат надоред ба ин саҳифа дастрасӣ пайдо кунед.");
                router.push("/");
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                {/* 2. <Toast /> -ро аз ин ҷо нест кунед */}
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                <p className="ml-3 text-gray-500">Боргузорӣ...</p>
            </div>
        );
    }

    return isAuthenticated && user && allowedRoles.includes(user.role) ? <>{children}</> : null;
}