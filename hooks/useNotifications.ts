import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import {
  requestNotificationPermissions,
  scheduleDailyMotivation,
  scheduleEveningMotivation,
} from '@/lib/notifications';

export function useNotifications() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const { granted } = await requestNotificationPermissions();

      if (!granted) {
        return;
      }

      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .maybeSingle();

      if (data) {
        if (data.morning_enabled) {
          await scheduleDailyMotivation(data.morning_time_hour, data.morning_time_minute);
        }

        if (data.evening_enabled) {
          await scheduleEveningMotivation(data.evening_time_hour, data.evening_time_minute);
        }
      } else {
        await scheduleDailyMotivation(8, 0);
        await scheduleEveningMotivation(21, 0);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };
}
