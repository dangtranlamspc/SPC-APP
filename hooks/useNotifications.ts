import { useAuth } from "@/contexts/AuthContext";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import pushNotificationService from "../services/notificationService";

export function useNotifications() {
  const { user, token } = useAuth();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Register for push notifications when user logs in
    if (user && token) {
      registerPushNotifications();
    }

    // Setup notification listeners
    notificationListener.current =
      pushNotificationService.addNotificationReceivedListener(
        (notification) => {
          console.log("Notification received:", notification);
          setNotification(notification);
        }
      );

    responseListener.current =
      pushNotificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log("Notification tapped:", response);
          handleNotificationTap(response);
        }
      );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user, token]);

  const registerPushNotifications = async () => {
    if (!token) return;

    const success =
      await pushNotificationService.registerTokenWithBackend(token);

    if (success) {
      console.log("Push notifications enabled");
    } else {
      console.log("Failed to enable push notifications");
    }
  };

  const handleNotificationTap = (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data;

    // Navigate based on notification type
    if (data.screen && data.params) {
      router.push({
        pathname: data.screen as any,
        params: data.params as any,
      });
    } else if (data.productId) {
      router.push(`/product/${data.productId}`);
    } else if (data.type === "review") {
      router.push(`/reviews/${data.productId}`);
    }
  };

  return {
    notification,
    registerPushNotifications,
  };
}
