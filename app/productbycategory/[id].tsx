// app/productbycategory/[id].tsx
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
    _id: string;
    name: string;
    images?: string[];
    isMoi: boolean;
    isActive: boolean;
};

export default function ProductByCategoryScreen() {
    const baseUrl = 'http://localhost:4000/api'

    const { id } = useLocalSearchParams<{ id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${baseUrl}/product/category/${id}?search=${search}`);
            const data = await res.json();
            setProducts(data.data?.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
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


    const renderItem = ({ item }: { item: Product }) => {
        
        const handleProductPress = () => {
            router.push(`/product/${item._id}`);
        };
        return (
            <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleProductPress()}
                    activeOpacity={0.8}
                  >
            <View style={styles.card}>
                <Image
                    source={{ uri: item.images?.[0] || "https://via.placeholder.com/150" }}
                    style={styles.image}
                />

                {/* Badge NEW */}
                {item.isMoi && (
                    <View style={styles.badgeNew}>
                        <Text style={styles.badgeNewText}>Mới</Text>
                    </View>
                )}

                {/* Tym icon */}
                <TouchableOpacity style={styles.heartBtn}>
                    <AntDesign name="heart" size={20} color="red" />
                </TouchableOpacity>

                {/* Name */}
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
            </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar
                barStyle="dark-content" // "dark-content" (chữ đen), "light-content" (chữ trắng)
                backgroundColor="#fff"  // màu nền cho Android
                translucent={false}     // false = giữ safe area, true = đè lên nội dung
            />
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sản phẩm</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>

                {/* Products grid */}
                <FlatList
                    key={2}
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backText: { fontSize: 20, marginRight: 12 },
    headerTitle: { fontSize: 18, fontWeight: "600" },

    searchContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
    },

    grid: {
        padding: 8,
    },
    card: {
        flex: 1,
        margin: 6,
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        position: "relative",
    },
    image: {
        width: "100%",
        height: 140,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    name: {
        padding: 8,
        fontSize: 14,
        fontWeight: "500",
    },

    badgeNew: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#ff4444",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeNewText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    heartBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 20,
        padding: 4,
    },
});
