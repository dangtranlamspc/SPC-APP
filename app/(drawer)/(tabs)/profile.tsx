import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggedIn, checkAuthStatus, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && isLoggedIn === false) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, isLoading, router]);

  const styles = createStyles(theme, isDark);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleEditProfile = () => {
    Alert.alert('Thông báo', 'Chức năng chỉnh sửa hồ sơ đang phát triển');
  };

  const handleChangePassword = () => {
    router.push('/(auth)/change-password');
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(drawer)/(tabs)/home');
          }
        }
      ]
    );
  };

  const handleMenuItemPress = (action: string) => {
    if (!user || !isLoggedIn) {
      Alert.alert('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      router.replace('/(auth)/login');
      return;
    }

    Alert.alert('Thông báo', 'Chức năng đang phát triển');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={28} color={theme.text} />
      </TouchableOpacity>
      {/* Profile Header Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.profileName}>{user?.name || 'Người dùng'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.primary} />
          </View>
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('payment')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="card-outline" size={20} color={theme.primary} />
          </View>
          <Text style={styles.menuText}>Phương thức thanh toán</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('address')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="location-outline" size={20} color={theme.primary} />
          </View>
          <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('history')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="time-outline" size={20} color={theme.primary} />
          </View>
          <Text style={styles.menuText}>Lịch sử đơn hàng</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={20} color={theme.error} />
          </View>
          <Text style={[styles.menuText, { color: theme.error }]}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
          <Text style={styles.infoText}>Phiên bản ứng dụng: 1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark-outline" size={16} color={theme.success} />
          <Text style={styles.infoText}>Tài khoản đã xác thực</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 60,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.textSecondary,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    } : {}),
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    } : {
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    } : {}),
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Menu Section
  menuSection: {
    backgroundColor: theme.card,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    } : {
      borderWidth: 1,
      borderColor: theme.border,
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
    fontWeight: '500',
  },

  // Divider
  divider: {
    height: 8,
    backgroundColor: theme.border,
    marginVertical: 8,
  },

  // Info Section
  infoSection: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 20,
    ...(!isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    } : {
      borderWidth: 1,
      borderColor: theme.border,
    }),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
});