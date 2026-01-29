import * as Notification from 'expo-notifications';
import * as Device from "expo-device";
import { Alert, Platform } from 'react-native';


Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
})


export const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notification.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notification.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            Alert.alert("Push Notifications", "Permission for notifications denied!");
            return;
        }

        token = (await Notification.getExpoPushTokenAsync()).data;
    }
    else {
        Alert.alert("Push Notifications", "Must use physical device for Push Notifications");
    }
    if (Platform.OS === "android") {
        await Notification.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notification.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: "default",
        });
    }


    return token;
}