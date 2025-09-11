import { BASE_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";


// let globalLogoutHandler: (() => void) | null = null;

// export const setGlobalLogoutHandler = (handler: () => void) => {
//   globalLogoutHandler = handler;
// };

interface ApiCallOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export const apiCall = async <T = any>({
  endpoint,
  method = "GET",
  data,
  params,
  headers = {},
  requireAuth = true,
}: ApiCallOptions): Promise<ApiResponse<T>> => {
  try {
    let url = `${BASE_URL}${endpoint}`;

    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, String(value));
        }
      });
      url += `?${queryString.toString()}`;
    }

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authorization header if required
    if (requireAuth) {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("No authentication token found");
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body for POST, PUT, PATCH requests
    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      requestOptions.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: responseData,
        message: responseData.message,
      };
    } else {
      if (response.status === 401) {
        await SecureStore.deleteItemAsync('token')
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        // Alert.alert(
        //   "Phiên đăng nhập hết hạn",
        //   "Vui lòng đăng nhập lại để sử dụng toàn bộ tính năng",
        //   [
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         router.push("/(auth)/login");
        //       },
        //     },
        //   ]
        // );
        // throw new Error(
        //   "Đăng nhập đã hết hạn, vui lòng đăng nhập lại để sử dụng toàn bộ tính năng"
        // );
      }

      throw new Error(
        responseData.message || responseData.error || `HTTP ${response.status}`
      );
    }
  } catch (error) {
    console.log("API Call Error:", error);
        // Alert.alert(
        //   'Thông báo',
        //   `Đăng nhập của bạn đã hết hạn để sử dụng được tất cả tính năng của ứng dụng hãy đăng nhập lại`,
        //   [
        //     {
        //       text: 'Hủy',
        //       style: 'cancel'
        //     },
        //     {
        //       text: 'Đăng nhập',
        //       style: 'destructive',
        //       onPress: async () => {
        //         router.push('/(auth)/login')
        //       }
        //     }
        //   ]
        // );

    if (error instanceof Error) {
      return {
        success: false,
        data: null as T,
        error: error.message,
      };
    }

    return {
      success: false,
      data: null as T,
      error: "An unexpected error occurred",
    };
  }
};
