import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, Trophy, Flame, Target, Users, TrendingUp, Calendar, Award, Medal, Crown } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

type Challenge = {
  id: number;
  title: string;
  description: string;
  duration: string;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline: string;
  icon: any;
};

type Discussion = {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
};

type Friend = {
  id: number;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  points: number;
  workouts: number;
};

type Post = {
  id: number;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  content: string;
  workout?: {
    type: string;
    duration: number;
    calories: number;
  };
  likes: number;
  comments: number;
  timestamp: string;
  achievement?: string;
};

const challenges: Challenge[] = [
  {
    id: 1,
    title: 'Défi 30 Jours HIIT',
    description: 'Complétez 30 séances HIIT en 30 jours',
    duration: '30 jours',
    participants: 1247,
    reward: 'Badge Champion HIIT',
    difficulty: 'hard',
    deadline: 'Termine dans 15 jours',
    icon: Flame,
  },
  {
    id: 2,
    title: 'Cardio Challenge',
    description: 'Brûlez 10,000 calories ce mois-ci',
    duration: '1 mois',
    participants: 892,
    reward: '500 points XP',
    difficulty: 'medium',
    deadline: 'Termine dans 8 jours',
    icon: Target,
  },
  {
    id: 3,
    title: 'Warrior Weekend',
    description: 'Entraînements quotidiens pendant 7 jours',
    duration: '7 jours',
    participants: 2341,
    reward: 'Badge Warrior',
    difficulty: 'easy',
    deadline: 'Commence dans 2 jours',
    icon: Award,
  },
];

const discussions: Discussion[] = [
  {
    id: 1,
    title: 'Meilleurs conseils pour progresser en musculation',
    author: 'Marc L.',
    replies: 45,
    lastActivity: 'Il y a 1h',
    category: 'Musculation',
  },
  {
    id: 2,
    title: 'Nutrition pré-entraînement : vos astuces ?',
    author: 'Sophie M.',
    replies: 32,
    lastActivity: 'Il y a 3h',
    category: 'Nutrition',
  },
  {
    id: 3,
    title: 'Comment rester motivé après un plateau',
    author: 'Thomas K.',
    replies: 67,
    lastActivity: 'Il y a 5h',
    category: 'Motivation',
  },
  {
    id: 4,
    title: 'HIIT vs Cardio classique : votre expérience ?',
    author: 'Emma L.',
    replies: 28,
    lastActivity: 'Il y a 8h',
    category: 'Cardio',
  },
];

const friends: Friend[] = [
  {
    id: 1,
    name: 'Toi',
    avatar: '🔥',
    level: 12,
    levelName: 'Champion',
    points: 4580,
    workouts: 145,
  },
  {
    id: 2,
    name: 'Sophie M.',
    avatar: '👩‍🦰',
    level: 15,
    levelName: 'Légende',
    points: 6230,
    workouts: 198,
  },
  {
    id: 3,
    name: 'Marc L.',
    avatar: '👨‍🦱',
    level: 11,
    levelName: 'Expert',
    points: 4120,
    workouts: 134,
  },
  {
    id: 4,
    name: 'Emma L.',
    avatar: '👩',
    level: 9,
    levelName: 'Warrior',
    points: 3450,
    workouts: 112,
  },
  {
    id: 5,
    name: 'Thomas K.',
    avatar: '👨',
    level: 13,
    levelName: 'Champion',
    points: 5120,
    workouts: 167,
  },
];

