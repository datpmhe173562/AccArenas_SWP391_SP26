"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileForm from "@/components/users/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Page header */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-900">Hồ sơ cá nhân</h1>
                        <p className="mt-3 text-lg text-gray-500 font-medium">
                            Quản lý thông tin tài khoản và cá nhân hóa trải nghiệm của bạn
                        </p>
                    </div>

                    <ProfileForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}
