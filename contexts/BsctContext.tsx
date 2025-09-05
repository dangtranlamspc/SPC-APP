import { BSCT } from "@/types/bsct";
import { apiCall } from "@/utils/apiCall";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface BSCTContextType {
  bscts: BSCT[];
  loading: boolean;
  error: string | null;
  categoryBSCT?: string;
  fetchBSCTs: (categoryBSCT?: string) => Promise<void>;
  getNewBSCTs : (limit?: number) => Promise<BSCT[]>;
}

const BSCTContext = createContext<BSCTContextType | undefined>(undefined);

export const BSCTProvider = ({ children }: { children: ReactNode }) => {
  const [bscts, setBscts] = useState<BSCT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryBSCT, setCategoryBSCT] = useState<string | undefined>(undefined);

  const fetchBSCTs = async (categoryParam?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { success, data, error } = await apiCall<{
        bscts: BSCT[];
      }>({
        endpoint: '/bsct',
        method: 'GET',
        params: {
          ...(categoryParam ? { categoryBSCT: categoryParam } : {})
        },
        requireAuth: false
      });

      if (success) {
        setBscts(data.bscts || []);
        setCategoryBSCT(categoryParam);
      } else {
        setError(error || "Lỗi không xác định");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const getNewBSCTs = async (limit: number = 10): Promise<BSCT[]> => {
    try {
      const { success, data, error } = await apiCall<BSCT[]>({
        endpoint: `/bsct/new?limit=${limit}`,
        method: 'GET',
        params: { limit },
        requireAuth: false,
      });
      if (success) {
        return data || [];
      } else {
        console.error(error || 'Không lấy được dữ liệu bài viết mới');
        return [];
      }
    } catch (error : any) {
      console.error(error.message || "Lỗi không xác định khi getNewBSCTs");
      return [];
    }
  }

  useEffect(() => {
    fetchBSCTs();
  }, []);

  return (
    <BSCTContext.Provider
      value={{
        bscts,
        loading,
        error,
        categoryBSCT,
        fetchBSCTs,
        getNewBSCTs,
      }}
    >
      {children}
    </BSCTContext.Provider>
  );
};

export const useBSCT = () => {
  const context = useContext(BSCTContext);
  if (!context) {
    throw new Error("useBSCT phải dùng trong BSCTProvider");
  }
  return context;
};