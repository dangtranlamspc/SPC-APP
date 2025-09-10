import { useThuVien } from "@/contexts/ThuVienContext";
import { ThuVien } from "@/types/thuvien";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";


export default function ThuVienNewComponent() {
    const { getNewThuVien } = useThuVien();
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [newPosts, setNewPosts] = useState<ThuVien[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getNewThuVien(1); // lấy 5 bài viết mới
            setNewPosts(data);
        })();
    }, []);

    if (newPosts.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Bài viết mới</Text>
            {newPosts.map((item) => (
                <View key={item._id || item.videoId} style={styles.listItem}>
                    {/* Video player inline */}
                    <YoutubePlayer
                        height={220}
                        play={playingVideo === item.videoId}
                        videoId={item.videoId}
                        onChangeState={(state: any) => {
                            if (state === "ended") {
                                setPlayingVideo(null);
                            } else if (state === "playing") {
                                setPlayingVideo(item.videoId);
                            }
                        }}
                    />
                    {/* Info */}
                    <View style={{ padding: 8 }}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemCategory}>
                            {item.categoryThuVien?.name || "Không có danh mục"}
                        </Text>
                    </View>
                </View>
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
    listItem: {
        backgroundColor: '#ffffff',
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
    itemTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        lineHeight: 24,
    },
        itemCategory: {
        fontSize: 14,
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
});

