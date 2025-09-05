import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from "expo-local-authentication";
import { Link, useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check token đã lưu chưa
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setHasToken(true);
      }
    })();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBiometricLogin = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        return Alert.alert("Thông báo", "Thiết bị chưa cài đặt Face ID / Touch ID.");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Đăng nhập bằng Face ID / Touch ID",
        fallbackLabel: "Nhập mật khẩu",
      });

      if (result.success) {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          Alert.alert("✅ Thành công", "Đăng nhập tự động thành công!");
          router.push('/(drawer)/(tabs)/home');
        } else {
          Alert.alert("⚠️ Lỗi", "Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
      } else {
        Alert.alert("❌ Thất bại", "Xác thực không thành công.");
      }
    } catch (err) {
      console.error(err);
    }
  };


  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Email và mật khẩu không được để trống');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.replace('/(drawer)/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-indigo-600"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">

          <View className="mb-4">
            <View className="flex-row items-center bg-white/10 rounded-2xl border border-white/20">
              <View className="p-4">
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                className="flex-1 p-4 text-white text-16 font-medium"
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center bg-white/10 rounded-2xl border border-white/20">
              <View className="p-4">
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                className="flex-1 p-4 text-white text-16 font-medium"
                placeholder="Mật khẩu"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                className="p-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-white rounded-2xl p-4 items-center mb-4 ${loading ? 'opacity-70' : 'active:scale-95'}`}
            onPress={handleLogin}
            disabled={loading}
            style={{ transform: [{ scale: 1 }] }}
          >
            {loading ? (
              <ActivityIndicator color="#6366f1" size="small" />
            ) : (
              <Text className="text-indigo-600 font-bold text-lg">
                Đăng nhập
              </Text>
            )}
          </TouchableOpacity>

          {hasToken && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              className="flex-row justify-center items-center bg-indigo-500 rounded-2xl p-4 mb-4"
            >
              {Platform.OS === "ios" ? (
                <MaterialCommunityIcons name="face-recognition" size={22} color="#fff" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="finger-print" size={22} color="#fff" style={{ marginRight: 8 }} />
              )}
              <Text className="text-white font-semibold">
                Đăng nhập bằng {Platform.OS === "ios" ? "Face ID" : "Vân tay"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Switch Mode */}
          <View className="items-center py-2">
            <Text className="text-white/80 text-center">
              Chưa có tài khoản?{' '}
              <Link href="/(auth)/register" className="text-white font-semibold">
                Đăng ký ngay
              </Link>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-white/60 text-center mt-8 text-sm">
          Bằng cách tiếp tục, bạn đồng ý với{'\n'}
          <Text className="text-white/80 font-medium">Điều khoản dịch vụ</Text> và{' '}
          <Text className="text-white/80 font-medium">Chính sách bảo mật</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}