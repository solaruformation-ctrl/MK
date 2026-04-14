import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Target, TrendingUp, Zap, Footprints, Heart, Moon, Dumbbell, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { supabase, HealthData, HealthGoals, Workout } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function AccueilScreen() {
  const { profile, user } = useAuth();
  const [todayHealth, setTodayHealth] = useState<HealthData | null>(null);
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const [weekWorkouts, setWeekWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = profile?.display_name?.split(' ')[0] || 'Champion';
  console.log('PROFILE:', profile?.display_name, 'USER:', user?.id);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Données santé du jour
      const { data: healthData } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle();

      setTodayHealth(healthData);

      // Objectifs
      const { data: goalsData } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      setGoals(goalsData);

      // Séances de la semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .gte('date', weekAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      setWeekWorkouts(workoutsData || []);
    } catch (e) {
      console.error('Error loading home data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getMotivation = () => {
    const streak = profile?.current_streak || 0;
    if (streak >= 7) return "Tu es en feu ! Continue comme ça 🔥";
    if (streak >= 3) return "Belle série, ne lâche rien ! 💪";
    if (weekWorkouts.length > 0) return "Bien joué cette semaine, on continue ! ⚡";
    return "C'est le moment de commencer ta journée ! 🚀";
  };

  const stepsProgress = todayHealth?.steps && goals?.steps_daily
    ? Math.min((todayHealth.steps / goals.steps_daily) * 100, 100)
    : 0;

  const caloriesProgress = todayHealth?.calories_burned && goals?.calories_daily
    ? Math.min((todayHealth.calories_burned / goals.calories_daily) * 100, 100)
    : 0;

  // Jours de la semaine avec état
  const getWeekDays = () => {
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const today = new Date();
    const currentDay = today.getDay(); // 0=dim, 1=lun...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    return days.map((label, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      const dateStr = date.toISOString().split('T')[0];

      const hasWorkout = weekWorkouts.some(w => w.date === dateStr);
      const isToday = dateStr === today.toISOString().split('T')[0];
      const isPast = date < today && !isToday;

      return { label, hasWorkout, isToday, isPast, date: dateStr };
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[Colors.black, Colors.gray]} style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}, {firstName}</Text>
        <Text style={styles.subtitle}>{getMotivation()}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats rapides */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Flame size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{profile?.current_streak || 0}</Text>
            <Text style={styles.statLabel}>Jours de suite</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{weekWorkouts.length}</Text>
            <Text style={styles.statLabel}>Séances / sem.</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>Niv. {profile?.current_level || 1}</Text>
            <Text style={styles.statLabel}>{profile?.xp_points || 0} XP</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{profile?.weekly_frequency || 3}x</Text>
            <Text style={styles.statLabel}>Objectif / sem.</Text>
          </View>
        </View>

        {/* Santé du jour */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthCard}>
              <Footprints size={20} color={Colors.gold} />
              <Text style={styles.healthValue}>{todayHealth?.steps?.toLocaleString() || '—'}</Text>
              <Text style={styles.healthLabel}>pas</Text>
              {goals?.steps_daily && (
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${stepsProgress}%` }]} />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.healthCard}>
              <Zap size={20} color={Colors.gold} />
              <Text style={styles.healthValue}>{todayHealth?.calories_burned || '—'}</Text>
              <Text style={styles.healthLabel}>kcal brûlées</Text>
              {goals?.calories_daily && (
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${caloriesProgress}%` }]} />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.healthCard}>
              <Heart size={20} color={Colors.gold} />
              <Text style={styles.healthValue}>{todayHealth?.heart_rate_avg || '—'}</Text>
              <Text style={styles.healthLabel}>bpm moy.</Text>
            </View>

            <View style={styles.healthCard}>
              <Moon size={20} color={Colors.gold} />
              <Text style={styles.healthValue}>{todayHealth?.sleep_hours ? `${todayHealth.sleep_hours}h` : '—'}</Text>
              <Text style={styles.healthLabel}>sommeil</Text>
            </View>
          </View>
        </View>

        {/* Semaine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ta semaine</Text>
          <View style={styles.weekContainer}>
            {getWeekDays().map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                  {day.label}
                </Text>
                <View style={[
                  styles.dayCircle,
                  day.hasWorkout && styles.dayCircleCompleted,
                  day.isToday && !day.hasWorkout && styles.dayCircleToday,
                ]}>
                  {day.hasWorkout && (
                    <Dumbbell size={14} color={Colors.black} strokeWidth={2.5} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Coach IA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maïa te conseille</Text>
          <LinearGradient
            colors={[Colors.grayLight, Colors.gray]}
            style={styles.aiCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.aiHeader}>
              <Zap size={28} color={Colors.gold} strokeWidth={2.5} />
              <Text style={styles.aiTitle}>Recommandation du jour</Text>
            </View>
            <Text style={styles.aiText}>
              {profile?.fitness_level === 'debutant'
                ? "Pour bien démarrer, commence par une séance courte de 20 minutes. L'important c'est la régularité, pas l'intensité !"
                : profile?.fitness_level === 'confirme'
                ? "Tu peux augmenter l'intensité cette semaine. Pense à varier tes exercices pour continuer à progresser."
                : "Belle progression ! Essaie d'ajouter une séance de plus cette semaine pour atteindre tes objectifs."}
            </Text>
            <TouchableOpacity style={styles.aiButton}>
              <Text style={styles.aiButtonText}>Parler à Maïa</Text>
              <ChevronRight size={16} color={Colors.gold} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  greeting: { fontSize: 28, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: 15, color: Colors.grayText, marginTop: 6 },
  content: { paddingHorizontal: 16 },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: -10 },
  statCard: {
    flex: 1, minWidth: (width - 52) / 2,
    backgroundColor: Colors.grayLight, borderRadius: 16, padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 12, color: Colors.grayText, marginTop: 4 },

  // Section
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 12 },

  // Health
  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  healthCard: {
    flex: 1, minWidth: (width - 52) / 2,
    backgroundColor: Colors.grayLight, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 4,
  },
  healthValue: { fontSize: 24, fontWeight: '800', color: Colors.white, marginTop: 4 },
  healthLabel: { fontSize: 12, color: Colors.grayText },
  progressBarContainer: { width: '100%', marginTop: 8 },
  progressBarBg: { height: 4, backgroundColor: Colors.gray, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 2 },

  // Week
  weekContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.grayLight, borderRadius: 16, padding: 16,
  },
  dayColumn: { alignItems: 'center', gap: 8 },
  dayLabel: { fontSize: 13, fontWeight: '600', color: Colors.grayText },
  dayLabelToday: { color: Colors.gold },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.gray, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  dayCircleCompleted: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dayCircleToday: { borderColor: Colors.gold },

  // AI Card
  aiCard: { borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  aiTitle: { fontSize: 16, fontWeight: '700', color: Colors.gold },
  aiText: { fontSize: 14, lineHeight: 22, color: Colors.grayText },
  aiButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 16, alignSelf: 'flex-start',
  },
  aiButtonText: { fontSize: 14, fontWeight: '700', color: Colors.gold },

  bottomSpacer: { height: 100 },
});