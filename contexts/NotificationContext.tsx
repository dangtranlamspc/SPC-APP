import { Notification } from "@/types/notification";
import { apiCall } from "@/utils/apiCall";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
}

type NotificationAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_REFRESHING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_NOTIFICATIONS'; payload: { notifications: Notification[]; pagination: PaginationInfo; unreadCount: number } }
    | { type: 'APPEND_NOTIFICATIONS'; payload: { notifications: Notification[]; pagination: PaginationInfo } }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'MARK_ALL_AS_READ' }
    | { type: 'DELETE_NOTIFICATION'; payload: string }
    | { type: 'UPDATE_UNREAD_COUNT'; payload: number }
    | { type: 'RESET_STATE' };


const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    pagination: null,
    loading: false,
    error: null,
    refreshing: false,
}

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_REFRESHING':
            return { ...state, refreshing: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false, refreshing: false };

        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload.notifications,
                pagination: action.payload.pagination,
                unreadCount: action.payload.unreadCount,
                loading: false,
                refreshing: false,
                error: null,
            };

        case 'APPEND_NOTIFICATIONS':
            return {
                ...state,
                notifications: [...state.notifications, ...action.payload.notifications],
                pagination: action.payload.pagination,
                loading: false,
                error: null,
            };

        case 'MARK_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification._id === action.payload
                        ? { ...notification, isRead: true }
                        : notification
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };

        case 'MARK_ALL_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    isRead: true,
                })),
                unreadCount: 0,
            };

        case 'DELETE_NOTIFICATION':
            const deletedNotification = state.notifications.find(n => n._id === action.payload);
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification._id !== action.payload),
                unreadCount: deletedNotification && !deletedNotification.isRead
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            };

        case 'UPDATE_UNREAD_COUNT':
            return { ...state, unreadCount: action.payload };

        case 'RESET_STATE':
            return initialState;

        default:
            return state;
    }
};

interface NotificationContextType extends NotificationState {
    fetchNotifications: (page?: number, limit?: number, filter?: 'all' | 'read' | 'unread') => Promise<void>;
    loadMoreNotifications: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    resetNotifications: () => void;

    hasMorePages: boolean;
    canLoadMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    const hasMorePages = state.pagination ? state.pagination.page < state.pagination.pages : false;
    const canLoadMore = hasMorePages && !state.loading;

    const fetchNotifications = async (
        page: number = 1,
        limit: number = 20,
        filter: 'all' | 'read' | 'unread' = 'all'
    ) => {
        try {
            if (page === 1) {
                dispatch({ type: 'SET_LOADING', payload: true })
            }
            dispatch({ type: 'SET_ERROR', payload: null });

            const res = await apiCall<{
                data: Notification[];
                pagination: PaginationInfo;
                unreadCount: number;
            }>({
                endpoint: '/notifications',
                method: 'GET',  
                params: { page, limit, filter },
                requireAuth: true,
            });

            if (res.success) {
                if (page === 1) {
                    dispatch({
                        type: 'SET_NOTIFICATIONS',
                        payload: {
                            notifications: res.data.data,
                            pagination: res.data.pagination,
                            unreadCount: res.data.unreadCount,
                        },
                    });
                } else {
                    dispatch({
                        type: 'APPEND_NOTIFICATIONS',
                        payload: {
                            notifications: res.data.data,
                            pagination: res.data.pagination,
                        },
                    });
                    dispatch({ type: 'UPDATE_UNREAD_COUNT', payload: res.data.unreadCount })
                }
            } else {
                throw new Error(res.error || 'Failed to fetch notification')
            }
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'An unexpected error occurred',
            });
        }
    }


    const loadMoreNotifications = async () => {
        if (!canLoadMore || !state.pagination) return;
        const nextPage = state.pagination.page + 1;
        await fetchNotifications(nextPage, state.pagination.limit)
    }

    const refreshNotifications = async () => {
        try {
            dispatch({ type: 'SET_REFRESHING', payload: true });
            await fetchNotifications(1, state.pagination?.limit || 20);
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'An unexpected error occurred',
            });
        }
    }

    const markAsRead = async (notificationId: string) => {
        try {
            const res = await apiCall({
                endpoint: `/notifications/${notificationId}/read`,
                method: 'PATCH',
                requireAuth: true,
            });

            if (res.success) {
                dispatch({ type: 'MARK_AS_READ', payload: notificationId });
            } else {
                throw new Error(res.error || 'Failed to mark notification as read');
            }
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to mark notification as read',
            });
        }
    }

    const markAllAsRead = async () => {
        try {
            const res = await apiCall({
                endpoint: '/notifications/read-all',
                method: 'PATCH',
                requireAuth: true,
            });

            if (res.success) {
                dispatch({ type: 'MARK_ALL_AS_READ' });
            } else {
                throw new Error(res.error || 'Failed to mark all notifications as read')
            }
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
            });
        }
    }

    const deleteNotification = async (notificationId: string) => {
        try {
            const res = await apiCall({
                endpoint: `/notifications/${notificationId}`,
                method: 'DELETE',
                requireAuth: true,
            });

            if (res.success) {
                dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
            } else {
                throw new Error(res.error || 'Failed to delete notifications')
            }
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to delete notification',
            });
        }
    }

    const resetNotifications = () => {
        dispatch({type : 'RESET_STATE'})
    }

    useEffect(() => {
        fetchNotifications();
    },[])


    const contextValue : NotificationContextType = {
        ...state,
        fetchNotifications,
        loadMoreNotifications,
        refreshNotifications,
        markAllAsRead,
        markAsRead,
        deleteNotification,
        resetNotifications,
        hasMorePages,
        canLoadMore,
    };
    return (
        <NotificationContext.Provider
            value={contextValue}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const useNotificationActions = () => {
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    refreshNotifications,
    resetNotifications,
  } = useNotifications();

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    refreshNotifications,
    resetNotifications,
  };
};

// Helper hook for notification data
export const useNotificationData = () => {
  const {
    notifications,
    unreadCount,
    pagination,
    loading,
    error,
    refreshing,
    hasMorePages,
    canLoadMore,
  } = useNotifications();

  return {
    notifications,
    unreadCount,
    pagination,
    loading,
    error,
    refreshing,
    hasMorePages,
    canLoadMore,
  };
};

