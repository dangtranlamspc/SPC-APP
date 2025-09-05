import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Support() {
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
        <Ionicons name="help-circle" size={60} color="#6200ee" />
        <Text style={styles.headerTitle}>Trợ giúp & Hỗ trợ</Text>
        <Text style={styles.headerSubtitle}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Liên hệ với chúng tôi</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
          <View style={styles.contactLeft}>
            <Ionicons name="call-outline" size={24} color="#6200ee" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Hotline</Text>
              <Text style={styles.contactDetail}>+84 123 456 789</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
          <View style={styles.contactLeft}>
            <Ionicons name="mail-outline" size={24} color="#6200ee" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactDetail}>support@example.com</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleFAQ}>
          <View style={styles.contactLeft}>
            <Ionicons name="document-text-outline" size={24} color="#6200ee" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>FAQ</Text>
              <Text style={styles.contactDetail}>Câu hỏi thường gặp</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#999" />
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

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionTitle : {

    },
    header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingTop: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});