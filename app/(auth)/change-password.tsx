import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Di chuyển PasswordInput ra ngoài component chính
const PasswordInput = ({
  field,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  onToggleVisibility,
  error
}: {
  field: keyof ChangePasswordFormData;
  label: string;
  placeholder: string;
  value: string; 
  onChangeText: (value: string) => void;
  secureTextEntry: boolean;
  onToggleVisibility: () => void;
  error?: string;
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.textInput,
            { 
              backgroundColor: theme.card,
              borderColor: error ? theme.error : theme.border,
              color: theme.text
            }
          ]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={onToggleVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={secureTextEntry ? 'eye' : 'eye-off'}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      )}
    </View>
  );
};

const ChangePasswordScreen = () => {
  const { changePassword, logout } = useAuth();
  const { theme, isDark } = useTheme();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ChangePasswordFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordFormData> = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 kí tự'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await changePassword(formData.oldPassword, formData.newPassword);

      if (result.success) {
        Alert.alert(
          'Thành công! 🎉',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                router.back();
              },
            },
          ]
        );
      } else {
        if (result.message.includes('hết hạn')) {
          Alert.alert(
            'Phiên đăng nhập hết hạn',
            'Vui lòng đăng nhập lại để tiếp tục.',
            [
              {
                text: 'Đăng nhập lại',
                onPress: () => {
                  logout();
                  router.replace('/login');
                },
              },
            ]
          );
        } else {
          Alert.alert('Lỗi ❌', result.message);
        }
      }
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert(
        'Lỗi ❌',
        'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useCallback để tránh re-create function
  const handleInputChange = useCallback((field: keyof ChangePasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback((field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[
          styles.header,
          { 
            backgroundColor: theme.surface,
            borderBottomColor: theme.border
          }
        ]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Đổi mật khẩu
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.form}>
            {/* Form Fields */}
            <PasswordInput
              field="oldPassword"
              label="Mật khẩu cũ"
              placeholder="Nhập mật khẩu hiện tại"
              value={formData.oldPassword}
              onChangeText={(value) => handleInputChange('oldPassword', value)}
              secureTextEntry={!showPasswords.oldPassword}
              onToggleVisibility={() => togglePasswordVisibility('oldPassword')}
              error={errors.oldPassword}
            />

            <PasswordInput
              field="newPassword"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              secureTextEntry={!showPasswords.newPassword}
              onToggleVisibility={() => togglePasswordVisibility('newPassword')}
              error={errors.newPassword}
            />

            <PasswordInput
              field="confirmPassword"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showPasswords.confirmPassword}
              onToggleVisibility={() => togglePasswordVisibility('confirmPassword')}
              error={errors.confirmPassword}
            />

            {/* Security Tips */}
            <View style={[
              styles.securityTips,
              { 
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE'
              }
            ]}>
              <View style={styles.securityTipsHeader}>
                <Ionicons name="shield-checkmark" size={22} color={theme.primary} />
                <Text style={[
                  styles.securityTipsTitle,
                  { color: isDark ? theme.primary : '#1E40AF' }
                ]}>
                  Bảo mật mật khẩu
                </Text>
              </View>
              <View>
                <Text style={[
                  styles.tipText,
                  { color: isDark ? theme.textSecondary : '#1D4ED8' }
                ]}>
                  • Sử dụng ít nhất 8 ký tự
                </Text>
                <Text style={[
                  styles.tipText,
                  { color: isDark ? theme.textSecondary : '#1D4ED8' }
                ]}>
                  • Kết hợp chữ hoa, chữ thường và số
                </Text>
                <Text style={[
                  styles.tipText,
                  { color: isDark ? theme.textSecondary : '#1D4ED8' }
                ]}>
                  • Thêm ký tự đặc biệt (@, #, $, v.v.)
                </Text>
                <Text style={[
                  styles.tipText,
                  { color: isDark ? theme.textSecondary : '#1D4ED8' }
                ]}>
                  • Không sử dụng thông tin cá nhân
                </Text>
                <Text style={[
                  styles.tipText,
                  { color: isDark ? theme.textSecondary : '#1D4ED8' }
                ]}>
                  • Không chia sẻ mật khẩu với ai
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                style={[
                  styles.submitButton,
                  { 
                    backgroundColor: loading 
                      ? (isDark ? '#4B5563' : '#9CA3AF')
                      : theme.primary
                  }
                ]}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.submitButtonText}>
                      Đang xử lý...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    Đổi mật khẩu
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  styles.cancelButton,
                  { 
                    borderColor: theme.border,
                    backgroundColor: theme.card
                  }
                ]}
                disabled={loading}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                  Hủy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  securityTips: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  securityTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTipsTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 2,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChangePasswordScreen;