// app/productbycategory/[id].tsx
import { BASE_URL } from '@env';
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProductImage = {
    url: string;
    imageId: string;
}

type Product = {
    _id: string;
    name: string;
    images: ProductImage[];
    isMoi: boolean;
    isActive: boolean;
};

export default function ProductByCategoryScreen() {

    const { id } = useLocalSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            if (!refreshing) setLoading(true);
            const res = await fetch(`${BASE_URL}/product/category/${id}?search=${search}`);
            const data = await res.json();
            setProducts(data.data?.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id, search]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchProducts();
        setRefreshing(false);
    };


    const renderItem = ({ item, index }: { item: Product; index: number }) => {
        const handleProductPress = () => {
            router.push(`/product/${item._id}`);
        };

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    { marginLeft: index % 2 === 0 ? 0 : 8 }
                ]}
                onPress={handleProductPress}
                activeOpacity={0.9}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.images[0].url }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />

                    {/* Gradient overlay */}
                    <View style={styles.imageOverlay} />

                    {/* Badge Mới */}
                    {item.isMoi && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>MỚI</Text>
                        </View>
                    )}

                    {/* Heart button */}
                    <TouchableOpacity style={styles.favoriteButton}>
                        <AntDesign name="hearto" size={16} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Product info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <AntDesign name="inbox" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
            <Text style={styles.emptySubText}>Hãy thử tìm kiếm với từ khóa khác</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <AntDesign name="arrowleft" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <AntDesign name="search1" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <AntDesign name="close" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Products grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#007AFF"
                        colors={["#007AFF"]}
                    />
                }
                ListEmptyComponent={renderEmptyState}
                columnWrapperStyle={styles.row}
            />
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },

    // Search
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },

    // Grid
    gridContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    // Product card
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
        height: height * 0.25,
    },
    productImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },

    // Badges and buttons
    newBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#ff4757',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#ff4757',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    newBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    // Product info
    productInfo: {
        padding: 12,
        alignItems: 'center'
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        lineHeight: 18,

    },

    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
        textAlign: 'center',
    },
});