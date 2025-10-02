import { Colors, useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Support() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCall = () => {
    Linking.openURL('tel:+84123456789');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleFAQ = () => {
    Linking.openURL('https://example.com/faq');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="help-circle" size={60} color={theme.primary} />
        <Text style={styles.headerTitle}>Trợ giúp & Hỗ trợ</Text>
        <Text style={styles.headerSubtitle}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Liên hệ với chúng tôi</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
          <View style={styles.contactLeft}>
            <Ionicons name="call-outline" size={24} color={theme.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Hotline</Text>
              <Text style={styles.contactDetail}>+84 123 456 789</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
          <View style={styles.contactLeft}>
            <Ionicons name="mail-outline" size={24} color={theme.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactDetail}>support@example.com</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleFAQ}>
          <View style={styles.contactLeft}>
            <Ionicons name="document-text-outline" size={24} color={theme.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>FAQ</Text>
              <Text style={styles.contactDetail}>Câu hỏi thường gặp</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
        <Text style={styles.infoText}>Phiên bản: 1.0.0</Text>
        <Text style={styles.infoText}>Cập nhật lần cuối: 03/09/2025</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: theme.card,
    marginTop: 16,
    paddingTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.card,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactInfo: {
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  contactDetail: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: theme.card,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
});