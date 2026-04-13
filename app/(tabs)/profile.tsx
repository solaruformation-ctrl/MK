import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  User,
  Target,
  Award,
  Settings,
  Bell,
  Share2,
  ChevronRight,
  Trophy,
  Flame,
  TrendingUp,
  Activity,
  Footprints,
  Heart,
  Moon,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const achievements = [
  { id: 1, title: 'Série de 7 jours', icon: Flame, color: Colors.error },
  { id: 2, title: '42 séances', icon: Trophy, color: Colors.gold },
  { id: 3, title: 'Progression +12%', icon: TrendingUp, color: Colors.success },
];

const menuItems = [
  { id: 1, title: 'Mes objectifs', icon: Target, screen: 'goals' },
  { id: 2, title: 'Mes récompenses', icon: Award, screen: 'rewards' },
  { id: 3, title: 'Notifications', icon: Bell, screen: 'notifications' },
  { id: 4, title: 'Partager l\'app', icon: Share2, screen: 'share' },
  { id: 5, title: 'Paramètres', icon: Settings, screen: 'settings' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [todayData, setTodayData] = useState<any>(null);
  const [weekAvg, setWeekAvg] = useState<any>({});
  const [goals, setGoals] = useState<any>(null);

  useEffect(() => {
    loadHealthData();
    loadGoals();
  }, []);

  const loadHealthData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: todayStats } = await supabase
        .from('health_data')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      setTodayData(todayStats);

      const { data: weekData } = await supabase
        .from('health_data')
        .select('steps, calories, active_minutes, sleep_hours')
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .lte('date', today);

      if (weekData && weekData.length > 0) {
        const avg = {
          steps: Math.round(weekData.reduce((sum, d) => sum + (d.steps || 0), 0) / weekData.length),
          calories: Math.round(weekData.reduce((sum, d) => sum + (d.calories || 0), 0) / weekData.length),
          active_minutes: Math.round(weekData.reduce((sum, d) => sum + (d.active_minutes || 0), 0) / weekData.length),
          sleep_hours: (weekData.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / weekData.filter(d => d.sleep_hours).length).toFixed(1),
        };
        setWeekAvg(avg);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const loadGoals = async () => {
    try {
      const { data } = await supabase
        .from('health_goals')
        .select('*')
        .maybeSingle();

      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleMenuPress = (screen: string) => {
    if (screen === 'notifications') {
      router.push('/notifications');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[Colors.gold, Colors.goldDark]}
              style={styles.avatarGradient}>
              <User size={40} color={Colors.black} strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <Text style={styles.name}>Alex Martin</Text>
          <View style={styles.levelBadge}>
            <Trophy size={16} color={Colors.gold} strokeWidth={2.5} />
            <Text style={styles.levelText}>Champion</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statLabel}>kg</Text>
            <Text style={styles.statSubLabel}>Poids actuel</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>175</Text>
            <Text style={styles.statLabel}>cm</Text>
            <Text style={styles.statSubLabel}>Taille</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>22.2</Text>
            <Text style={styles.statLabel}>IMC</Text>
            <Text style={styles.statSubLabel}>Normal</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité aujourd'hui</Text>
          <View style={styles.healthCardsContainer}>
            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: Colors.success + '20' }]}>
                <Footprints size={24} color={Colors.success} strokeWidth={2.5} />
              </View>
              <Text style={styles.healthValue}>{todayData?.steps?.toLocaleString() || '0'}</Text>
              <Text style={styles.healthLabel}>Pas</Text>
              {goals && (
                <Text style={styles.healthGoal}>
                  Objectif: {goals.steps_goal?.toLocaleString()}
                </Text>
              )}
            </View>

            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: Colors.error + '20' }]}>
                <Flame size={24} color={Colors.error} strokeWidth={2.5} />
              </View>
              <Text style={styles.healthValue}>{todayData?.calories?.toLocaleString() || '0'}</Text>
              <Text style={styles.healthLabel}>Calories</Text>
              {goals && (
                <Text style={styles.healthGoal}>
                  Objectif: {goals.calories_goal?.toLocaleString()}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.healthCardsContainer}>
            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: Colors.gold + '20' }]}>
                <Activity size={24} color={Colors.gold} strokeWidth={2.5} />
              </View>
              <Text style={styles.healthValue}>{todayData?.active_minutes || '0'}</Text>
              <Text style={styles.healthLabel}>Minutes actives</Text>
              {goals && (
                <Text style={styles.healthGoal}>
                  Objectif: {goals.active_minutes_goal}
                </Text>
              )}
            </View>

            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: '#6B7FD7' + '20' }]}>
                <Moon size={24} color="#6B7FD7" strokeWidth={2.5} />
              </View>
              <Text style={styles.healthValue}>{todayData?.sleep_hours || '-'}</Text>
              <Text style={styles.healthLabel}>Heures sommeil</Text>
              {goals && (
                <Text style={styles.healthGoal}>
                  Objectif: {goals.sleep_goal}h
                </Text>
              )}
            </View>
          </View>

          {todayData?.heart_rate_avg && (
            <View style={styles.heartRateCard}>
              <View style={styles.heartRateHeader}>
                <Heart size={24} color={Colors.error} strokeWidth={2.5} />
                <Text style={styles.heartRateTitle}>Fréquence cardiaque</Text>
              </View>
              <View style={styles.heartRateValues}>
                <View style={styles.heartRateItem}>
                  <Text style={styles.heartRateLabel}>Moyenne</Text>
                  <Text style={styles.heartRateValue}>{todayData.heart_rate_avg} bpm</Text>
                </View>
                {todayData.heart_rate_max && (
                  <View style={styles.heartRateItem}>
                    <Text style={styles.heartRateLabel}>Max</Text>
                    <Text style={styles.heartRateValue}>{todayData.heart_rate_max} bpm</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {todayData?.source && (
            <Text style={styles.dataSource}>
              Données depuis: {todayData.source.replace('_', ' ')}
            </Text>
          )}
        </View>

        {Object.keys(weekAvg).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moyenne de la semaine</Text>
            <View style={styles.weekStatsCard}>
              <View style={styles.weekStatRow}>
                <Text style={styles.weekStatLabel}>Pas quotidiens</Text>
                <Text style={styles.weekStatValue}>{weekAvg.steps?.toLocaleString()}</Text>
              </View>
              <View style={styles.weekStatRow}>
                <Text style={styles.weekStatLabel}>Calories brûlées</Text>
                <Text style={styles.weekStatValue}>{weekAvg.calories?.toLocaleString()} kcal</Text>
              </View>
              <View style={styles.weekStatRow}>
                <Text style={styles.weekStatLabel}>Minutes actives</Text>
                <Text style={styles.weekStatValue}>{weekAvg.active_minutes} min</Text>
              </View>
              <View style={styles.weekStatRow}>
                <Text style={styles.weekStatLabel}>Sommeil moyen</Text>
                <Text style={styles.weekStatValue}>{weekAvg.sleep_hours || 0}h</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objectif actuel</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIcon}>
                <Target size={24} color={Colors.gold} strokeWidth={2.5} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Perte de poids</Text>
                <Text style={styles.goalSubtitle}>Objectif: 65 kg</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                style={[styles.progressFill, { width: '75%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressText}>75% accompli • 3 kg restants</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réalisations récentes</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.color + '20' },
                    ]}>
                    <Icon size={24} color={achievement.color} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => handleMenuPress(item.screen)}
                  style={[
                    styles.menuItem,
                    index === menuItems.length - 1 && styles.menuItemLast,
                  ]}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Icon size={20} color={Colors.gold} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.grayText} strokeWidth={2.5} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.goldLight,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gold,
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubLabel: {
    fontSize: 11,
    color: Colors.grayText,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gold + '30',
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 15,
  },
  goalCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuList: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '20',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  logoutButton: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.error + '50',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.error,
  },
  version: {
    fontSize: 13,
    color: Colors.grayText,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  healthCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  healthCard: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  healthIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
    textAlign: 'center',
  },
  healthGoal: {
    fontSize: 10,
    color: Colors.gold,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  heartRateCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  heartRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  heartRateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  heartRateValues: {
    flexDirection: 'row',
    gap: 20,
  },
  heartRateItem: {
    flex: 1,
  },
  heartRateLabel: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
    marginBottom: 4,
  },
  heartRateValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.error,
  },
  dataSource: {
    fontSize: 11,
    color: Colors.grayText,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    textTransform: 'capitalize',
  },
  weekStatsCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  weekStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '20',
  },
  weekStatLabel: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
  },
  weekStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.gold,
  },
});
