import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const { register, login } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Tất cả các trường đều bắt buộc');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);

      await login(formData.email, formData.password);

      Alert.alert('Thành công', 'Đăng ký thành công!', [
        { text: 'OK', onPress: () => router.replace('/(drawer)/(tabs)/home') }
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
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
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-6">
            <Ionicons name="person-add" size={40} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            Tạo tài khoản
          </Text>
          <Text className="text-white/80 text-center">
            Tham gia cùng chúng tôi ngay hôm nay
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          
          <View className="mb-4">
            <View className="flex-row items-center bg-white/10 rounded-2xl border border-white/20">
              <View className="p-4">
                <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                className="flex-1 p-4 text-white text-16 font-medium"
                placeholder="Tên của bạn"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
              />
            </View>
          </View>

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
            onPress={handleRegister}
            disabled={loading}
            style={{ transform: [{ scale: 1 }] }}
          >
            {loading ? (
              <ActivityIndicator color="#6366f1" size="small" />
            ) : (
              <Text className="text-indigo-600 font-bold text-lg">
                Đăng ký
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch Mode */}
          <View className="items-center py-2">
            <Text className="text-white/80 text-center">
              Đã có tài khoản?{' '}
              <Link href="/(auth)/login" className="text-white font-semibold">
                Đăng nhập
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}