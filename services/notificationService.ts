import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class PushNotificationService {
  private expoPushToken: string | null = null;

  async registerForPushNotification(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device for Push Notifications");
        return null;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return null;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "252c3384-61da-42a5-bf68-dd5ff5ed1d1f",
        })
      ).data;

      this.expoPushToken = token;

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }

  async registerTokenWithBackend(authToken: string): Promise<boolean> {
    try {
      if (!this.expoPushToken) {
        const token = await this.registerForPushNotification();
        if (!token) return false;
      }

      const deviceId = await this.getDeviceId();
      const deviceType = Platform.OS === "ios" ? "ios" : "android";

      const response = await fetch(`${BASE_URL}/notifications/register-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          token: this.expoPushToken,
          deviceType,
          deviceId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("pushTokenRegistered", "true");
        console.log("Push token registered with backend");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error registering token with backend:", error);
      return false;
    }
  }

  async unregisterToken(authToken: string): Promise<void> {
    try {
      if (!this.expoPushToken) return;

      await fetch(`${BASE_URL}/notifications/unregister-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          token: this.expoPushToken,
        }),
      });

      await AsyncStorage.removeItem("pushTokenRegistered");
      console.log("Push token unregistered");
    } catch (error) {
      console.error("Error unregistering token:", error);
    }
  }

  private async getDeviceId(): Promise<string> {
    let deviceId = await AsyncStorage.getItem("deviceId");

    if (!deviceId) {
      deviceId = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
  }

  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Handle notification tapped
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Get badge count
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  // Set badge count
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export default new PushNotificationService();
