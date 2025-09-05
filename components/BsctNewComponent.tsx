import { useBSCT } from "@/contexts/BsctContext";
import { BSCT } from "@/types/bsct";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BSCTNewComponent() {
    const { getNewBSCTs } = useBSCT();
    const [newPosts, setNewPosts] = useState<BSCT[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getNewBSCTs(5); // lấy 5 bài viết mới
            setNewPosts(data);
        })();
    }, []);

    const renderItem = ({ item }: { item: BSCT }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/bsct/${item._id}`)}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: item.images || "https://via.placeholder.com/150" }}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <Text numberOfLines={2} style={styles.title}>
                        {item.title}
                    </Text>
                    <View style={styles.meta}>
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text style={styles.date}>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : ""}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (newPosts.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Bài viết mới</Text>
            <FlatList
                data={newPosts}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            />
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 16, backgroundColor: "#F8F9FA"
    },
    sectionTitle: {
        fontSize: 20, fontWeight: "bold", marginBottom: 12
    },
    card: {
        width: width * 1.2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 4,
    },
    image: {
        width: width * 0.86,
        height: width * 0.55,
        borderRadius: 10,
    },
    content: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 6,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    date: {
        fontSize: 12,
        color: "#64748b",
    },
});
