import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const API_URL = 'https://server-m7ny.onrender.com/api';

interface User {
    id: String;
    name: String;
    email: String;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    clearAllData: () => Promise<void>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

// let globalLogoutHandler: (() => void) | null = null;

// export const setGlobalLogoutHandler = (handler: () => void) => {
//     globalLogoutHandler = handler;
// };

// export const triggerGlobalLogout = () => {
//     if (globalLogoutHandler) {
//         globalLogoutHandler();
//     }
// };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleGlobalLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        checkAuthStatus();
        // setGlobalLogoutHandler(handleGlobalLogout);
    }, [])

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            await SecureStore.setItemAsync('token', data.token);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsLoggedIn(true);
        } else {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }
    };

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            // Check both SecureStore and AsyncStorage
            const [secureToken, asyncToken, userData] = await Promise.all([
                SecureStore.getItemAsync('token'),
                AsyncStorage.getItem('token'),
                AsyncStorage.getItem('user')
            ]);

            const token = secureToken || asyncToken;

            if (token && userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } else {
                // If no token found, ensure clean state
                await clearAllData();
            }
        } catch (error) {
            console.error('❌ Check auth error:', error);
            await clearAllData();
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Đăng kí thất bại');
        }
    };

    const clearAllData = async () => {
        try {
            setIsLoggedIn(false);
            setUser(null);
            // Clear all stored data
            await Promise.all([
                SecureStore.deleteItemAsync('token').catch(e => console.log('Clear', e.message)), // Ignore errors if key doesn't exist
                AsyncStorage.removeItem('token').catch(e => console.log('as', e.message)),
                AsyncStorage.removeItem('user').catch(e => console.log('as', e.message)),
                AsyncStorage.removeItem('favourite').catch(e => console.log('as', e.message)),
            ]);
            // Reset state

        } catch (error) {
            console.error('❌ Clear data error:', error);
        }
    };

    const logout = async () => {
        await clearAllData()
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            register,
            logout,
            checkAuthStatus,
            clearAllData,
            isLoggedIn,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}