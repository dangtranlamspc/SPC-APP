import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoUpdate, setAutoUpdate] = useState(true);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông báo</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="notifications-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Thông báo push</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={notifications ? '#6200ee' : '#f4f3f4'}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Thông báo email</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Giao diện</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="moon-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Chế độ tối</Text>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={darkMode ? '#6200ee' : '#f4f3f4'}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="language-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Ngôn ngữ</Text>
                    </View>
                    <Text style={styles.settingValue}>Tiếng Việt</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ứng dụng</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="download-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Tự động cập nhật</Text>
                    </View>
                    <Switch
                        value={autoUpdate}
                        onValueChange={setAutoUpdate}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={autoUpdate ? '#6200ee' : '#f4f3f4'}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="trash-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Xóa cache</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="information-circle-outline" size={20} color="#666" />
                        <Text style={styles.settingText}>Về ứng dụng</Text>
                    </View>
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
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    settingValue: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
})