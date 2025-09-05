import { Category } from '@/types/product';
import { apiCall } from '@/utils/apiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import { useAuth } from "./AuthContext";

interface Product {
    _id: string;
    name: string;
    images: (string | { url: string })[];
    description?: string;
    category?: string;
    average_rating?: number;
    rating_count?: number;
    isActive?: boolean;
    isMoi: boolean;
};

export interface FavouriteProduct extends Product {
    favouriteId: string;
    favouriteAt: string;
    isFavourite: true;
};

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

interface FavouriteState {
    favourites: FavouriteProduct[];
    favouriteCount: number;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    favouriteStatus: Map<string, boolean>;
};

interface FavouriteContextType extends FavouriteState {
    getFavourites: (page?: number, limit?: number, sortBy?: string, sortOrder?: string, refresh?: boolean) => Promise<void>;
    toggleFavourite: (productId: string) => Promise<{ message: string; isFavourite: boolean; action: string; favouriteId?: string } | null>;
    checkFavourite: (productId: string) => Promise<boolean>;
    getFavouriteCount: () => Promise<void>;
    loadMoreFavourites: () => Promise<void>;
    refreshFavourites: () => Promise<void>;
    clearError: () => void;
    resetFavourites: () => void;
    categories: Category[];
    isFavourite: (productId: string) => boolean;
};

const initialState: FavouriteState = {
    favourites: [],
    favouriteCount: 0,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
    loading: false,
    error: null,
    refreshing: false,
    favouriteStatus: new Map(),
};

const FAVOURITE_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_REFRESHING: 'SET_REFRESHING',
    SET_FAVOURITES: 'SET_FAVOURITES',
    SET_FAVOURITE_COUNT: 'SET_FAVOURITE_COUNT',
    ADD_FAVOURITE: 'ADD_FAVOURITE',
    REMOVE_FAVOURITE: 'REMOVE_FAVOURITE',
    UPDATE_FAVOURITE_STATUS: 'UPDATE_FAVOURITE_STATUS',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET: 'RESET'
} as const;

type FavouriteAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_REFRESHING'; payload: boolean }
    | { type: 'SET_FAVOURITES'; payload: { products: FavouriteProduct[]; pagination: Pagination } }
    | { type: 'SET_FAVOURITE_COUNT'; payload: number }
    | { type: 'ADD_FAVOURITE'; payload: FavouriteProduct }
    | { type: 'REMOVE_FAVOURITE'; payload: string }
    | { type: 'UPDATE_FAVOURITE_STATUS'; payload: { productId: string; isFavourite: boolean } }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'RESET' };

const favouriteReducer = (state: FavouriteState, action: FavouriteAction): FavouriteState => {
    switch (action.type) {
        case FAVOURITE_ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };

        case FAVOURITE_ACTIONS.SET_REFRESHING:
            return { ...state, refreshing: action.payload };

        case FAVOURITE_ACTIONS.SET_FAVOURITES:
            return {
                ...state,
                favourites: action.payload.products,
                pagination: action.payload.pagination,
                loading: false,
                refreshing: false,
                error: null
            };

        case FAVOURITE_ACTIONS.SET_FAVOURITE_COUNT:
            return {
                ...state,
                favouriteCount: action.payload
            };

        case FAVOURITE_ACTIONS.ADD_FAVOURITE:
            return {
                ...state,
                favourites: [action.payload, ...state.favourites],
                favouriteCount: state.favouriteCount + 1
            };

        case FAVOURITE_ACTIONS.REMOVE_FAVOURITE:
            return {
                ...state,
                favourites: state.favourites.filter(fav => fav._id !== action.payload),
                favouriteCount: Math.max(0, state.favouriteCount - 1)
            };

        case FAVOURITE_ACTIONS.UPDATE_FAVOURITE_STATUS:
            const updatedStatus = new Map(state.favouriteStatus);
            updatedStatus.set(action.payload.productId, action.payload.isFavourite);

            return {
                ...state,
                favouriteStatus: updatedStatus
            };

        case FAVOURITE_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
                refreshing: false
            };

        case FAVOURITE_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };

        case FAVOURITE_ACTIONS.RESET:
            return initialState;

        default:
            return state;
    }
};

const FavouriteContext = createContext<FavouriteContextType | undefined>(undefined);

