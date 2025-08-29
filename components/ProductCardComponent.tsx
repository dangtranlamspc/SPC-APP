import { useProduct } from "@/contexts/ProductContext";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductNewComponent: React.FC = () => {
  const {
    newProducts,
    newProductsLoading,
    loadNewProducts,
  } = useProduct();

  const ProductCard = React.memo(({ item }: { item: Product }) => {
    const firstImage = useMemo(() => {
      return Array.isArray(item.images) && item.images.length > 0
        ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url)
        : null;
    }, [item.images]);
    const handleProductPress = useCallback(() => {
      router.push(`/product/${item._id}`);
    }, [item._id]);
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress()}
        activeOpacity={0.8}
      >
        <View style={styles.productImageContainer}>
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (<View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={32} color="#94a3b8" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>)}
          {item.isMoi && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>MỚI</Text>
            </View>
          )}
        </View>
        {/* {item.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category.name}</Text>
          </View>
        )} */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  });

  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <ProductCard item={item} />
  ), []);

  useEffect(() => {
    // Load new products when component mounts
    if (newProducts.length === 0 && !newProductsLoading) {
      loadNewProducts(2);
    }
  }, []);

  return (
    <View style={styles.productsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sản Phẩm Mới</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {newProductsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải sản phẩm mới...</Text>
        </View>
      ) : newProducts.length > 0 ? (
        <FlatList
          data={newProducts.slice(0, 2)}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có sản phẩm mới</Text>
        </View>
      )}
    </View>
  )
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
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
    paddingHorizontal : 10
  },
  productSeparator: {
    width: 15,
  },
  productCard: {
    width: width * 0.46,
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
    height: height * 0.25,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    alignItems : 'center'
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ProductNewComponent;