import { useBSCT } from "@/contexts/BsctContext";
import { BSCT } from "@/types/bsct";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BSCTNewComponent() {
    const { getNewBSCTs } = useBSCT();
    const [newPosts, setNewPosts] = useState<BSCT[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getNewBSCTs(2); // lấy 5 bài viết mới
            setNewPosts(data);
        })();
    }, []);

    if (newPosts.length === 0) return null;

    return (
        // <View style={styles.container}>
        //     <Text style={styles.sectionTitle}>Bài viết mới</Text>
        //     <FlatList
        //         data={newPosts}
        //         nestedScrollEnabled
        //         renderItem={renderItem}
        //         keyExtractor={(item) => item._id}
        //         showsHorizontalScrollIndicator={false}
        //         contentContainerStyle={{ gap: 12 }}
        //     />
        // </View>
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Bài viết mới</Text>
            {newPosts.map((item) => (
                <TouchableOpacity
                    key={item._id}
                    style={styles.card}
                    onPress={() => router.push(`/bsct/${item._id}`)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: item.images || "https://via.placeholder.com/150" }}
                        style={styles.image}
                    />
                    <View style={styles.content}>
                        <Text numberOfLines={4} style={styles.title}>
                            {item.title}
                        </Text>
                         <Text numberOfLines={6} style={styles.summary}>
                            {item.summary}
                        </Text>
                        <View style={styles.meta}>
                            <Ionicons name="time-outline" size={14} color="#64748b" />
                            <Text style={styles.date}>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                                    : ""}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
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
        width: '100%',
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
        width: '100%',
        height: width * 0.55,
        borderRadius: 10,
    },
    content: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 10,
    },
    summary: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1e293b",
        marginBottom: 10,
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
