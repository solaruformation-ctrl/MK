import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const MOTIVATIONAL_MESSAGES = [
  "🔥 Lâche rien ! Aujourd'hui est ton jour pour briller !",
  "💪 Ton potentiel est infini, montre-le !",
  "⚡ Chaque effort compte, tu es sur la bonne voie !",
  "🎯 Reste focus, tes objectifs t'attendent !",
  "🌟 Tu es plus fort que tu ne le penses !",
  "🚀 Aujourd'hui, dépassons nos limites ensemble !",
  "💯 Tu mérites de réussir, alors fonce !",
  "🔱 Champion, c'est ton moment !",
  "⭐ Crois en toi, tu vas tout déchirer !",
  "🏆 La discipline d'aujourd'hui forge le champion de demain !",
  "💥 Transforme ta sueur en succès !",
  "🎪 Vas-y, montre de quoi tu es capable !",
  "🌈 Chaque jour est une nouvelle opportunité !",
  "🔆 Ton corps te remerciera plus tard !",
  "⚔️ Warrior mode activé, let's go !",
];

const EVENING_MESSAGES = [
  "🌙 Bien joué aujourd'hui ! Repose-toi bien.",
  "✨ Tu as progressé aujourd'hui, bravo !",
  "💤 Une bonne récupération pour être au top demain !",
  "🌟 Fier de toi, tu as donné le meilleur !",
  "😴 Demain est un nouveau jour pour briller !",
];

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    return { granted: false };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return { granted: finalStatus === 'granted' };
}

export async function scheduleDailyMotivation(hour: number = 8, minute: number = 0) {
  if (Platform.OS === 'web') {
    return null;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const randomMessage =
    MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  const trigger: Notifications.NotificationTriggerInput = {
    hour,
    minute,
    repeats: true,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MK FORM',
      body: randomMessage,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });

  return notificationId;
}

export async function scheduleEveningMotivation(hour: number = 21, minute: number = 0) {
  if (Platform.OS === 'web') {
    return null;
  }

  const randomMessage =
    EVENING_MESSAGES[Math.floor(Math.random() * EVENING_MESSAGES.length)];

  const trigger: Notifications.NotificationTriggerInput = {
    hour,
    minute,
    repeats: true,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MK FORM',
      body: randomMessage,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });

  return notificationId;
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications() {
  if (Platform.OS === 'web') {
    return [];
  }
  return await Notifications.getAllScheduledNotificationsAsync();
}

export function getRandomMotivationalMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
