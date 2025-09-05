import { useFavourite } from '@/contexts/FavouriteContext';
import { useProduct } from '@/contexts/ProductContext';
import { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2; // 2 columns with padding

export default function ProductListScreen() {
  const {
    products,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    currentPage,
    totalPages,
    totalProducts,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage

  } = useProduct();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, // phóng to
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // thu nhỏ lại
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');

  const navigation = useNavigation();

  const handleCategorySelect = useCallback((categoryId: string) => {
    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [selectedCategory, setSelectedCategory]);


  // const handleCategorySelect = useCallback(
  //   (categoryId: string) => {
  //     if (selectedCategory === categoryId) {
  //       setSelectedCategory(''); // chọn lại thì bỏ filter
  //     } else {
  //       setSelectedCategory(categoryId);
  //     }
  //   },
  //   [selectedCategory, setSelectedCategory]
  // );

  // const handleSearch = useCallback((): void => {
  //   setSearchQuery(tempSearchQuery);
  //   setShowSearchBar(false);
  // }, [tempSearchQuery, setSearchQuery]);

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setShowSearchBar(false);
  }

  const clearSearch = () => {
    setTempSearchQuery('');
    setSearchQuery('');
  };

  const handleShowSearch = () => {
    setTempSearchQuery(searchQuery || ''); // Đảm bảo không null/undefined
    setShowSearchBar(true);
  };

  const handleHideSearch = () => {
    setShowSearchBar(false);
    setTempSearchQuery('');
  };

  // const clearSearch = useCallback((): void => {
  //   setTempSearchQuery('');
  //   setSearchQuery('');
  //   // setShowSearchBar(false);
  // }, [setSearchQuery]);

  // const handleShowSearch = useCallback(() => {
  //   setTempSearchQuery(searchQuery)
  //   setShowSearchBar(true);
  // }, []);

  // const handleHideSearch = useCallback(() => {
  //   setShowSearchBar(false);
  //   setTempSearchQuery('');
  // }, []);

  // Memoized category tab component
  const CategoryTab = React.memo(({ category, isSelected, onPress }: {
    category: any;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.categoryTab,
        isSelected && styles.categoryTabActive
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryTabText,
          isSelected && styles.categoryTabTextActive
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  ));

  // Separate header components to prevent re-renders
  // const HeaderContent = React.memo(() => (
  //   <View style={styles.headerContent}>
  //     <TouchableOpacity
  //       style={styles.menuButton}
  //       onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
  //     >
  //       <Text style={styles.menuIcon}>☰</Text>
  //     </TouchableOpacity>
  //     <Text style={styles.headerTitle}>Sản phẩm</Text>
  //     <TouchableOpacity
  //       onPress={handleShowSearch}
  //       style={styles.searchIcon}
  //       activeOpacity={0.7}
  //     >
  //       <Ionicons name="search" size={20} color="#64748b" />
  //     </TouchableOpacity>
  //   </View>
  // ));

  const renderHeaderContent = () => (
    <View style={styles.headerContent}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Sản phẩm</Text>
      <TouchableOpacity
        onPress={handleShowSearch}
        style={styles.searchIcon}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={20} color="#64748b" />
      </TouchableOpacity>
    </View>
  );

  // const SearchBarContent = React.memo(() => (
  //   <View style={styles.searchContainer}>
  //     <TouchableOpacity
  //       onPress={handleHideSearch}
  //       style={styles.backButton}
  //       activeOpacity={0.7}
  //     >
  //       <Ionicons name="arrow-back" size={24} color="#64748b" />
  //     </TouchableOpacity>
  //     <View style={styles.searchInputContainer}>
  //       <TextInput
  //         value={tempSearchQuery}
  //         onChangeText={(text) => {
  //           console.log('Input changed:', text)
  //           setTempSearchQuery(text)
  //         }}
  //         onSubmitEditing={handleSearch}
  //         placeholder="Tìm kiếm sản phẩm..."
  //         style={styles.searchInput}
  //         returnKeyType='search'
  //         multiline={false}
  //         numberOfLines={1}
  //         autoFocus
  //       />
  //       {tempSearchQuery.length ? 0 && (
  //         <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
  //           <Ionicons name="close" size={16} color="#94a3b8" />
  //         </TouchableOpacity>
  //       ) : null}
  //     </View>

  //     <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
  //       <Text style={styles.searchButtonText}>Tìm kiếm</Text>
  //     </TouchableOpacity>
  //   </View>
  // ));


  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        onPress={handleHideSearch}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#64748b" />
      </TouchableOpacity>
      <View style={styles.searchInputContainer}>
        <TextInput
          value={tempSearchQuery}
          onChangeText={setTempSearchQuery} // Đơn giản hóa
          onSubmitEditing={handleSearch}
          placeholder="Tìm kiếm sản phẩm..."
          style={styles.searchInput}
          autoFocus={true}
          returnKeyType="search"
          multiline={false}
          blurOnSubmit={false}
        />
        {tempSearchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={16} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );

  // const renderHeader = useCallback(() => (
  //   <View style={styles.header}>
  //     {showSearchBar ? <SearchBarContent /> : <HeaderContent />}
  //   </View>
  // ), [showSearchBar]);

  const renderHeader = () => (
    <View style={styles.header}>
      {showSearchBar ? renderSearchBar() : renderHeaderContent()}
    </View>
  );

  const renderCategoryTabs = useCallback(() => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
      removeClippedSubviews={true}
      keyboardShouldPersistTaps="handled"
    >
      {categories.map((category) => (
        <CategoryTab
          key={category._id}
          category={category}
          isSelected={selectedCategory === category._id}
          onPress={() => handleCategorySelect(category._id)}
        />
      ))}
    </ScrollView>
  ), [categories, selectedCategory, handleCategorySelect]);

  const renderSearchInfo = useCallback(() => {
    if (!searchQuery) return null;

    return (
      <View style={styles.searchInfo}>
        <Text style={styles.searchInfoText}>
          Tìm kiếm cho từ khoá: "{searchQuery}"
        </Text>
        <Text style={styles.searchInfoCount}>
          {totalProducts} sản phẩm được tìm thấy
        </Text>
      </View>
    );
  }, [searchQuery, totalProducts]);


  const ProductCard = React.memo(({ item }: { item: Product }) => {
    const { toggleFavourite, favourites } = useFavourite();
    const [localFavouriteState, setLocalFavouriteState] = useState<boolean | null>(null);

    // const isProductFavourite = isFavourite(item._id);
    // const isFavourite = useMemo(() => {
    //   return favourites.some(fav => fav._id === item._id);
    // }, [favourites, item._id]);

    const isFavouriteFromContext = useMemo(() => {
      return favourites.some(fav => fav._id === item._id);
    }, [favourites, item._id]);

    const isFavourite = localFavouriteState !== null ? localFavouriteState : isFavouriteFromContext;

    useEffect(() => {
      setLocalFavouriteState(null);
    }, [favourites]);

    const firstImage = useMemo(() => {
      return Array.isArray(item.images) && item.images.length > 0
        ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url)
        : null;
    }, [item.images]);

    const handleProductPress = useCallback(() => {
      router.push(`/product/${item._id}`);
    }, [item._id]);

    const handleFavoritePress = useCallback(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (!token && !userData) {
          router.push('/(auth)/login');
          return;
        }

        // Optimistic update - cập nhật local state ngay lập tức
        const newFavouriteState = !isFavourite;
        setLocalFavouriteState(newFavouriteState);

        // Gọi API
        await toggleFavourite(item._id);

        // Sau khi API thành công, reset local state để dùng context
        setTimeout(() => {
          setLocalFavouriteState(null);
        }, 100);

      } catch (error) {
        console.error('Error toggling favourite:', error);
        // Revert local state nếu có lỗi
        setLocalFavouriteState(null);
      }
    }, [item._id, toggleFavourite, isFavourite]);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={handleProductPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={32} color="#94a3b8" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          {item.isMoi && (
            <Animated.View style={[styles.newBadge, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.newText}>MỚI</Text>
            </Animated.View>
          )}
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={[
              styles.favoriteButton,
              isFavourite && styles.favoriteButtonActive
            ]}
          >
            <Ionicons
              name={isFavourite ? "heart" : "heart-outline"}
              size={16}
              color={isFavourite ? "white" : "#64748b"}
            />
          </TouchableOpacity>

          {item.average_rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={styles.ratingText}>{item.average_rating}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category.name}</Text>
            </View>
          )}
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <ProductCard item={item} />
  ), []);

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const handlePrevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
    const handleNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
        >
          <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        {/* <Text style={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </Text> */}

        <TouchableOpacity
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
          style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
        >
          <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [totalPages, currentPage, setCurrentPage]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="search" size={64} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>No Products Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? `No products found for "${searchQuery}"`
          : "No products available in this category"
        }
      </Text>
    </View>
  ), [searchQuery]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: CARD_WIDTH * 1.2 + 32, // card height + margin
    offset: (CARD_WIDTH * 1.2 + 32) * Math.floor(index / 2),
    index,
  }), []);

  const keyExtractor = useCallback((item: Product) => item._id, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          {renderHeader()}
          {renderCategoryTabs()}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar
        barStyle="dark-content" // "dark-content" (chữ đen), "light-content" (chữ trắng)
        backgroundColor="#F8F9FA"  // màu nền cho Android
        translucent={false}     // false = giữ safe area, true = đè lên nội dung
      />
      <View style={styles.headerWrapper}>
        {renderHeader()}
        {renderCategoryTabs()}
        {renderSearchInfo()}
      </View>
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={renderEmptyState}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
        updateCellsBatchingPeriod={50}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header Wrapper - Fixed container
  headerWrapper: {
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  // Header Styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56, // Fixed height to prevent jumping
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  searchIcon: {
    padding: 8,
    borderRadius: 20,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
  },

  favoriteHeaderButton: {
    padding: 8,
    borderRadius: 20,
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },

  clearButton: {
    padding: 4,
  },

  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  searchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Category Styles
  categoryContainer: {
    maxHeight: 60,
    minHeight: 60, // Fixed height to prevent jumping
  },

  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 30,
    color: '#2C3E50',
  },

  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },

  categoryTabActive: {
    backgroundColor: '#2563eb',
  },

  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },

  categoryTabTextActive: {
    color: 'white',
  },

  // Search Info
  searchInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48, // Fixed height when present
  },

  searchInfoText: {
    fontSize: 14,
    color: '#64748b',
  },

  searchInfoCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // List Styles
  listContainer: {
    padding: 12,
    paddingBottom: 20,
  },

  row: {
    justifyContent: 'space-between',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,          // bo tròn nhiều hơn cho dạng capsule
    paddingHorizontal: 10,     // dài hơn một chút
    paddingVertical: 3,
    shadowColor: '#000',       // thêm chút bóng nhẹ
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Card Styles
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding : 15,
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

  imageContainer: {
    position: 'relative',
    height: CARD_WIDTH * 1.2,
    backgroundColor: '#e7ebeeff',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },

  placeholderText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginTop: 4,
  },

  favoriteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  favoriteButtonActive: {
    backgroundColor: '#ef4444',
  },

  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },

  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },

  cardContent: {
    alignItems: 'center',
    paddingTop : 10
  },

  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',

  },

  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center'
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1d4ed8',
    alignItems: 'center'
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 16,
  },

  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  paginationButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },

  paginationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  paginationButtonTextDisabled: {
    color: '#9ca3af',
  },

  paginationInfo: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});