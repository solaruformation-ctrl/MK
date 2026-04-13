import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Dumbbell, Heart, Target, Clock, Play } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', label: 'Tout', icon: Target },
  { id: 'hiit', label: 'HIIT', icon: Zap },
  { id: 'force', label: 'Force', icon: Dumbbell },
  { id: 'cardio', label: 'Cardio', icon: Heart },
];

const workouts = [
  {
    id: 1,
    title: 'HIIT Explosive',
    category: 'hiit',
    duration: 25,
    calories: 350,
    level: 'Avancé',
    description: 'Brûlez un maximum de calories avec des intervalles haute intensité',
  },
  {
    id: 2,
    title: 'Force Totale',
    category: 'force',
    duration: 45,
    calories: 280,
    level: 'Intermédiaire',
    description: 'Développez votre masse musculaire avec des exercices complets',
  },
  {
    id: 3,
    title: 'Cardio Endurance',
    category: 'cardio',
    duration: 40,
    calories: 400,
    level: 'Débutant',
    description: 'Améliorez votre endurance cardiovasculaire progressivement',
  },
  {
    id: 4,
    title: 'HIIT Débutant',
    category: 'hiit',
    duration: 20,
    calories: 250,
    level: 'Débutant',
    description: 'Introduction aux entraînements par intervalles',
  },
  {
    id: 5,
    title: 'Force Haut du Corps',
    category: 'force',
    duration: 35,
    calories: 240,
    level: 'Intermédiaire',
    description: 'Sculptez vos bras, épaules et dos',
  },
  {
    id: 6,
    title: 'Cardio Sprint',
    category: 'cardio',
    duration: 30,
    calories: 380,
    level: 'Avancé',
    description: 'Séances de sprint pour explosivité maximale',
  },
];

export default function SportScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWorkouts = selectedCategory === 'all'
    ? workouts
    : workouts.filter(w => w.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return Colors.success;
      case 'Intermédiaire':
        return Colors.warning;
      case 'Avancé':
        return Colors.error;
      default:
        return Colors.gold;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.title}>Programmes</Text>
        <Text style={styles.subtitle}>Choisissez votre entraînement</Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}>
              <LinearGradient
                colors={isSelected ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
                style={styles.categoryChip}>
                <Icon
                  size={18}
                  color={isSelected ? Colors.black : Colors.grayText}
                  strokeWidth={2.5}
                />
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive
                ]}>
                  {cat.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.workoutsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.workoutsContainer}>
        {filteredWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            activeOpacity={0.8}>
            <View style={styles.workoutCard}>
              <LinearGradient
                colors={[Colors.grayLight, Colors.gray]}
                style={styles.workoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTitleContainer}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <View style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(workout.level) + '20' }
                    ]}>
                      <Text style={[
                        styles.levelText,
                        { color: getLevelColor(workout.level) }
                      ]}>
                        {workout.level}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.playButton}>
                    <Play size={24} color={Colors.black} fill={Colors.gold} strokeWidth={0} />
                  </View>
                </View>

                <Text style={styles.workoutDescription}>
                  {workout.description}
                </Text>

                <View style={styles.workoutFooter}>
                  <View style={styles.workoutInfo}>
                    <Clock size={16} color={Colors.gold} strokeWidth={2.5} />
                    <Text style={styles.workoutInfoText}>{workout.duration} min</Text>
                  </View>
                  <View style={styles.workoutInfo}>
                    <Zap size={16} color={Colors.gold} strokeWidth={2.5} />
                    <Text style={styles.workoutInfoText}>{workout.calories} kcal</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
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
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.grayText,
  },
  categoryLabelActive: {
    color: Colors.black,
  },
  workoutsScroll: {
    flex: 1,
  },
  workoutsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  workoutCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  workoutGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    borderRadius: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutDescription: {
    fontSize: 14,
    color: Colors.grayText,
    lineHeight: 20,
    marginBottom: 15,
  },
  workoutFooter: {
    flexDirection: 'row',
    gap: 20,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutInfoText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '600',
  },
});
