import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Target, TrendingUp, Zap, Footprints, Activity, Heart, Clock, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function AccueilScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.greeting}>Bonjour, Champion</Text>
        <Text style={styles.subtitle}>Prêt à dépasser vos limites ?</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Flame size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Jours de suite</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Objectifs</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={Colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommandations IA</Text>

          <LinearGradient
            colors={[Colors.grayLight, Colors.gray]}
            style={styles.aiCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.aiHeader}>
              <Zap size={28} color={Colors.gold} strokeWidth={2.5} />
              <Text style={styles.aiTitle}>Maïa vous conseille</Text>
            </View>
            <Text style={styles.aiText}>
              Excellent travail cette semaine ! Pour maximiser vos résultats, je vous recommande une séance de HIIT aujourd'hui suivie d'une récupération active demain.
            </Text>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>Basé sur votre activité</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre semaine</Text>
          <View style={styles.weekProgress}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View style={[
                  styles.dayCircle,
                  index < 5 && styles.dayCircleActive
                ]}>
                  {index < 5 && <View style={styles.dayDot} />}
                </View>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performances du jour</Text>
          <View style={styles.performanceGrid}>
            <LinearGradient
              colors={[Colors.success + '30', Colors.success + '10']}
              style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Footprints size={24} color={Colors.success} strokeWidth={2.5} />
              </View>
              <Text style={styles.performanceValue}>8,247</Text>
              <Text style={styles.performanceLabel}>Pas</Text>
              <View style={styles.performanceProgress}>
                <View style={[styles.performanceBar, { width: '82%', backgroundColor: Colors.success }]} />
              </View>
              <Text style={styles.performanceGoal}>Objectif: 10,000</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.error + '30', Colors.error + '10']}
              style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Activity size={24} color={Colors.error} strokeWidth={2.5} />
              </View>
              <Text style={styles.performanceValue}>45</Text>
              <Text style={styles.performanceLabel}>Minutes actives</Text>
              <View style={styles.performanceProgress}>
                <View style={[styles.performanceBar, { width: '75%', backgroundColor: Colors.error }]} />
              </View>
              <Text style={styles.performanceGoal}>Objectif: 60 min</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.warning + '30', Colors.warning + '10']}
              style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Flame size={24} color={Colors.warning} strokeWidth={2.5} />
              </View>
              <Text style={styles.performanceValue}>1,850</Text>
              <Text style={styles.performanceLabel}>Calories brûlées</Text>
              <View style={styles.performanceProgress}>
                <View style={[styles.performanceBar, { width: '93%', backgroundColor: Colors.warning }]} />
              </View>
              <Text style={styles.performanceGoal}>Objectif: 2,000</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.gold + '30', Colors.gold + '10']}
              style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Heart size={24} color={Colors.gold} strokeWidth={2.5} />
              </View>
              <Text style={styles.performanceValue}>68</Text>
              <Text style={styles.performanceLabel}>BPM repos</Text>
              <View style={styles.performanceProgress}>
                <View style={[styles.performanceBar, { width: '100%', backgroundColor: Colors.gold }]} />
              </View>
              <Text style={styles.performanceGoal}>Excellent</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dernier circuit</Text>
          <LinearGradient
            colors={[Colors.grayLight, Colors.gray]}
            style={styles.circuitCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.circuitMap}
              resizeMode="cover"
            />
            <View style={styles.circuitOverlay}>
              <View style={styles.circuitHeader}>
                <View>
                  <Text style={styles.circuitTitle}>Course du matin</Text>
                  <View style={styles.circuitLocation}>
                    <MapPin size={14} color={Colors.grayText} strokeWidth={2.5} />
                    <Text style={styles.circuitLocationText}>Parc Central</Text>
                  </View>
                </View>
                <View style={styles.circuitTimeBadge}>
                  <Clock size={14} color={Colors.white} strokeWidth={2.5} />
                  <Text style={styles.circuitTime}>Aujourd'hui, 7:30</Text>
                </View>
              </View>
            </View>
            <View style={styles.circuitStats}>
              <View style={styles.circuitStat}>
                <Text style={styles.circuitStatValue}>5.2</Text>
                <Text style={styles.circuitStatLabel}>km</Text>
              </View>
              <View style={styles.circuitDivider} />
              <View style={styles.circuitStat}>
                <Text style={styles.circuitStatValue}>28:34</Text>
                <Text style={styles.circuitStatLabel}>Durée</Text>
              </View>
              <View style={styles.circuitDivider} />
              <View style={styles.circuitStat}>
                <Text style={styles.circuitStatValue}>5:30</Text>
                <Text style={styles.circuitStatLabel}>Allure /km</Text>
              </View>
              <View style={styles.circuitDivider} />
              <View style={styles.circuitStat}>
                <Text style={styles.circuitStatValue}>312</Text>
                <Text style={styles.circuitStatLabel}>kcal</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dernier entraînement</Text>
          <View style={styles.lastWorkoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutTitle}>HIIT Intense</Text>
              <Text style={styles.workoutDate}>Hier, 18:30</Text>
            </View>
            <View style={styles.workoutStats}>
              <View style={styles.workoutStat}>
                <Text style={styles.workoutStatValue}>35</Text>
                <Text style={styles.workoutStatLabel}>min</Text>
              </View>
              <View style={styles.workoutStat}>
                <Text style={styles.workoutStatValue}>420</Text>
                <Text style={styles.workoutStatLabel}>kcal</Text>
              </View>
              <View style={styles.workoutStat}>
                <Text style={styles.workoutStatValue}>162</Text>
                <Text style={styles.workoutStatLabel}>BPM moy</Text>
              </View>
            </View>
          </View>
        </View>
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
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gold,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
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
  aiCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gold,
    marginLeft: 10,
  },
  aiText: {
    fontSize: 15,
    color: Colors.white,
    lineHeight: 22,
    marginBottom: 15,
  },
  aiTag: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiTagText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.grayText + '30',
  },
  dayCircleActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldLight,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.black,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
  },
  lastWorkoutCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  workoutHeader: {
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  workoutStat: {
    alignItems: 'center',
  },
  workoutStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.gold,
    marginBottom: 5,
  },
  workoutStatLabel: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gold + '20',
  },
  performanceIcon: {
    marginBottom: 12,
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 3,
  },
  performanceLabel: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
    marginBottom: 12,
  },
  performanceProgress: {
    height: 6,
    backgroundColor: Colors.gray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceBar: {
    height: '100%',
    borderRadius: 3,
  },
  performanceGoal: {
    fontSize: 11,
    color: Colors.grayText,
    fontWeight: '600',
  },
  circuitCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  circuitMap: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray,
  },
  circuitOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    padding: 20,
    justifyContent: 'space-between',
  },
  circuitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circuitTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
    textShadowColor: Colors.black,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  circuitLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  circuitLocationText: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
    textShadowColor: Colors.black,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  circuitTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black + '80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  circuitTime: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  circuitStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: Colors.grayLight,
  },
  circuitStat: {
    alignItems: 'center',
  },
  circuitStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.gold,
    marginBottom: 3,
  },
  circuitStatLabel: {
    fontSize: 11,
    color: Colors.grayText,
    fontWeight: '600',
  },
  circuitDivider: {
    width: 1,
    backgroundColor: Colors.gold + '30',
  },
});
