import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function CustomDrawerContent(props: any) {
  const { isLoggedIn, user, logout } = useAuth();

  const router = useRouter();

  const handleLogin = () => {
    props.navigation.closeDrawer();
    router.push('/(auth)/login');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            props.navigation.navigate('(tabs)', { screen: 'home' });
          }
        }
      ]
    )
  }

  const handleAccountPress = () => {
    if (isLoggedIn === true) {
      props.navigation.navigate('account');
    }
  }

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        {isLoggedIn === true ? (
          <>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </>
        ) : (
          <>
            <View style={styles.avatarGuest}>
              <Ionicons name="person-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.guestName}>Khách</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Navigation Items */}
      <View style={styles.navSection}>
        <DrawerItem
          label="Trang chủ"
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('(tabs)', { screen: 'home' })}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />

        <DrawerItem
          label="Bác sĩ cây trồng"
          icon={({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('bsct')}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />
        <DrawerItem
          label="Thư viện"
          icon={({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('thuviens')}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />

        {/* Account - Show different text based on login status */}
        <DrawerItem
          label={isLoggedIn === true ? "Tài khoản" : "Đăng nhập"}
          icon={({ color, size }) => (
            <Ionicons
              name={isLoggedIn === true ? "person-circle-outline" : "log-in-outline"}
              size={size}
              color={color}
            />
          )}
          onPress={handleAccountPress}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />

        <DrawerItem
          label="Cài đặt"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('settings')}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />

        <DrawerItem
          label="Trợ giúp"
          icon={({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('support')}
          activeTintColor="#2563eb"
          inactiveTintColor="#666"
        />
      </View>

      {/* Logout Button - Only show if logged in */}
      {isLoggedIn === true && (
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      )}
    </DrawerContentScrollView>
  )

}

function DrawerLayoutContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#fff',
            width: 280,
          },
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#2563eb',
          drawerInactiveTintColor: '#666',
        }}
        initialRouteName="(tabs)"
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Main App',
            title: 'TRANG CHỦ',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="account"
          options={{
            drawerItemStyle: { display: 'none' }, // Hidden from drawer menu
            title: 'TÀI KHOẢN',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'CÀI ĐẶT',
          }}
        />
        <Drawer.Screen
          name="support"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'TRỢ GIÚP & HỖ TRỢ',
          }}
        />
        <Drawer.Screen
          name="bsct"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'BÁC SĨ CÂY TRỒNG',
          }}
        />
        <Drawer.Screen
          name="thuviens"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'THƯ VIỆN',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default function DrawerLayout() {
  return (
    <AuthProvider>
      <DrawerLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Drawer Content Styles
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userSection: {
    padding: 20,
    backgroundColor: '#2563eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarGuest: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  guestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#e1bee7',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  loginButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  navSection: {
    flex: 1,
    paddingTop: 16,
  },
  logoutSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
  },
})