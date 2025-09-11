import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
    changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean, message: string }>;
    expoPushToken: string | null;
    registerPushNotifications: () => Promise<void>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

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
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    const handleGlobalLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        checkAuthStatus();
        // setGlobalLogoutHandler(handleGlobalLogout);
    }, [])

    const getAuthToken = async (): Promise<string | null> => {
        try {
            const [secureToken, asyncToken] = await Promise.all([
                SecureStore.getItemAsync('token'),
                AsyncStorage.getItem('token')
            ]);
            return secureToken || asyncToken;
        } catch (error) {
            console.error('❌ Get token error:', error);
            return null;
        }
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
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
            await AsyncStorage.setItem('expoPushToken', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            console.log(data.user)
            setUser(data.user);
            setIsLoggedIn(true);

            try {
                await registerPushNotifications();
            } catch (notificationError) {
                console.error('Failed to register push notifications:', notificationError);
                // Don't fail login if notification registration fails
            }
            return data;

        } else {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }
    };

    const registerPushNotifications = async () => {
        if (!Device.isDevice) {
            console.log('Push notifications only work on physical devices');
            return;
        }

        try {
            // Check existing permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Request permissions if not granted
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Push notification permission denied');
                return;
            }

            // Get push token
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;

            if (!projectId) {
                throw new Error('Project ID not found');
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
            const token = tokenData.data;

            setExpoPushToken(token);
            console.log('🎯 Expo Push Token:', token);

            // Save token to server
            await savePushTokenToServer(token);

            // Save locally as backup
            await AsyncStorage.setItem('expoPushToken', token);

        } catch (error) {
            console.error('Error registering push notifications:', error);
        }
    };

    const savePushTokenToServer = async (token: string) => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            if (!authToken) {
                console.log('No auth token found');
                return;
            }

            const response = await fetch(`${BASE_URL}/auth/save-push-token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expoPushToken: token,
                }),
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Push token saved to server');
            } else {
                console.error('❌ Failed to save push token:', result.message);
            }

        } catch (error) {
            console.error('Error saving push token to server:', error);
        }
    };

    const clearPushTokenFromServer = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            if (authToken) {
                await fetch(`${BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('🗑️ Push token cleared from server');
            }
        } catch (error) {
            console.error('Error clearing push token from server:', error);
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

            const storedPushToken = await AsyncStorage.getItem('expoPushToken');
            if (storedPushToken) {
                setExpoPushToken(storedPushToken);
            }

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
        const res = await fetch(`${BASE_URL}/auth/register`, {
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

    const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
        try {
            const token = await getAuthToken();
            if (!token) {
                throw new Error('Phiên đăng nhập đã hết hạn');
            }
            const res = await fetch(`${BASE_URL}/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Đảm bảo token còn hạn
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                return {
                    success: true,
                    message: data.message || "Đổi mật khẩu thành công",
                }
            } else {
                return {
                    success: false,
                    message: data.message || "Đổi mật khẩu thất bại"
                }
            }
        } catch (error) {
            console.error('❌ Change password error:', error);

            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            return {
                success: false,
                message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.'
            };
        }
    }

    const logout = async () => {
        await clearPushTokenFromServer();
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
            changePassword,
            expoPushToken,
            registerPushNotifications,
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