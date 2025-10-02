import WriteReviewModal from "@/components/WriteReviewModal";
import { Colors, useTheme } from "@/contexts/ThemeContext";
import { Review, ReviewStats } from "@/types/reviews";
import { BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductReviewComponent () {
    const {theme, isDark} = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'createdAt' | 'helpfulCount'>('createdAt');
    const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);

    const styles = createStyles(theme);

    useEffect(() => {
        fetchReviews();
    },[filterRating, sortBy]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                ...(filterRating && { rating : filterRating.toString()}),
                sortBy,
            });
            const response = await fetch(`${BASE_URL}/review/product/${id}?${query}`);

            const data = await response.json();

            if (data.success) {
                setReviews(data.data.reviews);
                setStats(data.data.stats);
            }
        } catch (error) {
            
        }
    }

    const renderStars = (rating: number, size = 16) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={theme.warning}
          />
        ))}
      </View>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const item = stats.distribution.find((d) => d._id === rating);
      const count = item?.count || 0;
      const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

      return { rating, count, percentage };
    });

    return (
      <View style={styles.distributionContainer}>
        <View style={styles.overallRating}>
          <Text style={styles.ratingNumber}>{stats.averageRating.toFixed(1)}</Text>
          {renderStars(Math.round(stats.averageRating), 20)}
          <Text style={styles.totalReviews}>{stats.totalReviews} đánh giá</Text>
        </View>

        <View style={styles.distributionBars}>
          {distribution.map((item) => (
            <TouchableOpacity
              key={item.rating}
              style={styles.distributionRow}
              onPress={() => setFilterRating(filterRating === item.rating ? null : item.rating)}
            >
              <Text style={styles.distributionLabel}>{item.rating} ★</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` },
                    filterRating === item.rating && styles.progressFillActive,
                  ]}
                />
              </View>
              <Text style={styles.distributionCount}>{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    const timeAgo = getTimeAgo(item.createdAt);

    return (
      <View style={styles.reviewCard}>
        {/* User Info */}
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              {/* {item.userId.avatar ? (
                <Image source={{ uri: item.userId.avatar }} style={styles.avatarImage} />
              ) : ( */}
                <Ionicons name="person" size={20} color={theme.textSecondary} />
              {/* )} */}
            </View>
            <View>
              <Text style={styles.userName}>{item.userId.name}</Text>
              <Text style={styles.reviewDate}>{timeAgo}</Text>
            </View>
          </View>
          {renderStars(item.rating)}
        </View>

        {/* Comment */}
        <Text style={styles.comment}>{item.comment}</Text>
        {item.isEdited && <Text style={styles.editedLabel}>Đã chỉnh sửa</Text>}

        {/* Images */}
        {item.images && item.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {item.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img.url }} style={styles.reviewImage} />
            ))}
          </ScrollView>
        )}

        {/* Actions */}
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name={item.isHelpful ? 'thumbs-up' : 'thumbs-up-outline'}
              size={18}
              color={item.isHelpful ? theme.primary : theme.textSecondary}
            />
            <Text style={styles.actionText}>Hữu ích ({item.helpfulCount})</Text>
          </TouchableOpacity>
        </View>

        {/* Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply, idx) => (
              <View key={idx} style={styles.replyItem}>
                <Ionicons name="arrow-undo" size={14} color={theme.textSecondary} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyAuthor}>{reply.userId.name}</Text>
                  <Text style={styles.replyText}>{reply.comment}</Text>
                  <Text style={styles.replyDate}>{getTimeAgo(reply.createdAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${Math.floor(diffHours)} giờ trước`;
    if (diffDays < 7) return `${Math.floor(diffDays)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            {renderRatingDistribution()}

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterChip, sortBy === 'createdAt' && styles.filterChipActive]}
                  onPress={() => setSortBy('createdAt')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      sortBy === 'createdAt' && styles.filterChipTextActive,
                    ]}
                  >
                    Mới nhất
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, sortBy === 'helpfulCount' && styles.filterChipActive]}
                  onPress={() => setSortBy('helpfulCount')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      sortBy === 'helpfulCount' && styles.filterChipTextActive,
                    ]}
                  >
                    Hữu ích nhất
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbox-outline" size={64} color={theme.textSecondary} />
              <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
              <Text style={styles.emptySubText}>Hãy là người đầu tiên đánh giá sản phẩm này!</Text>
            </View>
          )
        }
      />

      {/* Write Review Button */}
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => setShowWriteReviewModal(true)}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.writeButtonText}>Viết đánh giá</Text>
      </TouchableOpacity>

      <WriteReviewModal
        visible={showWriteReviewModal}
        onClose={() => setShowWriteReviewModal(false)}
        productId={id}
        onReviewSubmitted={() => {
          fetchReviews();
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    distributionContainer: {
      backgroundColor: theme.card,
      padding: 16,
      marginBottom: 8,
    },
    overallRating: {
      alignItems: 'center',
      marginBottom: 20,
    },
    ratingNumber: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    starsRow: {
      flexDirection: 'row',
      gap: 4,
      marginBottom: 8,
    },
    totalReviews: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    distributionBars: {
      gap: 8,
    },
    distributionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    distributionLabel: {
      width: 30,
      fontSize: 14,
      color: theme.text,
    },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: theme.surface,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.warning,
      borderRadius: 4,
    },
    progressFillActive: {
      backgroundColor: theme.primary,
    },
    distributionCount: {
      width: 30,
      textAlign: 'right',
      fontSize: 14,
      color: theme.textSecondary,
    },
    filtersContainer: {
      padding: 16,
      backgroundColor: theme.card,
      marginBottom: 8,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surface,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterChipText: {
      fontSize: 14,
      color: theme.text,
    },
    filterChipTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    reviewCard: {
      backgroundColor: theme.card,
      padding: 16,
      marginBottom: 8,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius : 20,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },
    reviewDate: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    comment: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.text,
      marginBottom: 8,
    },
    editedLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginBottom: 8,
    },
    imagesScroll: {
      marginVertical: 12,
    },
    reviewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 8,
    },
    reviewActions: {
      flexDirection: 'row',
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    actionText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    repliesContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 12,
    },
    replyItem: {
      flexDirection: 'row',
      gap: 8,
      paddingLeft: 8,
    },
    replyContent: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 8,
    },
    replyAuthor: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 4,
    },
    replyText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      marginBottom: 4,
    },
    replyDate: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    writeButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      elevation: 5,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      gap: 8,
    },
    writeButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },
  });