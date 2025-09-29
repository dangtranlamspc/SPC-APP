import { useFavourite } from '@/contexts/FavouriteContext';
import { Colors, useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { JSX, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useScrollTabHide } from './_layout';

interface ProductImage {
  url: string;
  imageId: string;
}

interface FavouriteProduct {
  _id: string;
  name: string;
  images: ProductImage[];
  category?: {
    _id: string;
    name: string;
  };
  isMoi: boolean;
  average_rating?: number;
  rating_count?: number;
  favouriteId: string;
  favouriteAt: string;
  isFavourite: true;
  productType: 'Product' | 'ProductNongNghiepDoThi' | 'ProductConTrungGiaDung';
}

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  addListener: (event: string, callback: () => void) => () => void;
};

const FavouriteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const {
    favourites,
    loading,
    refreshing,
    error,
    pagination,
    getFavourites,
    toggleFavourite,
    loadMoreFavourites,
    refreshFavourites,
    clearError,
  } = useFavourite();

  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { handleScroll } = useScrollTabHide();

  // Create dynamic styles using theme
  const styles = createStyles(theme);

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

  useEffect(() => {
    // Load favourites when screen focuses
    const unsubscribe = navigation.addListener('focus', () => {
      getFavourites();
    });

    return unsubscribe;
  }, [navigation, getFavourites]);

  const handleRemoveFavourite = async (productId: string, productName: string, productType: 'Product' | 'ProductNongNghiepDoThi' | 'ProductConTrungGiaDung'): Promise<void> => {
    Alert.alert(
      'Xóa khỏi yêu thích',
      `Bạn có chắc chắn muốn xóa "${productName}" khỏi danh sách yêu thích?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setRemovingItems(prev => new Set([...prev, productId]));
            try {
              await toggleFavourite(productId, productType);
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm khỏi yêu thích');
            } finally {
              setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
              });
            }
          }
        }
      ]
    );
  };

  const getImageUri = (item: FavouriteProduct): string => {
    if (item.images && item.images.length > 0) {
      return item.images[0].url; // lấy url đầu tiên
    }
    return 'https://via.placeholder.com/100';
  };

  const handleProductPress = (product: FavouriteProduct): void => {
    switch (product.productType) {
      case 'Product':
        router.push(`/product/${product._id}`);
        break;
      case 'ProductNongNghiepDoThi':
        router.push(`/nndt/${product._id}`);
        break;
      case 'ProductConTrungGiaDung':
        router.push(`/ctgd/${product._id}`);
        break;
    }
  };

  const renderFavouriteItem: ListRenderItem<FavouriteProduct> = ({ item }) => {
    const isRemoving = removingItems.has(item._id);

    return (
      <TouchableOpacity
        style={[styles.favouriteItem, isRemoving && styles.removingItem]}
        onPress={() => handleProductPress(item)}
        disabled={isRemoving}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{
              uri: getImageUri(item)
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {item.isMoi && (
            <Animated.View style={[styles.newBadge, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.newText}>MỚI</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category.name}</Text>
            </View>
          )}
          <View style={styles.metaInfo}>
            <Text style={styles.favouritedDate}>
              Đã thích: {new Date(item.favouriteAt).toLocaleDateString('vi-VN')}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color={theme.warning} />
              <Text style={styles.rating}>
                {item.average_rating?.toFixed(1) || '0.0'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavourite(item._id, item.name, item.productType)}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color={theme.error} />
          ) : (
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
              <Icon name="favorite" size={24} color={theme.error} />
            </Animated.View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = (): JSX.Element => (
    <View style={styles.emptyState}>
      <Icon name="favorite-border" size={80} color={theme.textSecondary} />
      <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
      <Text style={styles.emptyDescription}>
        Hãy khám phá và thêm những sản phẩm bạn yêu thích vào danh sách này
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('product')}
      >
        <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = (): JSX.Element => (
    <View style={styles.errorState}>
      <Icon name="error-outline" size={80} color={theme.error} />
      <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          clearError();
          getFavourites();
        }}
      >
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = (): JSX.Element | null => {
    if (!loading || favourites.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
      </View>
    );
  };

  if (error && favourites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        </View>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        {favourites.length > 0 && (
          <Text style={styles.itemCount}>
            {pagination.total} sản phẩm
          </Text>
        )}
      </View>

      {favourites.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={favourites}
          renderItem={renderFavouriteItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshFavourites}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          onEndReached={() => {
            if (pagination.page < pagination.pages && !loading) {
              loadMoreFavourites();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      {loading && favourites.length === 0 && (
        <View style={styles.initialLoader}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loaderText}>Đang tải...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  header: {
    backgroundColor: theme.surface,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text
  },
  itemCount: {
    fontSize: 14,
    color: theme.textSecondary
  },
  listContainer: {
    padding: 15
  },
  favouriteItem: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  removingItem: {
    opacity: 0.6
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 15
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between'
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  favouritedDate: {
    fontSize: 12,
    color: theme.textSecondary
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    fontSize: 12,
    color: theme.textSecondary,
    marginLeft: 4
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 5,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.primary,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 20,
    marginBottom: 10
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30
  },
  exploreButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25
  },
  exploreButtonText: {
    color: theme.headerText,
    fontSize: 16,
    fontWeight: '600'
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 20,
    marginBottom: 10
  },
  errorDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 30
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25
  },
  retryButtonText: {
    color: theme.headerText,
    fontSize: 16,
    fontWeight: '600'
  },
  initialLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.textSecondary
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  footerLoaderText: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.textSecondary
  }
});

export default FavouriteScreen;