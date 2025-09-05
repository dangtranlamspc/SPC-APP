// app/bsct/[id].tsx
import HtmlDescription from "@/components/HtmlDescription";
import { BSCT } from "@/types/bsct";
import { apiCall } from "@/utils/apiCall";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    // Header & Image Styles
    headerImage: {
        width: '100%',
        height: width * 0.65,
        position: 'relative',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    headerActions: {
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerActionsRight: {
        flexDirection: 'row',
        gap: 12,
    },

    // Content Styles
    contentContainer: {
        flex: 1,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    // Category & Meta Info
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 12,
    },
    categoryText: {
        color: '#1976d2',
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },

    // Title & Content
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a1a1a',
        lineHeight: 36,
        marginBottom: 20,
    },

    // Author & Stats
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 24,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    publishDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1976d2',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },

    // Content Body
    contentBody: {
        lineHeight: 26,
        fontSize: 16,
        color: '#333',
        marginBottom: 30,
    },

    // Loading & Error
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    htmlContainer: {
        // backgroundColor: '#f8fafc',
        borderRadius: 12,
        // padding: 16,
        marginTop: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#1976d2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Action Buttons
    actionBar: {
        flexDirection: 'row',
        paddingHorizontal: 150,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        gap: 12,
        marginBottom : 8
    },
    actionBarButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    likeButton: {
        borderColor: '#ff4757',
        backgroundColor: '#fff5f5',
    },
    likeButtonActive: {
        backgroundColor: '#ff4757',
        borderColor: '#ff4757',
    },
    shareButton: {
        borderColor: '#1976d2',
        backgroundColor: '#f3f9ff',
    },
    actionButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    likeButtonText: {
        color: '#ff4757',
    },
    likeButtonTextActive: {
        color: '#ffffff',
    },
    shareButtonText: {
        color: '#1976d2',
    },
});

interface BSCTDetailProps {
    // Có thể thêm props nếu cần
}

export default function BSCTDetailScreen({ }: BSCTDetailProps) {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [bsct, setBsct] = useState<BSCT | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    const fetchBSCTDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const { success, data, error: apiError } = await apiCall<BSCT>({
                endpoint: `/bsct/${id}`,
                method: 'GET',
                requireAuth: false,
            });

            if (success && data) {
                setBsct(data);
            } else {
                setError(apiError || "Không thể tải thông tin blog");
            }
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBSCTDetail();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async () => {
        try {
            if (bsct) {
                await Share.share({
                    message: `${bsct.title}\n\nĐọc thêm tại app của chúng tôi!`,
                    title: bsct.title,
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // TODO: Call API to like/unlike
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976d2" />
                <Text style={{ marginTop: 16, color: '#666' }}>Đang tải...</Text>
            </View>
        );
    }

    if (error || !bsct) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#666" />
                <Text style={styles.errorText}>
                    {error || "Không tìm thấy blog này"}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchBSCTDetail}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header Image */}
            <View style={styles.headerImage}>
                {bsct.images && (
                    <Image
                        source={{ uri: bsct.images }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.imageOverlay} />

                {/* Header Actions */}
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.headerActionsRight}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Ionicons name="share-outline" size={20} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="bookmark-outline" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Category & Date */}
                <View style={styles.categoryContainer}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                            {bsct.categoryBSCT?.name || 'Không có danh mục'}
                        </Text>
                    </View>
                    {/* <Text style={styles.dateText}>
                        {formatDate(bsct.createdAt)}
                    </Text> */}
                </View>

                {/* Title */}
                <Text style={styles.title}>{bsct.title}</Text>

                {/* Author Section */}
                <View style={styles.authorSection}>
                    <View style={styles.authorAvatar}>
                        <Ionicons name="person" size={20} color="#1976d2" />
                    </View>
                    <View style={styles.authorInfo}>
                        {/* <Text style={styles.authorName}>Admin</Text> */}
                        <Text style={styles.publishDate}>
                            Đăng ngày {formatDate(bsct.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2.1K</Text>
                            <Text style={styles.statLabel}>Lượt xem</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>45</Text>
                            <Text style={styles.statLabel}>Lượt thích</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                {bsct.description && (
                    <Text style={styles.contentBody}>
                        <HtmlDescription
                            htmlContent={bsct.description}
                            containerStyle={styles.htmlContainer}
                        />
                    </Text>
                )}

            </ScrollView>

            {/* Action Bar */}
            {/* <View style={styles.actionBar}>
                <TouchableOpacity
                    style={[styles.actionBarButton, styles.likeButton, isLiked && styles.likeButtonActive]}
                    onPress={handleLike}
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={20}
                        color={isLiked ? "#ffffff" : "#ff4757"}
                    />
                    <Text style={[styles.actionButtonText, styles.likeButtonText, isLiked && styles.likeButtonTextActive]}>
                        Yêu thích
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBarButton, styles.shareButton]}
                    onPress={handleShare}
                >
                    <Ionicons name="share-social-outline" size={20} color="#1976d2" />
                    <Text style={[styles.actionButtonText, styles.shareButtonText]}>
                        Chia sẻ
                    </Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}