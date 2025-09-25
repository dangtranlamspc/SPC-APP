import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

export default function Settings() {
    const { theme, setThemeMode, isDark } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(true);

    const styles = createStyles(theme);

    const handleClearCache = () => {
        Alert.alert(
            'Xóa cache',
            'Bạn có chắc chắn muốn xóa cache? Điều này sẽ làm ứng dụng khởi động lại.',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: () => {
                        // Implement cache clearing logic here
                        Alert.alert('Thông báo', 'Cache đã được xóa thành công!');
                    }
                }
            ]
        );
    };

    const handleAboutApp = () => {
        Alert.alert(
            'Về ứng dụng',
            'Ứng dụng Nông nghiệp thông minh\nPhiên bản: 1.0.0\nPhát triển bởi: Your Company',
            [{ text: 'Đóng' }]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cài đặt</Text>
                <Text style={styles.headerSubtitle}>Tùy chỉnh ứng dụng theo ý bạn</Text>
            </View>

            {/* Notifications Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông báo</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="notifications-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Thông báo push</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: theme.border, true: theme.primary + '80' }}
                        thumbColor={notifications ? theme.primary : theme.textSecondary}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Thông báo email</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Theme Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Giao diện</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Chế độ tối</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                        trackColor={{ false: theme.border, true: theme.primary + '80' }}
                        thumbColor={isDark ? theme.primary : theme.textSecondary}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="language-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Ngôn ngữ</Text>
                    </View>
                    <View style={styles.settingRight}>
                        <Text style={styles.settingValue}>Tiếng Việt</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* App Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ứng dụng</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="download-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Tự động cập nhật</Text>
                    </View>
                    <Switch
                        value={autoUpdate}
                        onValueChange={setAutoUpdate}
                        trackColor={{ false: theme.border, true: theme.primary + '80' }}
                        thumbColor={autoUpdate ? theme.primary : theme.textSecondary}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="trash-outline" size={20} color={theme.warning} />
                        <Text style={[styles.settingText, { color: theme.warning }]}>Xóa cache</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleAboutApp}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.settingText}>Về ứng dụng</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Current Theme Display */}
            <View style={styles.infoSection}>
                <View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <Ionicons name={isDark ? "moon" : "sunny"} size={16} color={theme.primary} />
                        <Text style={styles.infoTitle}>
                            Đang sử dụng: {isDark ? 'Chế độ tối' : 'Chế độ sáng'}
                        </Text>
                    </View>
                    <Text style={styles.infoText}>
                        Chế độ hiển thị có thể được thay đổi bằng cách nhấn vào "Chế độ hiển thị" ở trên
                    </Text>
                </View>
            </View>
        </View>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        padding: 20,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    section: {
        backgroundColor: theme.card,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.surface,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        fontSize: 16,
        color: theme.text,
        marginLeft: 12,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        color: theme.textSecondary,
        marginRight: 8,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    infoCard: {
        backgroundColor: theme.card,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
        marginLeft: 6,
    },
    infoText: {
        fontSize: 12,
        color: theme.textSecondary,
        lineHeight: 16,
    },
});