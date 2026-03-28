"use client";

import { useState, useEffect } from "react";
import { FavoriteService } from "@/services/favoriteService";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

interface FavoriteButtonProps {
    gameAccountId: string;
    className?: string;
}

export default function FavoriteButton({ gameAccountId, className = "" }: FavoriteButtonProps) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && gameAccountId) {
            FavoriteService.checkIsFavorite(gameAccountId)
                .then((res) => setIsFavorite(res.isFavorite))
                .catch(() => {}); // Ignore errors silently on initial check
        }
    }, [user, gameAccountId]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if button is inside a Link
        e.stopPropagation();

        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa đăng nhập',
                text: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (loading) return;

        setLoading(true);
        try {
            const res = await FavoriteService.toggleFavorite(gameAccountId);
            setIsFavorite(res.isFavorite);
            Swal.fire({
                icon: 'success',
                title: res.isFavorite ? 'Đã thêm vào mục yêu thích' : 'Đã xóa khỏi mục yêu thích',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Có lỗi xảy ra, vui lòng thử lại sau',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-full flex items-center justify-center transition-colors shadow-sm focus:outline-none 
                ${isFavorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'} 
                ${className}`}
            title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isFavorite ? "0" : "2"}
                className={`w-5 h-5 transition-transform ${loading ? 'animate-pulse' : ''} ${isFavorite ? 'scale-110' : ''}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </button>
    );
}