export const FavouriteProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(favouriteReducer, initialState);
    const [categories, setCategories] = useState<Category[]>([]);
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const getFavourites = async (
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'createAt',
        sortOrder: string = 'desc',
        refresh: boolean = false,

    ): Promise<void> => {

        const tokenFromSecure = await SecureStore.getItemAsync('token').catch(() => null);
        const tokenFromAsync = await AsyncStorage.getItem('token').catch(() => null);
        if (!isLoggedIn || !user || (!tokenFromSecure && !tokenFromAsync)) {
            resetFavourites();
            return;
        }
        try {
            if (refresh) {
                dispatch({ type: FAVOURITE_ACTIONS.SET_REFRESHING, payload: true });
            } else {
                dispatch({ type: FAVOURITE_ACTIONS.SET_LOADING, payload: true })
            }

            const res = await apiCall<{ products: FavouriteProduct[]; pagination: Pagination }>({
                endpoint: '/favourite',
                method: 'GET',
                params: { page, limit, sortBy, sortOrder }
            });

            if (res.success && res.data) {
                dispatch({
                    type: FAVOURITE_ACTIONS.SET_FAVOURITES,
                    payload: {
                        products: res.data.products,
                        pagination: res.data.pagination,
                    }
                });
            } else {
                throw new Error(res.error || 'Failed to fetch favourites');
            }
        } catch (error) {
            console.error('Get favourites error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch favourites';
            dispatch({
                type: FAVOURITE_ACTIONS.SET_ERROR,
                payload: errorMessage
            });
        }
    }

    const toggleFavourite = async (productId: string) => {
        if (!isLoggedIn || !productId) return null;

        try {
            const currentStatus = state.favouriteStatus.get(productId) || false;
            dispatch({
                type: FAVOURITE_ACTIONS.UPDATE_FAVOURITE_STATUS,
                payload: { productId, isFavourite: !currentStatus }
            });
            const res = await apiCall<{ message: string, isFavourite: boolean, action: string, favouriteId?: string }>({
                endpoint: '/favourite/toggle',
                method: 'POST',
                data: { productId },
            });

            if (res.success && res.data) {
                dispatch({
                    type: FAVOURITE_ACTIONS.UPDATE_FAVOURITE_STATUS,
                    payload: { productId, isFavourite: res.data.isFavourite }
                });
                if (res.data.action === 'added') {
                    await getFavourites(state.pagination.page, state.pagination.limit);
                    dispatch({
                        type: FAVOURITE_ACTIONS.SET_FAVOURITE_COUNT,
                        payload: state.favouriteCount + 1
                    });
                } else {
                    dispatch({
                        type: FAVOURITE_ACTIONS.REMOVE_FAVOURITE,
                        payload: productId,
                    });
                }
                return res.data;
            } else {
                dispatch({
                    type: FAVOURITE_ACTIONS.UPDATE_FAVOURITE_STATUS,
                    payload: { productId, isFavourite: currentStatus }
                });
                throw new Error(res.error || 'Failed to toggle favourite');
            }
        } catch (error) {
            const currentStatus = state.favouriteStatus.get(productId) || false;
            dispatch({
                type: FAVOURITE_ACTIONS.UPDATE_FAVOURITE_STATUS,
                payload: { productId, isFavourite: currentStatus }
            });
            console.error('Toggle favourite error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favourite';
            dispatch({
                type: FAVOURITE_ACTIONS.SET_ERROR,
                payload: errorMessage
            });
            throw error;
        }
    }

    const checkFavourite = async (productId: string): Promise<boolean> => {
        if (!isLoggedIn || !productId) return false;

        try {
            const response = await apiCall<{ isFavourite: boolean; favouriteId?: string; favouritedAt?: string }>({
                endpoint: `/favourite/check/${productId}`,
                method: 'GET'
            });

            return response.success ? response.data?.isFavourite || false : false;
        } catch (error) {
            console.error('Check favourite error:', error);
            return false;
        }
    };

    const getFavouriteCount = async (): Promise<void> => {
        if (!isLoggedIn) return;

        try {
            const response = await apiCall<{ success: boolean; count: number }>({
                endpoint: '/favourite/count',
                method: 'GET'
            });

            if (response.success && response.data) {
                dispatch({
                    type: FAVOURITE_ACTIONS.SET_FAVOURITE_COUNT,
                    payload: response.data.count
                });
            }
        } catch (error) {
            console.error('Get favourite count error:', error);
        }
    };

    const loadMoreFavourites = async (): Promise<void> => {
        const { page, pages } = state.pagination;
        if (page < pages && !state.loading) {
            await getFavourites(page + 1, state.pagination.limit);
        }
    };

    // Refresh favourites
    const refreshFavourites = async (): Promise<void> => {
        await getFavourites(1, state.pagination.limit, 'createdAt', 'desc', true);
    };

    const isFavourite = (productId: string): boolean => {
        return state.favouriteStatus.get(productId) || false;
    };

    // Clear error
    const clearError = (): void => {
        dispatch({ type: FAVOURITE_ACTIONS.CLEAR_ERROR });
    };

    // Reset state
    const resetFavourites = (): void => {
        dispatch({ type: FAVOURITE_ACTIONS.RESET });
    };

    useEffect(() => {
        if (isLoggedIn && user) {
            getFavourites();
            getFavouriteCount();
        } else {
            resetFavourites();
        }
    }, [isLoggedIn, user]);

    const value: FavouriteContextType = {
        ...state,
        getFavourites,
        toggleFavourite,
        checkFavourite,
        getFavouriteCount,
        loadMoreFavourites,
        refreshFavourites,
        clearError,
        resetFavourites,
        categories,
        isFavourite
    };

    return (
        <FavouriteContext.Provider value={value}>
            {children}
        </FavouriteContext.Provider>
    );
};

export const useFavourite = (): FavouriteContextType => {
    const context = useContext(FavouriteContext);
    if (!context) {
        throw new Error('useFavourite must be used within a FavouriteProvider');
    }
    return context;
}

