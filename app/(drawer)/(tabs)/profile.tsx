import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggedIn, checkAuthStatus, isLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  useEffect(() => {
    if (!isLoading && isLoggedIn === false) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return null; // or loading spinner
  }

  const handleEditProfile = () => {
    Alert.alert('Thông báo', 'Chức năng chỉnh sửa hồ sơ đang phát triển');
  };

  const handleChangePassword = () => {
    router.push('/(auth)/change-password')
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

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Chức năng chỉnh sửa hồ sơ đang phát triển')}>
          <Ionicons name="card-outline" size={20} color="#666" />
          <Text style={styles.menuText}>Phương thức thanh toán</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Chức năng chỉnh sửa hồ sơ đang phát triển')}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Chức năng chỉnh sửa hồ sơ đang phát triển')}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.menuText}>Lịch sử đơn hàng</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          <Text style={[styles.menuText, { color: '#ff4444' }]}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  profileSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
})
