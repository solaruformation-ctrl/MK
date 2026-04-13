import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Linking, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, Video, Crown } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supabase, Video as VideoType } from '@/lib/supabase';

const { width } = Dimensions.get('window');

type Category = {
  id: string;
  label: string;
};

type Difficulty = {
  id: string;
  label: string;
  color: string;
};

const categories: Category[] = [
  { id: 'all', label: 'Tout' },
  { id: 'workout', label: 'Entraînement' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'tips', label: 'Conseils' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'cardio', label: 'Cardio' },
];

const difficulties: Difficulty[] = [
  { id: 'all', label: 'Tous niveaux', color: Colors.white },
  { id: 'beginner', label: 'Débutant', color: Colors.success },
  { id: 'intermediate', label: 'Intermédiaire', color: Colors.warning },
  { id: 'advanced', label: 'Avancé', color: Colors.error },
];

export default function VideosScreen() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    const diffObj = difficulties.find(d => d.id === difficulty);
    return diffObj?.color || Colors.white;
  };

  const openVideo = (youtubeUrl: string) => {
    Linking.openURL(youtubeUrl).catch(err => {
      console.error('Error opening video:', err);
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.title}>Vidéos</Text>
        <Text style={styles.subtitle}>{videos.length} vidéos disponibles</Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}>
              <LinearGradient
                colors={isSelected ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
                style={styles.categoryChip}>
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
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.levelsScroll}
        contentContainerStyle={styles.levelsContainer}>
        {difficulties.map((difficulty) => {
          const isSelected = selectedDifficulty === difficulty.id;
          return (
            <TouchableOpacity
              key={difficulty.id}
              onPress={() => setSelectedDifficulty(difficulty.id)}
              activeOpacity={0.7}>
              <View style={[
                styles.levelChip,
                isSelected && { backgroundColor: difficulty.color + '30', borderColor: difficulty.color }
              ]}>
                <Text style={[
                  styles.levelLabel,
                  isSelected && { color: difficulty.color }
                ]}>
                  {difficulty.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.videosScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.videosContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
          />
        }>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Chargement...</Text>
          </View>
        ) : filteredVideos.length === 0 ? (
          <View style={styles.emptyState}>
            <Video size={64} color={Colors.grayText} strokeWidth={1.5} />
            <Text style={styles.emptyText}>Aucune vidéo trouvée</Text>
            <Text style={styles.emptySubtext}>Essayez de modifier vos filtres</Text>
          </View>
        ) : (
          filteredVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              activeOpacity={0.8}
              onPress={() => openVideo(video.youtube_url)}>
              <View style={styles.videoCard}>
                <Image
                  source={{ uri: video.thumbnail_url || 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />

                <View style={styles.playIconContainer}>
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    style={styles.playIcon}>
                    <Play size={32} color={Colors.black} fill={Colors.black} strokeWidth={0} />
                  </LinearGradient>
                </View>

                <LinearGradient
                  colors={['transparent', Colors.black + 'DD']}
                  style={styles.thumbnailOverlay}>
                  <View style={styles.badgesRow}>
                    <View style={styles.durationBadge}>
                      <Clock size={14} color={Colors.white} strokeWidth={2.5} />
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    {video.is_premium && (
                      <View style={styles.premiumBadge}>
                        <Crown size={14} color={Colors.gold} strokeWidth={2.5} />
                        <Text style={styles.premiumText}>Premium</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={[Colors.grayLight, Colors.gray]}
                  style={styles.videoInfo}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <View style={styles.videoHeader}>
                    <View style={styles.videoTitleContainer}>
                      <Text style={styles.videoTitle}>{video.title}</Text>
                      {video.description ? (
                        <Text style={styles.videoDescription} numberOfLines={2}>
                          {video.description}
                        </Text>
                      ) : null}
                    </View>
                    <View style={[
                      styles.levelBadge,
                      { backgroundColor: getDifficultyColor(video.difficulty) + '20', borderColor: getDifficultyColor(video.difficulty) }
                    ]}>
                      <Text style={[styles.levelBadgeText, { color: getDifficultyColor(video.difficulty) }]}>
                        {difficulties.find(d => d.id === video.difficulty)?.label || 'Tous'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{video.category}</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  levelsScroll: {
    maxHeight: 50,
  },
  levelsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 10,
  },
  levelChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.grayLight,
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  levelLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.grayText,
  },
  videosScroll: {
    flex: 1,
  },
  videosContainer: {
    padding: 20,
    paddingTop: 10,
  },
  videoCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    backgroundColor: Colors.grayLight,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray,
  },
  playIconContainer: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -35,
    zIndex: 2,
  },
  playIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
    padding: 15,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black + '80',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black + '80',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gold,
  },
  videoInfo: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  videoTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  videoDescription: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '500',
    lineHeight: 20,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gold,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 20,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.grayText,
  },
});
