import BSCTNewComponent from '@/components/BsctNewComponent';
import CategoryForHome from '@/components/CategoryHome';
import { CustomDrawer } from '@/components/CustomDrawer';
import ProductNewComponent from '@/components/ProductCardComponent';
import SliderComponent from '@/components/SliderComponnent';
import ThuVienNewComponent from '@/components/ThuVienNewComponent';
import { useProduct } from '@/contexts/ProductContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useScrollTabHide } from './_layout';


type RootDrawerParamList = {
  "(tabs)": undefined;
};

type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const HomeScreen: React.FC = () => {

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { handleScroll } = useScrollTabHide();

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const {
    refreshNewProducts,
  } = useProduct();

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNewProducts();
    setRefreshing(false);
  };

  const handleNavigateTo = useCallback((screen: string) => {
    // Your navigation logic here
    console.log('Navigating to:', screen);

    // Example with react-navigation:
    // navigation.navigate(screen);

    // Close drawer after navigation
    setDrawerVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content" // "dark-content" (chữ đen), "light-content" (chữ trắng)
        backgroundColor="#fff"  // màu nền cho Android
        translucent={true}     // false = giữ safe area, true = đè lên nội dung
      />
      <View style={styles.header}>
        {/* Nút 3 gạch mở Drawer */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trang Chủ</Text>

        <TouchableOpacity onPress={() => router.push('/notification/notification')} style={styles.notificationButton}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        onScroll={handleScroll} // Gắn handler vào ScrollView
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}


        {/* Slider Component */}
        <SliderComponent
          height={200}
          autoPlay={true}
          autoPlayInterval={3000}
          showIndicators={true}
          showTitle={true}
          borderRadius={12}
        />

        <ProductNewComponent />

        <CategoryForHome />

        <BSCTNewComponent />

        <ThuVienNewComponent/>
      </ScrollView>
      {drawerVisible && (
        <CustomDrawer isOpen={drawerVisible}
          onClose={handleCloseDrawer}
          navigateTo={handleNavigateTo} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 5,
    elevation: 5,
  },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  menuItem: { paddingVertical: 12 },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 30,
    color: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor: '#FFFFFF',

    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  notificationButton: {
    padding: 8,
  },
  notificationText: {
    fontSize: 20,
  },

});

export default HomeScreen;