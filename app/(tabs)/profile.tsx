import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Text, View } from "react-native";


export default function ProfileScreen() {
  const { user, login, logout } = useAuth();
  

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {user ? (
        <>
          <Text className="text-lg font-bold">Hello, {user.name}</Text>
          <Text className="mt-2 text-blue-600" onPress={logout}>
            Logout
          </Text>
        </>
      ) : (
        <Text
          className="text-lg text-red-600"
          onPress={() => router.push('/(auth)/login')}
        >
          Login
        </Text>
      )}
    </View>
  );
}