const posts: Post[] = [
  {
    id: 1,
    user: {
      name: 'Sophie M.',
      avatar: '👩‍🦰',
      level: 'Champion',
    },
    content: 'Nouveau record personnel sur ma séance HIIT ! La persévérance paye toujours 💪',
    workout: {
      type: 'HIIT Explosive',
      duration: 30,
      calories: 420,
    },
    likes: 124,
    comments: 18,
    timestamp: 'Il y a 2h',
  },
  {
    id: 2,
    user: {
      name: 'Thomas K.',
      avatar: '👨‍🦱',
      level: 'Expert',
    },
    content: '30 jours de suite sans manquer un entraînement ! Objectif atteint 🔥',
    achievement: '30 jours consécutifs',
    likes: 203,
    comments: 34,
    timestamp: 'Il y a 5h',
  },
  {
    id: 3,
    user: {
      name: 'Emma L.',
      avatar: '👩',
      level: 'Warrior',
    },
    content: 'Première séance de force, et je me sens incroyable ! Merci Maïa pour les conseils 💛',
    workout: {
      type: 'Force Totale',
      duration: 45,
      calories: 320,
    },
    likes: 89,
    comments: 12,
    timestamp: 'Il y a 8h',
  },
];

export default function CommunityScreen() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [enrolledChallenges, setEnrolledChallenges] = useState<Set<number>>(new Set([1]));
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'discussions' | 'leaderboard'>('feed');

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleChallenge = (challengeId: number) => {
    setEnrolledChallenges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.success;
      case 'medium': return Colors.warning;
      case 'hard': return Colors.error;
      default: return Colors.grayText;
    }
  };

  const getLevelIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} color={Colors.gold} strokeWidth={2.5} />;
    if (rank === 2) return <Medal size={20} color="#C0C0C0" strokeWidth={2.5} />;
    if (rank === 3) return <Medal size={20} color="#CD7F32" strokeWidth={2.5} />;
    return <Text style={styles.rankNumber}>#{rank}</Text>;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.title}>Communauté</Text>
        <Text style={styles.subtitle}>Défiez-vous et progressez ensemble</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab('feed')}
            activeOpacity={0.7}>
            <LinearGradient
              colors={activeTab === 'feed' ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
              style={styles.tab}>
              <MessageCircle size={18} color={activeTab === 'feed' ? Colors.black : Colors.grayText} strokeWidth={2.5} />
              <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>Fil</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('challenges')}
            activeOpacity={0.7}>
            <LinearGradient
              colors={activeTab === 'challenges' ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
              style={styles.tab}>
              <Target size={18} color={activeTab === 'challenges' ? Colors.black : Colors.grayText} strokeWidth={2.5} />
              <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>Défis</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('discussions')}
            activeOpacity={0.7}>
            <LinearGradient
              colors={activeTab === 'discussions' ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
              style={styles.tab}>
              <Users size={18} color={activeTab === 'discussions' ? Colors.black : Colors.grayText} strokeWidth={2.5} />
              <Text style={[styles.tabText, activeTab === 'discussions' && styles.tabTextActive]}>Discussions</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('leaderboard')}
            activeOpacity={0.7}>
            <LinearGradient
              colors={activeTab === 'leaderboard' ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
              style={styles.tab}>
              <TrendingUp size={18} color={activeTab === 'leaderboard' ? Colors.black : Colors.grayText} strokeWidth={2.5} />
              <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>Classement</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>

        {activeTab === 'feed' && (
          <>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarEmoji}>{post.user.avatar}</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{post.user.name}</Text>
                      <View style={styles.levelBadge}>
                        <Trophy size={12} color={Colors.gold} strokeWidth={2.5} />
                        <Text style={styles.levelText}>{post.user.level}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {post.workout && (
                  <LinearGradient
                    colors={[Colors.grayLight, Colors.gray]}
                    style={styles.workoutInfo}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <View style={styles.workoutHeader}>
                      <Flame size={18} color={Colors.gold} strokeWidth={2.5} />
                      <Text style={styles.workoutType}>{post.workout.type}</Text>
                    </View>
                    <View style={styles.workoutStats}>
                      <Text style={styles.workoutStat}>{post.workout.duration} min</Text>
                      <Text style={styles.workoutDivider}>•</Text>
                      <Text style={styles.workoutStat}>{post.workout.calories} kcal</Text>
                    </View>
                  </LinearGradient>
                )}

                {post.achievement && (
                  <View style={styles.achievementBanner}>
                    <Trophy size={20} color={Colors.gold} strokeWidth={2.5} />
                    <Text style={styles.achievementText}>{post.achievement}</Text>
                  </View>
                )}

                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(post.id)}
                    activeOpacity={0.7}>
                    <Heart
                      size={22}
                      color={likedPosts.has(post.id) ? Colors.gold : Colors.grayText}
                      fill={likedPosts.has(post.id) ? Colors.gold : 'none'}
                      strokeWidth={2.5}
                    />
                    <Text style={[
                      styles.actionText,
                      likedPosts.has(post.id) && styles.actionTextActive
                    ]}>
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.7}>
                    <MessageCircle size={22} color={Colors.grayText} strokeWidth={2.5} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.7}>
                    <Share2 size={22} color={Colors.grayText} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'challenges' && (
          <>
            {challenges.map((challenge) => {
              const Icon = challenge.icon;
              const isEnrolled = enrolledChallenges.has(challenge.id);
              return (
                <View key={challenge.id} style={styles.challengeCard}>
                  <LinearGradient
                    colors={[Colors.grayLight, Colors.gray]}
                    style={styles.challengeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <View style={styles.challengeHeader}>
                      <View style={[styles.challengeIcon, { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' }]}>
                        <Icon size={28} color={getDifficultyColor(challenge.difficulty)} strokeWidth={2.5} />
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) + '20', borderColor: getDifficultyColor(challenge.difficulty) }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(challenge.difficulty) }]}>
                          {challenge.difficulty === 'easy' ? 'Facile' : challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>{challenge.description}</Text>

                    <View style={styles.challengeStats}>
                      <View style={styles.challengeStat}>
                        <Calendar size={16} color={Colors.grayText} strokeWidth={2.5} />
                        <Text style={styles.challengeStatText}>{challenge.duration}</Text>
                      </View>
                      <View style={styles.challengeStat}>
                        <Users size={16} color={Colors.grayText} strokeWidth={2.5} />
                        <Text style={styles.challengeStatText}>{challenge.participants.toLocaleString()} participants</Text>
                      </View>
                    </View>

                    <View style={styles.rewardBanner}>
                      <Award size={18} color={Colors.gold} strokeWidth={2.5} />
                      <Text style={styles.rewardText}>{challenge.reward}</Text>
                    </View>

                    <Text style={styles.deadlineText}>{challenge.deadline}</Text>

                    <TouchableOpacity
                      onPress={() => toggleChallenge(challenge.id)}
                      activeOpacity={0.8}>
                      <LinearGradient
                        colors={isEnrolled ? [Colors.success, Colors.success + 'DD'] : [Colors.gold, Colors.goldDark]}
                        style={styles.challengeButton}>
                        <Text style={styles.challengeButtonText}>
                          {isEnrolled ? '✓ Inscrit' : 'Rejoindre le défi'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              );
            })}
          </>
        )}

        {activeTab === 'discussions' && (
          <>
            {discussions.map((discussion) => (
              <TouchableOpacity key={discussion.id} activeOpacity={0.8}>
                <View style={styles.discussionCard}>
                  <View style={styles.discussionHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{discussion.category}</Text>
                    </View>
                    <Text style={styles.discussionTime}>{discussion.lastActivity}</Text>
                  </View>

                  <Text style={styles.discussionTitle}>{discussion.title}</Text>

                  <View style={styles.discussionFooter}>
                    <Text style={styles.discussionAuthor}>par {discussion.author}</Text>
                    <View style={styles.discussionReplies}>
                      <MessageCircle size={16} color={Colors.gold} strokeWidth={2.5} />
                      <Text style={styles.discussionRepliesText}>{discussion.replies} réponses</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <>
            <View style={styles.leaderboardInfo}>
              <Trophy size={32} color={Colors.gold} strokeWidth={2.5} />
              <Text style={styles.leaderboardTitle}>Classement de tes amis</Text>
              <Text style={styles.leaderboardSubtitle}>Basé sur les points XP du mois</Text>
            </View>

            {friends.map((friend, index) => (
              <View key={friend.id} style={[styles.friendCard, friend.id === 1 && styles.friendCardMe]}>
                <LinearGradient
                  colors={friend.id === 1 ? [Colors.gold + '30', Colors.gold + '10'] : [Colors.grayLight, Colors.gray]}
                  style={styles.friendGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <View style={styles.friendRank}>
                    {getLevelIcon(index + 1)}
                  </View>

                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarEmoji}>{friend.avatar}</Text>
                  </View>

                  <View style={styles.friendInfo}>
                    <Text style={[styles.friendName, friend.id === 1 && styles.friendNameMe]}>{friend.name}</Text>
                    <View style={styles.friendLevel}>
                      <Text style={styles.friendLevelNumber}>Niveau {friend.level}</Text>
                      <Text style={styles.friendLevelDot}>•</Text>
                      <Text style={styles.friendLevelName}>{friend.levelName}</Text>
                    </View>
                  </View>

                  <View style={styles.friendStats}>
                    <View style={styles.friendStatItem}>
                      <Text style={[styles.friendStatValue, friend.id === 1 && styles.friendStatValueMe]}>{friend.points.toLocaleString()}</Text>
                      <Text style={styles.friendStatLabel}>points</Text>
                    </View>
                    <View style={styles.friendStatDivider} />
                    <View style={styles.friendStatItem}>
                      <Text style={[styles.friendStatValue, friend.id === 1 && styles.friendStatValueMe]}>{friend.workouts}</Text>
                      <Text style={styles.friendStatLabel}>séances</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </>
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
  tabsContainer: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
  },
  tabs: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.grayText,
  },
  tabTextActive: {
    color: Colors.black,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
  timestamp: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 15,
    color: Colors.white,
    lineHeight: 22,
    marginBottom: 15,
  },
  workoutInfo: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gold + '20',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutStat: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
  },
  workoutDivider: {
    fontSize: 13,
    color: Colors.grayText,
  },
  achievementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.gold + '20',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gold,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.gold + '20',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
  },
  actionTextActive: {
    color: Colors.gold,
  },
  challengeCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '800',
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.grayText,
    lineHeight: 20,
    marginBottom: 15,
  },
  challengeStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  challengeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeStatText: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gold,
  },
  deadlineText: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
    marginBottom: 15,
  },
  challengeButton: {
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
  },
  challengeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  discussionCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
  discussionTime: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 22,
    marginBottom: 12,
  },
  discussionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discussionAuthor: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
  },
  discussionReplies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discussionRepliesText: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '600',
  },
  leaderboardInfo: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 15,
    marginBottom: 5,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
  },
  friendCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  friendCardMe: {
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  friendGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
  },
  friendRank: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.grayText,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  friendAvatarEmoji: {
    fontSize: 26,
  },
  friendInfo: {
    flex: 1,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  friendNameMe: {
    color: Colors.gold,
  },
  friendLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  friendLevelNumber: {
    fontSize: 12,
    color: Colors.grayText,
    fontWeight: '600',
  },
  friendLevelDot: {
    fontSize: 12,
    color: Colors.grayText,
  },
  friendLevelName: {
    fontSize: 11,
    color: Colors.gold,
    fontWeight: '700',
  },
  friendStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  friendStatItem: {
    alignItems: 'center',
  },
  friendStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  friendStatValueMe: {
    color: Colors.gold,
  },
  friendStatLabel: {
    fontSize: 11,
    color: Colors.grayText,
    fontWeight: '600',
  },
  friendStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gold + '30',
  },
});
