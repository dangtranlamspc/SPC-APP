import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useProduct } from '../../contexts/ProductContext';

import { useFavourite } from '@/contexts/FavouriteContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HtmlDescription from '../../components/HtmlDescription';

const { width } = Dimensions.get('window');
function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, ""); // bỏ thẻ <p>, <strong>, ...
}



export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getProduct, toggleFavorite } = useProduct();
    const {favourites} = useFavourite();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const product = id ? getProduct(id) : undefined;

    if (!product || !id) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#64748b" />
                    </TouchableOpacity>
                </View>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundTitle}>Product Not Found</Text>
                    <Text style={styles.notFoundText}>The product you're looking for doesn't exist.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const images = Array.isArray(product.images) ? product.images : [];
    const currentImage = images[selectedImageIndex] || images[0];

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#64748b" />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
                {product.name}
            </Text>

            {/* <TouchableOpacity
                onPress={() => toggleFavorite(product._id)}
                style={styles.favoriteHeaderButton}
            >
                <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavorite ? "#ef4444" : "#64748b"}
                />
            </TouchableOpacity> */}
        </View>
    );

    const renderImageGallery = () => (
        <View style={styles.imageSection}>
            <View style={styles.mainImageContainer}>
                {currentImage ? (
                    <Image
                        source={{
                            uri: typeof currentImage === 'string' ? currentImage : currentImage.url
                        }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderMainImage}>
                        <Ionicons name="image-outline" size={64} color="#94a3b8" />
                    </View>
                )}
            </View>

            {images.length > 1 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailContainer}
                    contentContainerStyle={styles.thumbnailContent}
                >
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedImageIndex(index)}
                            style={[
                                styles.thumbnail,
                                selectedImageIndex === index && styles.thumbnailActive
                            ]}
                        >
                            <Image
                                source={{
                                    uri: typeof image === 'string' ? image : image.url
                                }}
                                style={styles.thumbnailImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );

    const renderProductInfo = () => (
        <View style={styles.infoSection}>
            <Text style={styles.productTitle}>{product.name}</Text>

            {product.category && (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{product.category.name}</Text>
                </View>
            )}

            {product.average_rating && (
                <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons
                                key={i}
                                name={i < Math.floor(product.average_rating!) ? "star" : "star-outline"}
                                size={20}
                                color="#fbbf24"
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>
                        {product.average_rating}
                    </Text>
                </View>
            )}

            {product.description && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>HƯỚNG DẪN SỬ DỤNG</Text>
                    {/* <Text style={styles.description}>{product.description}</Text> */}

                    <HtmlDescription
                        htmlContent={product.description}
                        containerStyle={styles.htmlContainer}
                    />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            {renderHeader()}

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {renderImageGallery()}
                {renderProductInfo()}
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop : 50,
    },

    // Header Styles
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },

    htmlContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        marginHorizontal: 16,
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
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
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
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
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

    // Card Styles

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

    cardContent: {
        padding: 12,
    },

    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
        lineHeight: 18,
    },

    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#dbeafe',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },

    categoryBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1d4ed8',
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

    // Product Detail Styles
    content: {
        flex: 1,
    },

    imageSection: {
        backgroundColor: 'white',
        paddingBottom: 16,
    },

    mainImageContainer: {
        width: width,
        height: width * 1.1,
        backgroundColor: '#f8f9fa',
    },

    mainImage: {
        width: '100%',
        height: '100%',
    },

    placeholderMainImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9ecef',
    },

    thumbnailContainer: {
        marginTop: 16,
    },

    thumbnailContent: {
        paddingHorizontal: 16,
        gap: 8,
    },

    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },

    thumbnailActive: {
        borderColor: '#2563eb',
    },

    thumbnailImage: {
        width: '100%',
        height: '100%',
    },

    infoSection: {
        backgroundColor: 'white',
        padding: 16,
        marginTop: 8,
    },

    productTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
        lineHeight: 30,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },

    section: {
        marginTop: 24,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
    },

    description: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 24,
    },

    specifications: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
    },

    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },

    specKey: {
        fontSize: 14,
        color: '#64748b',
        flex: 1,
    },

    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        textAlign: 'right',
    },

    sellerEmail: {
        fontSize: 16,
        color: '#64748b',
    },

    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },

    notFoundTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
        textAlign: 'center',
    },

    notFoundText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
});