import { useFavourite } from '@/contexts/FavouriteContext';
import { useProduct } from '@/contexts/ProductContext';
import { useTheme } from '@/contexts/ThemeContext';
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
import { useScrollTabHide } from './_layout';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2; // 2 columns with padding

export default function ProductListScreen() {
  const {
    products,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    totalProducts,
    setSearchQuery,
    setSelectedCategory,
  } = useProduct();

  const { theme, isDark } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { handleScroll } = useScrollTabHide();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
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

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setShowSearchBar(false);
  }

  const clearSearch = () => {
    setTempSearchQuery('');
    setSearchQuery('');
  };

  const handleShowSearch = () => {
    setTempSearchQuery(searchQuery || '');
    setShowSearchBar(true);
  };

  const handleHideSearch = () => {
    setShowSearchBar(false);
    setTempSearchQuery('');
  };

  const CategoryTab = React.memo(({ category, isSelected, onPress }: {
    category: any;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const styles = createStyles(theme, isDark);
    return (
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
    )
  });

  const renderHeaderContent = () => {
    const styles = createStyles(theme, isDark);
    return (
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sản phẩm</Text>
        <TouchableOpacity
          onPress={handleShowSearch}
          style={styles.searchIcon}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    )
  };

  const renderSearchBar = () => {
    const styles = createStyles(theme, isDark);
    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={handleHideSearch}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            value={tempSearchQuery}
            onChangeText={setTempSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={theme.textSecondary}
            style={styles.searchInput}
            autoFocus={true}
            returnKeyType="search"
            multiline={false}
          />
          {tempSearchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
    )
  };

  const renderHeader = () => {
    const styles = createStyles(theme, isDark);
    return (
      <View style={styles.header}>
        {showSearchBar ? renderSearchBar() : renderHeaderContent()}
      </View>
    )
  };

  const renderCategoryTabs = useCallback(() => {
    const styles = createStyles(theme, isDark);
    return (
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
    )
  }, [categories, selectedCategory, handleCategorySelect, theme, isDark]);

  const renderSearchInfo = useCallback(() => {
    if (!searchQuery) return null;
    const styles = createStyles(theme, isDark);
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
  }, [searchQuery, totalProducts, theme, isDark]);

  const ProductCard = React.memo(({ item }: { item: Product }) => {
    const { toggleFavourite, isFavourite } = useFavourite();
    const [localFavouriteState, setLocalFavouriteState] = useState<boolean | null>(null);
    const [showNewBadge, setShowNewBadge] = useState(false);

    const styles = createStyles(theme, isDark);

    // Get favourite status from context using the isFavourite function
    const isFavouriteFromContext = isFavourite(item._id);

    // Use local state if available, otherwise use context
    const currentFavouriteState = localFavouriteState !== null ? localFavouriteState : isFavouriteFromContext;

    // Reset local state when context updates
    useEffect(() => {
      if (localFavouriteState !== null) {
        const timer = setTimeout(() => {
          setLocalFavouriteState(null);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [isFavouriteFromContext]);

    useEffect(() => {
      if (item.isMoi) {
        setShowNewBadge(true);
        const timer = setTimeout(() => {
          setShowNewBadge(false)
        },5000)
        return () => clearTimeout(timer)
      }
    },[item.isMoi])

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
        const newFavouriteState = !currentFavouriteState;
        setLocalFavouriteState(newFavouriteState);

        // Gọi API với productType
        await toggleFavourite(item._id, 'Product');

        // Sau khi API thành công, reset local state để dùng context
        setTimeout(() => {
          setLocalFavouriteState(null);
        }, 100);

      } catch (error) {
        console.error('Error toggling favourite:', error);

        // Kiểm tra nếu là lỗi authentication
        if (error instanceof Error && error.message.includes('Authentication required')) {
          // Redirect to login
          router.push('/(auth)/login');
          return;
        }

        // Revert local state nếu có lỗi khác
        setLocalFavouriteState(currentFavouriteState);
      }
    }, [item._id, toggleFavourite, currentFavouriteState]);

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
              <Ionicons name="image-outline" size={32} color={theme.textSecondary} />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          {item.isMoi && showNewBadge && (
            <Animated.View style={[styles.newBadge, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.newText}>MỚI</Text>
            </Animated.View>
          )}
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={[
              styles.favoriteButton,
              currentFavouriteState && styles.favoriteButtonActive
            ]}
          >
            <Ionicons
              name={currentFavouriteState ? "heart" : "heart-outline"}
              size={16}
              color={currentFavouriteState ? "white" : theme.textSecondary}
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
  ), [theme, isDark]);

  const renderEmptyState = useCallback(() => {
    const styles = createStyles(theme, isDark);
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search" size={64} color={theme.textSecondary} />
        <Text style={styles.emptyStateTitle}>No Products Found</Text>
        <Text style={styles.emptyStateText}>
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : "No products available in this category"
          }
        </Text>
      </View>
    )
  }, [searchQuery, theme, isDark]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: CARD_WIDTH * 1.2 + 32,
    offset: (CARD_WIDTH * 1.2 + 32) * Math.floor(index / 2),
    index,
  }), []);

  const keyExtractor = useCallback((item: Product) => item._id, []);

  const styles = createStyles(theme, isDark);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        <View style={styles.headerWrapper}>
          {renderHeader()}
          {renderCategoryTabs()}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={false}
      />
      <View style={styles.headerWrapper}>
        {renderHeader()}
        {renderCategoryTabs()}
        {renderSearchInfo()}
      </View>
      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
        style={[{ flex: 1 }, { backgroundColor: theme.background }]}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  // Header Wrapper - Fixed container
  headerWrapper: {
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  // Header Styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
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
    color: theme.text,
  },

  searchIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.background + '80',
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
    backgroundColor: theme.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    } : {
      borderWidth: 1,
      borderColor: theme.border
    })
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },

  clearButton: {
    padding: 4,
  },

  searchButton: {
    backgroundColor: theme.primary,
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
    minHeight: 60,
    backgroundColor: theme.card,
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
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
  },

  categoryTabActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },

  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
  },

  categoryTabTextActive: {
    color: 'white',
  },

  // Search Info
  searchInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    minHeight: 48,
  },

  searchInfoText: {
    fontSize: 14,
    color: theme.textSecondary,
  },

  searchInfoCount: {
    fontSize: 14,
    color: theme.textSecondary,
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
    backgroundColor: theme.error,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 2,
    borderColor: theme.card,
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
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 15,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6
    } : {
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    }),
    marginBottom: 4,
  },

  imageContainer: {
    borderRadius : 10,
    position: 'relative',
    height: CARD_WIDTH * 1.2,
    backgroundColor: theme.surface,
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius : 10,
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },

  placeholderText: {
    fontSize: 12,
    color: theme.textSecondary,
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
    backgroundColor: theme.error,
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
    paddingTop: 10
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
  },

  categoryBadge: {
    backgroundColor: theme.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center'
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.primary,
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
    color: theme.textSecondary,
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
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 16,
    color: theme.textSecondary,
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