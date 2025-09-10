import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============== CONTEXT SETUP ==============
interface TabVisibilityContextType {
  hideTabBar: () => void;
  showTabBar: () => void;
  setScrollOffset: (offset: number) => void;
}

const TabVisibilityContext = createContext<TabVisibilityContextType | null>(null);

let globalContextValue: TabVisibilityContextType | null = null;

export const useTabVisibility = () => {
  const context = useContext(TabVisibilityContext);
  if (!context && globalContextValue) {
    return globalContextValue;
  }
  if (!context) {
    return {
      hideTabBar: () => {},
      showTabBar: () => {},
      setScrollOffset: () => {},
    };
  }
  return context;
};

// ============== TAB ITEM COMPONENT ==============
function TabItem({ 
  route, 
  isFocused, 
  onPress, 
  label 
}: {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  label: string;
}) {
  let iconName: keyof typeof Ionicons.glyphMap = "home";
  if (route.name === "home") iconName = "home";
  if (route.name === "product") iconName = "pricetags";
  if (route.name === "favourite") iconName = "heart";
  if (route.name === "profile") iconName = "person";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 items-center"
      activeOpacity={0.7}
    >
      <View style={{ 
        transform: [{ scale: isFocused ? 1.1 : 1 }],
        marginBottom: 4 
      }}>
        <Ionicons
          name={iconName}
          size={26}
          color={isFocused ? "#2563eb" : "#94a3b8"}
        />
      </View>
      
      <Text
        style={{
          fontSize: 12,
          color: isFocused ? "#2563eb" : "#94a3b8",
          fontWeight: isFocused ? "600" : "400",
          opacity: isFocused ? 1 : 0.7,
          transform: [{ scale: isFocused ? 1 : 0.9 }],
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============== FLOATING TAB BAR ==============
const FloatingTabBar = React.memo(({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  const tabBarTranslateY = useSharedValue(0);
  const isVisible = useSharedValue(true);
  const lastScrollY = useSharedValue(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorTranslateX = useSharedValue(0);

  // Animate indicator khi đổi tab
  useEffect(() => {
    if (containerWidth === 0) return;
    const tabWidth = (containerWidth - 64) / state.routes.length;
    const targetX = state.index * tabWidth + tabWidth / 2 - 20; // 20 = half indicator (40/2)
    indicatorTranslateX.value = withTiming(targetX, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  }, [state.index, containerWidth]);

  // Context setup
  const contextValue = useMemo(() => {
    const hideTabBar = () => {
      isVisible.value = false;
      tabBarTranslateY.value = withTiming(120, { duration: 200 });
    };

    const showTabBar = () => {
      isVisible.value = true;
      tabBarTranslateY.value = withTiming(0, { duration: 200 });
    };

    const setScrollOffset = (offset: number) => {
      const currentScrollY = offset;
      const previousScrollY = lastScrollY.value;
      const scrollDiff = currentScrollY - previousScrollY;
      
      if (Math.abs(scrollDiff) < 5) return;
      
      if (scrollDiff > 0 && currentScrollY > 50) {
        if (isVisible.value) hideTabBar();
      } else if (scrollDiff < 0) {
        if (!isVisible.value) showTabBar();
      }
      
      lastScrollY.value = currentScrollY;
    };

    const value = { hideTabBar, showTabBar, setScrollOffset };
    globalContextValue = value;
    return value;
  }, [tabBarTranslateY, isVisible, lastScrollY]);

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
    opacity: interpolate(
      tabBarTranslateY.value,
      [0, 120],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        scale: interpolate(
          tabBarTranslateY.value,
          [0, 60],
          [1, 0.8],
          Extrapolation.CLAMP
        )
      }
    ],
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorTranslateX.value }],
    };
  });

  return (
    <TabVisibilityContext.Provider value={contextValue}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 20,
            right: 20,
            bottom: insets.bottom - 10,
          },
          animatedTabBarStyle
        ]}
        className="items-center"
      >
        <Animated.View 
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          style={[
            animatedItemStyle,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              paddingHorizontal: 32,
              paddingVertical: 16,
              width: '100%',
            }
          ]}
        >
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

            return (
              <TabItem
                key={route.key}
                route={route}
                index={index}
                isFocused={isFocused}
                onPress={onPress}
                label={label}
              />
            );
          })}
        </Animated.View>
        
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -4,
              width: 40,
              height: 3,
              // backgroundColor: '#2563eb',
              borderRadius: 2,
            },
            animatedIndicatorStyle
          ]}
        />
      </Animated.View>
    </TabVisibilityContext.Provider>
  );
});

FloatingTabBar.displayName = 'FloatingTabBar';

// ============== TAB LAYOUT ==============
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen 
        name="product" 
        options={{ title: "Product" }} 
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/product");
          },
        }} 
      />
      <Tabs.Screen name="favourite" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

// ============== HOOKS ==============
export const useScrollTabHide = () => {
  const context = useTabVisibility();
  
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    context.setScrollOffset(offsetY);
  };

  return { handleScroll };
};
