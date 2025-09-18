import { useFavourite } from '@/contexts/FavouriteContext';
import { useProduct } from '@/contexts/ProductCTGDContext';
import { CTGD } from '@/types/ctgd';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // const [showSearchBar, setShowSearchBar] = useState<boolean>(true); // Always show search bar
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');

  // const navigation = useNavigation();

  const handleCategorySelect = useCallback((categoryCTGDId: string) => {
    if (selectedCategory !== categoryCTGDId) {
      setSelectedCategory(categoryCTGDId);
    }
  }, [selectedCategory, setSelectedCategory]);

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
  }

  const clearSearch = () => {
    setTempSearchQuery('');
    setSearchQuery('');
  };

  const CategoryTab = React.memo(({ categoryctgd, isSelected, onPress }: {
    categoryctgd: any;
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
        {categoryctgd.name}
      </Text>
    </TouchableOpacity>
  ));

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          value={tempSearchQuery}
          onChangeText={setTempSearchQuery}
          onSubmitEditing={handleSearch}
          placeholder="Tìm kiếm sản phẩm..."
          style={styles.searchInput}
          returnKeyType="search"
          multiline={false}
        />
        {tempSearchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
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
      {categories.map((categoryctgd) => (
        <CategoryTab
          key={categoryctgd._id}
          categoryctgd={categoryctgd}
          isSelected={selectedCategory === categoryctgd._id}
          onPress={() => handleCategorySelect(categoryctgd._id)}
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

  const ProductCard = React.memo(({ item }: { item: CTGD }) => {
    const { toggleFavourite, favourites } = useFavourite();
    const [localFavouriteState, setLocalFavouriteState] = useState<boolean | null>(null);

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
      router.push(`/ctgd/${item._id}`);
    }, [item._id]);

    const handleFavoritePress = useCallback(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (!token && !userData) {
          router.push('/(auth)/login');
          return;
        }

        const newFavouriteState = !isFavourite;
        setLocalFavouriteState(newFavouriteState);

        await toggleFavourite(item._id, 'ProductConTrungGiaDung');

        setTimeout(() => {
          setLocalFavouriteState(null);
        }, 100);

      } catch (error) {
        console.error('Error toggling favourite:', error);
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
          {item.categoryctgd && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.categoryctgd.name}</Text>
            </View>
          )}
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const renderProductCard = useCallback(({ item }: { item: CTGD }) => (
    <ProductCard item={item} />
  ), []);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="search" size={64} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>Không tìm thấy sản phẩm</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? `Không tìm thấy sản phẩm cho "${searchQuery}"`
          : "Không có sản phẩm nào trong danh mục này"
        }
      </Text>
    </View>
  ), [searchQuery]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: CARD_WIDTH * 1.2 + 32,
    offset: (CARD_WIDTH * 1.2 + 32) * Math.floor(index / 2),
    index,
  }), []);

  const keyExtractor = useCallback((item: CTGD) => item._id, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <View style={styles.headerWrapper}>
          {renderSearchBar()}
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
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.headerWrapper}>
        {renderSearchBar()}
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
        style={{ flex: 1, backgroundColor: '#F8F9FA' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header Wrapper - Fixed container
  headerWrapper: {
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: -55
    // position: 'absolute',
    // top: 10,
    // left: 0,
    // right: 0,
    // zIndex: 1,
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },

  cardContent: {
    alignItems: 'center',
    paddingTop: 10
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

  clearButton: {
    padding: 4,
  },

  searchButton: {
    backgroundColor: '#4F7AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
  },

  searchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Category Styles
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 60,
    minHeight: 60,
  },

  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  categoryTabActive: {
    backgroundColor: '#4F7AFF',
    borderColor: '#4F7AFF',
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    minHeight: 48,
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
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    shadowColor: '#000',
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

  imageContainer: {
    position: 'relative',
    height: CARD_WIDTH * 1.2,
    backgroundColor: '#e7ebeeff',
    borderRadius: 8,
    overflow: 'hidden',
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
    top: 8,
    right: 8,
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
});