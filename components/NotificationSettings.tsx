import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { Bell, Clock, Moon, Sun } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import {
  requestNotificationPermissions,
  scheduleDailyMotivation,
  scheduleEveningMotivation,
  cancelAllNotifications,
} from '@/lib/notifications';

interface NotificationPreferences {
  morning_enabled: boolean;
  morning_time_hour: number;
  morning_time_minute: number;
  evening_enabled: boolean;
  evening_time_hour: number;
  evening_time_minute: number;
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    morning_enabled: true,
    morning_time_hour: 8,
    morning_time_minute: 0,
    evening_enabled: true,
    evening_time_hour: 21,
    evening_time_minute: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadPreferences();
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { granted } = await requestNotificationPermissions();
    setHasPermission(granted);
  };

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .maybeSingle();

      if (data) {
        setPreferences({
          morning_enabled: data.morning_enabled,
          morning_time_hour: data.morning_time_hour,
          morning_time_minute: data.morning_time_minute,
          evening_enabled: data.evening_enabled,
          evening_time_hour: data.evening_time_hour,
          evening_time_minute: data.evening_time_minute,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const { data: existing } = await supabase
        .from('notification_preferences')
        .select('id')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('notification_preferences')
          .update({
            ...newPreferences,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('notification_preferences').insert({
          ...newPreferences,
        });
      }

      await updateScheduledNotifications(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updateScheduledNotifications = async (prefs: NotificationPreferences) => {
    if (!hasPermission || Platform.OS === 'web') {
      return;
    }

    await cancelAllNotifications();

    if (prefs.morning_enabled) {
      await scheduleDailyMotivation(prefs.morning_time_hour, prefs.morning_time_minute);
    }

    if (prefs.evening_enabled) {
      await scheduleEveningMotivation(prefs.evening_time_hour, prefs.evening_time_minute);
    }
  };

  const toggleMorning = async (value: boolean) => {
    if (value && !hasPermission) {
      const { granted } = await requestNotificationPermissions();
      if (!granted) {
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Permission requise',
            'Activez les notifications dans les paramètres de votre appareil.'
          );
        }
        return;
      }
      setHasPermission(true);
    }

    const newPreferences = { ...preferences, morning_enabled: value };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  const toggleEvening = async (value: boolean) => {
    if (value && !hasPermission) {
      const { granted } = await requestNotificationPermissions();
      if (!granted) {
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Permission requise',
            'Activez les notifications dans les paramètres de votre appareil.'
          );
        }
        return;
      }
      setHasPermission(true);
    }

    const newPreferences = { ...preferences, evening_enabled: value };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  const adjustTime = async (
    type: 'morning' | 'evening',
    field: 'hour' | 'minute',
    delta: number
  ) => {
    const hourKey = type === 'morning' ? 'morning_time_hour' : 'evening_time_hour';
    const minuteKey = type === 'morning' ? 'morning_time_minute' : 'evening_time_minute';

    let newPreferences = { ...preferences };

    if (field === 'hour') {
      let newHour = preferences[hourKey] + delta;
      if (newHour < 0) newHour = 23;
      if (newHour > 23) newHour = 0;
      newPreferences[hourKey] = newHour;
    } else {
      let newMinute = preferences[minuteKey] + delta;
      if (newMinute < 0) newMinute = 45;
      if (newMinute > 59) newMinute = 0;
      newPreferences[minuteKey] = newMinute;
    }

    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webWarning}>
          <Bell size={48} color={Colors.gold} />
          <Text style={styles.webWarningTitle}>Notifications non disponibles</Text>
          <Text style={styles.webWarningText}>
            Les notifications push ne sont pas disponibles sur le web.
            Utilisez l'application mobile pour activer les notifications motivationnelles.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Bell size={32} color={Colors.gold} />
        <Text style={styles.title}>Notifications Motivationnelles</Text>
        <Text style={styles.subtitle}>
          Reçois des messages pour te motiver chaque jour
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sun size={24} color={Colors.gold} />
          <Text style={styles.sectionTitle}>Motivation du Matin</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Activer</Text>
          <Switch
            value={preferences.morning_enabled}
            onValueChange={toggleMorning}
            trackColor={{ false: Colors.darkGray, true: Colors.gold }}
            thumbColor={Colors.white}
          />
        </View>

        {preferences.morning_enabled && (
          <View style={styles.timePickerContainer}>
            <Clock size={20} color={Colors.gold} />
            <Text style={styles.timeLabel}>Heure:</Text>
            <View style={styles.timePicker}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('morning', 'hour', -1)}>
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>
                {preferences.morning_time_hour.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('morning', 'hour', 1)}>
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timePicker}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('morning', 'minute', -15)}>
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>
                {preferences.morning_time_minute.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('morning', 'minute', 15)}>
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Moon size={24} color={Colors.gold} />
          <Text style={styles.sectionTitle}>Motivation du Soir</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Activer</Text>
          <Switch
            value={preferences.evening_enabled}
            onValueChange={toggleEvening}
            trackColor={{ false: Colors.darkGray, true: Colors.gold }}
            thumbColor={Colors.white}
          />
        </View>

        {preferences.evening_enabled && (
          <View style={styles.timePickerContainer}>
            <Clock size={20} color={Colors.gold} />
            <Text style={styles.timeLabel}>Heure:</Text>
            <View style={styles.timePicker}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('evening', 'hour', -1)}>
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>
                {preferences.evening_time_hour.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('evening', 'hour', 1)}>
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timePicker}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('evening', 'minute', -15)}>
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>
                {preferences.evening_time_minute.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustTime('evening', 'minute', 15)}>
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Les notifications te motiveront quotidiennement à atteindre tes objectifs
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  webWarning: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: Colors.darkGray,
    borderRadius: 16,
  },
  webWarningTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  webWarningText: {
    color: Colors.lightGray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    color: Colors.lightGray,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.darkGray,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    color: Colors.white,
    fontSize: 16,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.black,
    borderRadius: 12,
  },
  timeLabel: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.gold,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: '700',
  },
  timeValue: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  timeSeparator: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 4,
  },
  infoBox: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.darkGray,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
  },
  infoText: {
    color: Colors.lightGray,
    fontSize: 14,
    lineHeight: 20,
  },
});
