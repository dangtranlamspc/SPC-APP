import CategoryForHome from '@/components/CategoryHome';
import { CustomDrawer } from '@/components/CustomDrawer';
import ProductNewComponent from '@/components/ProductCardComponent';
import SliderComponent from '@/components/SliderComponnent';
import { useProduct } from '@/contexts/ProductContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
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

type RootDrawerParamList = {
  "(tabs)": undefined;
  "(app)": undefined;
};

type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const HomeScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
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
          onPress={() => setDrawerVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trang Chủ</Text>

        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
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
    fontSize: 22,
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
  productsSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,          // bo tròn nhiều hơn cho dạng capsule
    paddingHorizontal: 10,     // dài hơn một chút
    paddingVertical: 3,
    shadowColor: '#000',       // thêm chút bóng nhẹ
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  placeholderText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginTop: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  productsList: {
    paddingHorizontal: 20,
  },
  productSeparator: {
    width: 15,
  },
  productCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 4,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
  productDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#95A5A6',
    textDecorationLine: 'line-through',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default HomeScreen;