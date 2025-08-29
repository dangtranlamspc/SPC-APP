import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        bottom: insets.bottom - 10,
      }}
      className="items-center"
    >
      <View className="flex-row justify-between items-center bg-white rounded-3xl shadow-lg px-8 py-4 w-full">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "home") iconName = "home";
          if (route.name === "product") iconName = "pricetags";
          if (route.name === "favourite") iconName = "heart";
          if (route.name === "profile") iconName = "person";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center"
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={26}
                color={isFocused ? "#2563eb" : "#94a3b8"} // blue-600 vs gray-400
              />
              <Text
                className={`text-xs ${
                  isFocused ? "text-blue-600 font-semibold" : "text-gray-400"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="product" options={{ title: "Product" }} />
      <Tabs.Screen name="favourite" options={{ title: "Favourite" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
