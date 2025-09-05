// app/bsct/index.tsx
import { useBSCT } from "@/contexts/BsctContext";
import { apiCall } from "@/utils/apiCall";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoryBSCT {
  _id: string;
  name: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Search Box Styles
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 45,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0,
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: '32%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },

  // Filters Row
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterContainer: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  // Custom Dropdown Styles
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 3,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 8,
  },

  // Modal Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 10,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
  },
  selectedOptionText: {
    color: '#2563eb',
    fontWeight: '600',
  },

  // List Item Styles
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
  itemImage: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  itemSummary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 16,
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

  // Loading & Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#6b7280',
    fontSize: 16,
  },

  // Missing iOS Modal Styles
  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#c7c7cc',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007aff',
  },
});

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
];

export default function BSCTScreen() {
  const { bscts, loading, error, fetchBSCTs } = useBSCT();
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<CategoryBSCT[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // fetch categories khi vào screen
  useEffect(() => {
    const fetchCategories = async () => {
      const { success, data } = await apiCall<CategoryBSCT[]>({
        endpoint: "/categoriesBSCT",
        method: "GET",
        requireAuth: false,
      });
      if (success) setCategories(data);
    };
    fetchCategories();
  }, []);

  // filter local theo searchText
  const filteredBSCTs = bscts
    .filter((b) =>
      b.title.toLowerCase().includes(searchText.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  // refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchBSCTs(selectedCategory || undefined);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategory, fetchBSCTs]);

  // Get display text for selected category
  const getSelectedCategoryText = () => {
    if (!selectedCategory) return "Tất cả danh mục";
    const category = categories.find(cat => cat._id === selectedCategory);
    return category?.name || "Tất cả danh mục";
  };

  // Get display text for selected sort order
  const getSelectedSortText = () => {
    const sortOption = sortOptions.find(option => option.value === sortOrder);
    return sortOption?.label || "Mới nhất";
  };

  const handleBlogPress = useCallback((blogId: string) => {
    router.push(`/bsct/${blogId}`);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài viết..."
          placeholderTextColor="#9ca3af"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>


      <View style={styles.filtersRow}>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Danh mục</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {getSelectedCategoryText()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#6b7280"
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sắp xếp</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {getSelectedSortText()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#6b7280"
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <FlatList
                data={[{ _id: '', name: 'Tất cả danh mục' }, ...categories]}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      index === categories.length && styles.lastOptionItem
                    ]}
                    onPress={async () => {
                      setSelectedCategory(item._id);
                      setShowCategoryModal(false);
                      // Đợi fetchBSCTs hoàn thành
                      await fetchBSCTs(item._id || undefined);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedCategory === item._id && styles.selectedOptionText
                    ]}>
                      {item.name}
                    </Text>
                    {selectedCategory === item._id && (
                      <Ionicons name="checkmark" size={20} color="#007aff" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* iOS-style Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sắp xếp theo</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <FlatList
                data={sortOptions}
                keyExtractor={(item) => item.value}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      index === sortOptions.length - 1 && styles.lastOptionItem
                    ]}
                    onPress={() => {
                      setSortOrder(item.value as "newest" | "oldest");
                      setShowSortModal(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      sortOrder === item.value && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                    {sortOrder === item.value && (
                      <Ionicons name="checkmark" size={20} color="#007aff" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Loading indicator lúc đầu */}
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Đang tải...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {/* Enhanced List */}
      <FlatList
        data={filteredBSCTs}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleBlogPress(item._id)}
            activeOpacity={0.7}
          >
            {item.images && (
              <Image
                source={{ uri: item.images }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}

            {/* Title */}
            <Text style={styles.itemTitle}>
              {item.title}
            </Text>

            {/* Category */}
            <Text style={styles.itemCategory}>
              {item.categoryBSCT?.name || "Không có danh mục"}
            </Text>
            <Text style={styles.itemSummary}>
              {item.summary}
            </Text>
          </TouchableOpacity>
        )}
      // ListEmptyComponent={
      //   !loading && (
      //     <Text style={styles.emptyText}>
      //       Không có blog nào được tìm thấy
      //     </Text>
      //   )
      // }
      />
    </View>
  );
}