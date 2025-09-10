import { ThuVien } from "@/types/thuvien";
import { apiCall } from "@/utils/apiCall";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ThuVienContextType {
    thuviens: ThuVien[];
    loading: boolean;
    error: string | null;
    categoryThuVien?: string;
    fetchThuVien: (categoryThuVien?: string) => Promise<void>;
    getNewThuVien: (limit?: number) => Promise<ThuVien[]>;
}

const ThuVienContext = createContext<ThuVienContextType | undefined>(undefined);
export const ThuVienProvider = ({ children }: { children: ReactNode }) => {
    const [thuviens, setThuViens] = useState<ThuVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryThuVien, setCategoryThuVien] = useState<string | undefined>(undefined);


    const fetchThuVien = async (categoryParam?: string) => {
        try {
            setLoading(true);
            setError(null);

            const { success, data, error } = await apiCall<{
                thuviens: ThuVien[];
            }>({
                endpoint: '/thuvien',
                method: 'GET',
                params: {
                    ...(categoryParam ? { categoryThuVien: categoryParam } : {})
                },
                requireAuth: false
            });

            if (success) {
                setThuViens(data.thuviens || []);
                setCategoryThuVien(categoryParam);
            } else {
                setError(error || "Lỗi không xác định");
            }
        } catch (error: any) {
            setError(error.message || "Lỗi không xác định");
        }
        finally {
            setLoading(false);
        }
    }

    const getNewThuVien = async (limit: number = 10): Promise<ThuVien[]> => {
        try {
            const { success, data, error } = await apiCall<ThuVien[]>({
                endpoint: `/thuvien/new?limit=${limit}`,
                method: 'GET',
                params: { limit },
                requireAuth: false,
            });
            if (success) {
                return data || [];
            } else {
                console.error(error || "Lỗi không lấy được bài viết mới");
                return [];
            }
        } catch (error: any) {
            console.error(error.message || "Lỗi không xác định khi getNew")
            return [];
        }
    }

    useEffect(() => {
        fetchThuVien();
        getNewThuVien();
    }, [])

    return (
        <ThuVienContext.Provider
            value={{
                thuviens,
                loading,
                error,
                categoryThuVien,
                fetchThuVien,
                getNewThuVien,
            }}
        >
            {children}
        </ThuVienContext.Provider>
    )
}

export const useThuVien = () => {
    const context = useContext(ThuVienContext);
    if (!context) {
        throw new Error("useThuVien phải dùng trong BSCTProvider");
    }
    return context;
}